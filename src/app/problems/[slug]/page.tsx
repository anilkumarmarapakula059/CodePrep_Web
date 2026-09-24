'use client';

import { useState, useEffect, use } from 'react';
import dynamic from 'next/dynamic';
import {
  Code2,
  Play,
  Send,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronRight,
  BookOpen,
  HelpCircle,
  Lightbulb,
  FileCode,
  Layers,
  Building2,
  Copy,
  Check,
  Zap,
  Terminal,
  AlertTriangle,
} from 'lucide-react';
import confetti from 'canvas-confetti';

// Dynamically import Monaco Editor to avoid SSR issues
const Editor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

export default function ProblemDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  const [problem, setProblem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'description' | 'hints' | 'solutions' | 'submissions'>('description');

  // Editor states
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState('');
  const [revealedHintIndex, setRevealedHintIndex] = useState(0);

  // Execution states
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [executionResult, setExecutionResult] = useState<any>(null);
  const [selectedTestCaseIndex, setSelectedTestCaseIndex] = useState(0);
  const [copiedExample, setCopiedExample] = useState<number | null>(null);

  // AI Mentor states
  const [isAIMentorOpen, setIsAIMentorOpen] = useState(false);
  const [mentorMode, setMentorMode] = useState<'explain' | 'hint' | 'debug' | 'approach' | 'complexity'>('hint');
  const [mentorReply, setMentorReply] = useState<string>('');
  const [mentorLoading, setMentorLoading] = useState(false);

  useEffect(() => {
    async function loadProblem() {
      try {
        const res = await fetch(`/api/problems/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setProblem(data.problem);
          // Set starter code for default language
          const defaultLang = 'python';
          setLanguage(defaultLang);
          setCode(data.problem.starterCode?.[defaultLang] || '# Write your solution here\n');
        }
      } catch (e) {
        console.error('Failed to load problem:', e);
      } finally {
        setLoading(false);
      }
    }
    loadProblem();
  }, [slug]);

  // Handle language switch
  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang);
    if (problem?.starterCode?.[newLang]) {
      setCode(problem.starterCode[newLang]);
    }
  };

  // Run code on public test cases
  const handleRunCode = async () => {
    setRunning(true);
    setExecutionResult(null);
    try {
      const res = await fetch(`/api/problems/${slug}/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language }),
      });
      const data = await res.json();
      setExecutionResult(data);
      setSelectedTestCaseIndex(0);
    } catch (e) {
      console.error(e);
    } finally {
      setRunning(false);
    }
  };

  // Submit code on all test cases (public + hidden)
  const handleSubmitCode = async () => {
    setSubmitting(true);
    setExecutionResult(null);
    try {
      const res = await fetch(`/api/problems/${slug}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language }),
      });
      const data = await res.json();
      setExecutionResult(data);
      setSelectedTestCaseIndex(0);

      if (data.status === 'ACCEPTED') {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  // Trigger AI Mentor query
  const handleAskMentor = async (mode: 'explain' | 'hint' | 'debug' | 'approach' | 'complexity') => {
    setMentorMode(mode);
    setMentorLoading(true);
    setIsAIMentorOpen(true);
    try {
      const res = await fetch('/api/ai-mentor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemTitle: problem?.title,
          problemDescription: problem?.description,
          userCode: code,
          language,
          mode,
        }),
      });
      const data = await res.json();
      setMentorReply(data.reply || 'No advice received.');
    } catch (e) {
      setMentorReply('AI Mentor service temporarily unreachable. Check your network or local heuristics.');
    } finally {
      setMentorLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-400 font-mono">Loading problem workspace...</p>
        </div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Problem not found</h2>
        <a href="/problems" className="text-xs text-emerald-400 underline">
          Return to Problem Library
        </a>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col lg:flex-row overflow-hidden bg-slate-950">
      {/* ================= LEFT PANE: STATEMENT, HINTS, SOLUTIONS, SUBMISSIONS ================= */}
      <div className="w-full lg:w-1/2 flex flex-col border-b lg:border-b-0 lg:border-r border-slate-800 bg-slate-950 overflow-hidden">
        {/* Header Summary */}
        <div className="p-4 border-b border-slate-800 bg-slate-900/60">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <h1 className="text-lg font-bold text-white flex items-center gap-2">
              <span>{problem.title}</span>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                  problem.difficulty === 'BASIC'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : problem.difficulty === 'INTERMEDIATE'
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                }`}
              >
                {problem.difficulty}
              </span>
            </h1>

            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-amber-400">{'★'.repeat(problem.frequency || 3)}</span>
              <span className="text-slate-400">• {problem.acceptanceRate}% accept</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400">Asked by:</span>
            {problem.companies?.map((c: string) => (
              <span key={c} className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 text-[10px] font-medium">
                {c}
              </span>
            ))}
            <span className="text-slate-600">|</span>
            {problem.topics?.map((t: string) => (
              <span key={t} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-800 bg-slate-950 px-4 text-xs font-medium">
          <button
            onClick={() => setActiveTab('description')}
            className={`py-3 px-3 border-b-2 transition-colors ${
              activeTab === 'description'
                ? 'border-emerald-500 text-white font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Description
          </button>
          <button
            onClick={() => setActiveTab('hints')}
            className={`py-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'hints'
                ? 'border-emerald-500 text-white font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            <span>Hints ({problem.hints?.length || 0})</span>
          </button>
          <button
            onClick={() => setActiveTab('solutions')}
            className={`py-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'solutions'
                ? 'border-emerald-500 text-white font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode className="w-3.5 h-3.5 text-sky-400" />
            <span>Solutions</span>
          </button>
          <button
            onClick={() => setActiveTab('submissions')}
            className={`py-3 px-3 border-b-2 transition-colors ${
              activeTab === 'submissions'
                ? 'border-emerald-500 text-white font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Submissions
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 text-sm text-slate-300 leading-relaxed">
          {/* TAB 1: DESCRIPTION */}
          {activeTab === 'description' && (
            <div className="space-y-6">
              <div className="whitespace-pre-wrap">{problem.description}</div>

              {/* Examples */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Examples
                </h3>
                {problem.examples?.map((ex: any, idx: number) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 font-mono text-xs">
                    <div className="flex justify-between items-center text-slate-400 text-[11px] font-sans">
                      <span className="font-bold text-slate-300">Example {idx + 1}</span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(ex.input);
                          setCopiedExample(idx);
                          setTimeout(() => setCopiedExample(null), 1500);
                        }}
                        className="flex items-center gap-1 hover:text-white"
                      >
                        {copiedExample === idx ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedExample === idx ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <div>
                      <span className="text-slate-500">Input: </span>
                      <span className="text-emerald-300">{ex.input}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Output: </span>
                      <span className="text-sky-300">{ex.output}</span>
                    </div>
                    {ex.explanation && (
                      <div className="text-slate-400 text-[11px] font-sans pt-1 border-t border-slate-800/80">
                        <b>Explanation:</b> {ex.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Constraints */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Constraints
                </h3>
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-slate-400 space-y-1">
                  {problem.constraints?.split('\n').map((c: string, idx: number) => (
                    <div key={idx}>{c}</div>
                  ))}
                </div>
              </div>

              {/* Verified Source */}
              <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/60 text-xs text-slate-400">
                🔍 <b>Verified Reference:</b> {problem.frequencySource}
              </div>
            </div>
          )}

          {/* TAB 2: PROGRESSIVE HINTS */}
          {activeTab === 'hints' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
                💡 <b>Zero-Spoiler Progressive Guidance</b>: Hints are unlocked one at a time. Try thinking through each hint before revealing the next!
              </div>

              {problem.hints?.map((h: any, idx: number) => {
                const isUnlocked = idx < revealedHintIndex;
                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border transition-all ${
                      isUnlocked
                        ? 'bg-slate-900 border-slate-700 text-slate-200'
                        : 'bg-slate-950 border-slate-800/60 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-amber-400">
                        Hint {h.hintIndex}
                      </span>
                      {!isUnlocked && (
                        <span className="text-[10px] text-slate-400 uppercase font-mono">
                          Locked
                        </span>
                      )}
                    </div>
                    {isUnlocked ? (
                      <p className="text-xs text-slate-300 leading-relaxed mt-2">
                        {h.hintText}
                      </p>
                    ) : (
                      <p className="text-xs text-slate-500 italic mt-1">
                        Click "Reveal Next Hint" below to unlock.
                      </p>
                    )}
                  </div>
                );
              })}

              {revealedHintIndex < (problem.hints?.length || 0) && (
                <button
                  onClick={() => setRevealedHintIndex(revealedHintIndex + 1)}
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md"
                >
                  <Lightbulb className="w-4 h-4" />
                  <span>Reveal Next Hint ({revealedHintIndex + 1}/{problem.hints?.length})</span>
                </button>
              )}
            </div>
          )}

          {/* TAB 3: STEP-BY-STEP SOLUTIONS */}
          {activeTab === 'solutions' && (
            <div className="space-y-6">
              {problem.solutions?.map((sol: any, idx: number) => (
                <div key={idx} className="space-y-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <h4 className="text-base font-bold text-white">{sol.approachTitle}</h4>
                      <span className="text-[10px] uppercase font-semibold text-emerald-400">
                        {sol.approachType} Approach
                      </span>
                    </div>
                    <div className="text-right text-xs font-mono text-slate-400">
                      <div>Time: <b className="text-white">{sol.timeComplexity}</b></div>
                      <div>Space: <b className="text-white">{sol.spaceComplexity}</b></div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{sol.explanation}</p>

                  {/* Step by step */}
                  {sol.stepByStep && (
                    <div className="space-y-2">
                      <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                        Algorithm Steps:
                      </h5>
                      <ol className="list-decimal pl-4 space-y-1 text-xs text-slate-400">
                        {sol.stepByStep.map((step: string, sIdx: number) => (
                          <li key={sIdx}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {/* Solution Code */}
                  <div className="space-y-2">
                    <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Reference Implementation ({language}):
                    </h5>
                    <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 overflow-x-auto text-xs font-mono text-emerald-300 leading-relaxed">
                      {language === 'python'
                        ? sol.codePython
                        : language === 'javascript'
                        ? sol.codeJavascript
                        : language === 'java'
                        ? sol.codeJava
                        : sol.codeCpp}
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: SUBMISSIONS HISTORY */}
          {activeTab === 'submissions' && (
            <div className="space-y-3">
              {problem.recentSubmissions?.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 bg-slate-900 rounded-xl">
                  No submissions recorded yet. Click "Submit" to validate your solution!
                </div>
              ) : (
                problem.recentSubmissions?.map((sub: any) => (
                  <div
                    key={sub.id}
                    className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs font-mono"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded font-semibold ${
                            sub.status === 'ACCEPTED'
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : 'bg-rose-500/10 text-rose-400'
                          }`}
                        >
                          {sub.status}
                        </span>
                        <span className="text-slate-400">{sub.language}</span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {new Date(sub.createdAt).toLocaleString()}
                      </div>
                    </div>

                    <div className="text-right text-slate-400">
                      <div>{sub.executionTimeMs}ms</div>
                      <div className="text-[10px]">{sub.passedTestCases}/{sub.totalTestCases} Passed</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* ================= RIGHT PANE: MONACO CODE EDITOR & TEST RESULTS ================= */}
      <div className="w-full lg:w-1/2 flex flex-col bg-slate-900 overflow-hidden">
        {/* Editor Controls Bar */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center space-x-3">
            {/* Language Selector */}
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1 text-xs font-mono focus:outline-none focus:border-emerald-500"
            >
              <option value="python">Python 3.14</option>
              <option value="javascript">JavaScript (Node.js)</option>
              <option value="java">Java 17</option>
              <option value="cpp">C++ 20</option>
            </select>

            <button
              onClick={() => {
                if (problem?.starterCode?.[language]) setCode(problem.starterCode[language]);
              }}
              title="Reset Code Template"
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* AI Mentor Trigger */}
          <button
            onClick={() => handleAskMentor(mentorMode)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>AI Mentor</span>
          </button>
        </div>

        {/* Monaco Editor Container */}
        <div className="flex-1 min-h-[300px] relative">
          <Editor
            height="100%"
            language={language === 'js' ? 'javascript' : language === 'cpp' ? 'cpp' : language}
            value={code}
            onChange={(val) => setCode(val || '')}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 13,
              fontFamily: "'Fira Code', 'JetBrains Mono', Consolas, monospace",
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 4,
              renderLineHighlight: 'all',
              lineNumbers: 'on',
              padding: { top: 12, bottom: 12 },
            }}
          />
        </div>

        {/* Console / Test Case Results Bar */}
        <div className="border-t border-slate-800 bg-slate-950 flex flex-col max-h-64 overflow-hidden">
          {/* Action Buttons: Run vs Submit */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800/80 bg-slate-900/50">
            <div className="flex items-center space-x-2 text-xs font-semibold text-slate-300">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span>Test Console</span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleRunCode}
                disabled={running || submitting}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 disabled:opacity-50 transition-colors"
              >
                <Play className="w-3 h-3 text-emerald-400 fill-emerald-400" />
                <span>{running ? 'Running...' : 'Run Code'}</span>
              </button>

              <button
                onClick={handleSubmitCode}
                disabled={running || submitting}
                className="flex items-center gap-1.5 px-5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-md disabled:opacity-50 transition-colors"
              >
                <Send className="w-3 h-3" />
                <span>{submitting ? 'Submitting...' : 'Submit'}</span>
              </button>
            </div>
          </div>

          {/* Test Case Output Viewer */}
          <div className="p-4 overflow-y-auto font-mono text-xs">
            {executionResult ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {executionResult.status === 'ACCEPTED' ? (
                      <span className="flex items-center gap-1 text-emerald-400 font-bold text-sm">
                        <CheckCircle2 className="w-4 h-4" /> Accepted
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-rose-400 font-bold text-sm">
                        <XCircle className="w-4 h-4" /> {executionResult.status.replace(/_/g, ' ')}
                      </span>
                    )}
                    <span className="text-slate-400 text-xs">
                      • {executionResult.passedTestCases}/{executionResult.totalTestCases} Cases Passed
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-slate-400 text-[11px]">
                    <span>⏱️ {executionResult.executionTimeMs}ms</span>
                    <span>💾 {Math.round(executionResult.memoryKb / 1024)}MB</span>
                  </div>
                </div>

                {/* Compilation / Runtime Error if present */}
                {executionResult.compilationError && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 whitespace-pre-wrap">
                    {executionResult.compilationError}
                  </div>
                )}

                {/* Test case tabs */}
                <div className="flex gap-2 border-b border-slate-800 pb-2">
                  {executionResult.results?.map((res: any, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedTestCaseIndex(idx)}
                      className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors ${
                        selectedTestCaseIndex === idx
                          ? 'bg-slate-800 text-white font-bold'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <span className={res.passed ? 'text-emerald-400' : 'text-rose-400'}>
                        {res.passed ? '✓' : '✗'}
                      </span>{' '}
                      Case {idx + 1}
                    </button>
                  ))}
                </div>

                {/* Current Selected Test Case Inspection */}
                {executionResult.results?.[selectedTestCaseIndex] && (
                  <div className="space-y-2 bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <div>
                      <span className="text-slate-500">Input:</span>
                      <div className="text-slate-300 mt-0.5">{executionResult.results[selectedTestCaseIndex].input}</div>
                    </div>
                    <div>
                      <span className="text-slate-500">Expected:</span>
                      <div className="text-emerald-400 mt-0.5">{executionResult.results[selectedTestCaseIndex].expectedOutput}</div>
                    </div>
                    <div>
                      <span className="text-slate-500">Actual Output:</span>
                      <div className={executionResult.results[selectedTestCaseIndex].passed ? 'text-emerald-400 mt-0.5' : 'text-rose-400 mt-0.5'}>
                        {executionResult.results[selectedTestCaseIndex].actualOutput || '(Empty output)'}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-slate-500 italic py-2">
                Click "Run Code" to test on public cases or "Submit" to validate against the full MNC test suite.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ================= AI MENTOR SLIDEOUT DRAWER ================= */}
      {isAIMentorOpen && (
        <div className="fixed inset-y-0 right-0 w-full sm:w-96 z-50 bg-slate-900 border-l border-slate-800 shadow-2xl p-5 flex flex-col space-y-4 animate-in slide-in-from-right duration-200">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">AI Coding Mentor</h3>
            </div>
            <button
              onClick={() => setIsAIMentorOpen(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              ✕ Close
            </button>
          </div>

          {/* Mode Switcher Buttons */}
          <div className="grid grid-cols-3 gap-1.5 text-[11px] font-medium">
            <button
              onClick={() => handleAskMentor('hint')}
              className={`py-1.5 px-2 rounded-lg border text-center transition-colors ${
                mentorMode === 'hint' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}
            >
              💡 Hint
            </button>
            <button
              onClick={() => handleAskMentor('debug')}
              className={`py-1.5 px-2 rounded-lg border text-center transition-colors ${
                mentorMode === 'debug' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}
            >
              🔍 Debug
            </button>
            <button
              onClick={() => handleAskMentor('approach')}
              className={`py-1.5 px-2 rounded-lg border text-center transition-colors ${
                mentorMode === 'approach' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}
            >
              🎯 Approach
            </button>
            <button
              onClick={() => handleAskMentor('complexity')}
              className={`py-1.5 px-2 rounded-lg border text-center transition-colors ${
                mentorMode === 'complexity' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}
            >
              ⏱️ Big-O
            </button>
            <button
              onClick={() => handleAskMentor('explain')}
              className={`col-span-2 py-1.5 px-2 rounded-lg border text-center transition-colors ${
                mentorMode === 'explain' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}
            >
              📚 Explain Concept
            </button>
          </div>

          {/* Mentor Advice Body */}
          <div className="flex-1 overflow-y-auto p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
            {mentorLoading ? (
              <div className="flex items-center justify-center py-12 gap-2 text-slate-400">
                <div className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                <span>Mentor analyzing your code...</span>
              </div>
            ) : (
              mentorReply
            )}
          </div>
        </div>
      )}
    </div>
  );
}
