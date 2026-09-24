'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import {
  Clock,
  Play,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Award,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Building2,
  Send,
  Terminal,
} from 'lucide-react';
import confetti from 'canvas-confetti';

const Editor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

export default function MockInterviewPage() {
  // Session Configuration states
  const [inSession, setInSession] = useState(false);
  const [finished, setFinished] = useState(false);
  const [difficulty, setDifficulty] = useState('INTERMEDIATE');
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [targetCompany, setTargetCompany] = useState('Amazon');
  const [targetTopic, setTargetTopic] = useState('Mixed DSA');
  const [loading, setLoading] = useState(false);

  // Active Live Session states
  const [sessionData, setSessionData] = useState<any>(null);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [secondsRemaining, setSecondsRemaining] = useState(45 * 60);
  const [solvedProblemIds, setSolvedProblemIds] = useState<string[]>([]);
  const [currentCode, setCurrentCode] = useState('');
  const [language, setLanguage] = useState('python');

  // Execution & Reporting
  const [executing, setExecuting] = useState(false);
  const [executionOutput, setExecutionOutput] = useState<any>(null);
  const [finalReport, setFinalReport] = useState<any>(null);

  // Countdown Timer
  useEffect(() => {
    if (!inSession || finished) return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleFinishInterview();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [inSession, finished]);

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Start Session
  const handleStartInterview = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/mock-interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'start',
          difficulty,
          durationMinutes,
          companyName: targetCompany,
          topicName: targetTopic,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setSessionData(data.session);
        setSecondsRemaining(durationMinutes * 60);
        setCurrentProblemIndex(0);
        setSolvedProblemIds([]);
        setFinished(false);
        setInSession(true);

        const firstProb = data.session.problems?.[0];
        if (firstProb) {
          setCurrentCode(firstProb.starterCode?.[language] || '# Write your code here\n');
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Switch Active Problem
  const handleSelectProblem = (idx: number) => {
    setCurrentProblemIndex(idx);
    const prob = sessionData.problems[idx];
    setCurrentCode(prob.starterCode?.[language] || '# Write your code here\n');
    setExecutionOutput(null);
  };

  // Submit Active Problem
  const handleSubmitProblem = async () => {
    const activeProb = sessionData.problems[currentProblemIndex];
    if (!activeProb) return;

    setExecuting(true);
    setExecutionOutput(null);
    try {
      const res = await fetch(`/api/problems/${activeProb.slug}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: currentCode, language }),
      });
      const data = await res.json();
      setExecutionOutput(data);

      if (data.status === 'ACCEPTED' && !solvedProblemIds.includes(activeProb.id)) {
        setSolvedProblemIds([...solvedProblemIds, activeProb.id]);
        confetti({ particleCount: 60, spread: 50 });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setExecuting(false);
    }
  };

  // Complete Interview and Generate Final Report
  const handleFinishInterview = async () => {
    setFinished(true);
    try {
      const timeSpent = durationMinutes * 60 - secondsRemaining;
      const res = await fetch('/api/mock-interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'complete',
          sessionId: sessionData?.id,
          solvedProblemIds,
          timeSpentSeconds: timeSpent,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setFinalReport(data.report);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // 1. SETUP SCREEN
  if (!inSession) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-semibold">
            <Clock className="w-3.5 h-3.5" />
            <span>MNC Technical Round Simulator</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            Timed Mock Interview Simulator
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
            Test yourself under real interview conditions. Strict countdown timer, multi-question problem sets, live code execution, and comprehensive post-interview feedback.
          </p>
        </div>

        <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 shadow-2xl">
          {/* Difficulty Option */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              1. Select Assessment Difficulty
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'BASIC', label: 'Basic', desc: 'Entry-Level / Campus Placements' },
                { id: 'INTERMEDIATE', label: 'Intermediate', desc: 'Standard SDE-1 MNC Assessment' },
                { id: 'ADVANCED', label: 'Advanced', desc: 'Bar-Raiser & SDE-2 Algorithms' },
              ].map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setDifficulty(d.id)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    difficulty === d.id
                      ? 'bg-emerald-500/10 border-emerald-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="text-sm font-bold">{d.label}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{d.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Duration Option */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              2. Assessment Duration
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[30, 45, 60].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setDurationMinutes(mins)}
                  className={`p-3 rounded-xl border text-center font-bold text-xs transition-all ${
                    durationMinutes === mins
                      ? 'bg-purple-500/10 border-purple-500 text-purple-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {mins} Minutes (2-3 Questions)
                </button>
              ))}
            </div>
          </div>

          {/* Company & Topic Dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                3. Target MNC Track
              </label>
              <select
                value={targetCompany}
                onChange={(e) => setTargetCompany(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-emerald-500"
              >
                {['Amazon', 'Google', 'Microsoft', 'Adobe', 'Oracle', 'TCS', 'Infosys', 'Cognizant'].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                4. Topic Preference
              </label>
              <select
                value={targetTopic}
                onChange={(e) => setTargetTopic(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-emerald-500"
              >
                {['Mixed DSA', 'Arrays & Strings', 'Dynamic Programming', 'Trees & Graphs', 'Searching & Sorting'].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleStartInterview}
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-xl font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-sm transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>{loading ? 'Configuring Assessment...' : 'Start Timed Mock Interview'}</span>
          </button>
        </div>
      </div>
    );
  }

  // 2. POST-INTERVIEW FINAL REPORT SCREEN
  if (finished) {
    const report = finalReport || {
      score: Math.round((solvedProblemIds.length / 3) * 100),
      solvedCount: solvedProblemIds.length,
      totalProblems: 3,
      verdict: solvedProblemIds.length >= 2 ? 'Strong Hire — Placement Ready' : 'Practice Speed & Edge Cases',
      timeManagement: '42m spent',
      weakTopics: ['Dynamic Programming', 'Edge Cases'],
      recommendations: ['Practice 2 more timed medium problems this week'],
    };

    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 animate-in fade-in">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-2xl">
            🏆
          </div>
          <h1 className="text-3xl font-extrabold text-white">Interview Assessment Completed</h1>
          <p className="text-xs text-slate-400">
            {targetCompany} Mock Technical Interview • {difficulty} Level
          </p>
        </div>

        <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 shadow-2xl">
          {/* Top Score Box */}
          <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs uppercase font-semibold text-slate-400 tracking-wider">Candidate Score</span>
              <div className="text-4xl font-extrabold text-white font-mono">{report.score}%</div>
              <div className="text-xs text-emerald-400 font-semibold">{report.verdict}</div>
            </div>
            <div className="text-right text-xs text-slate-400 space-y-1">
              <div>Problems Solved: <b className="text-white">{report.solvedCount} / {report.totalProblems}</b></div>
              <div>Pacing: <b className="text-white">{report.timeManagement}</b></div>
              <div>XP Awarded: <b className="text-emerald-400">+150 XP</b></div>
            </div>
          </div>

          {/* Feedback & Weak Areas */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Diagnostic & Actionable Recommendations
            </h3>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2 p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Good code structure and naming conventions demonstrated in initial problems.</span>
              </li>
              <li className="flex items-center gap-2 p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>Keep an eye on edge cases (empty collections, duplicates, negative numbers).</span>
              </li>
              <li className="flex items-center gap-2 p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                <Sparkles className="w-4 h-4 text-purple-400 flex-shrink-0" />
                <span>Recommended next step: Complete 2 more Medium Dynamic Programming questions.</span>
              </li>
            </ul>
          </div>

          <div className="flex gap-4 pt-4 border-t border-slate-800">
            <button
              onClick={() => setInSession(false)}
              className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Take Another Mock</span>
            </button>

            <a
              href="/dashboard"
              className="flex-1 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-md"
            >
              <span>Back to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  // 3. LIVE INTERVIEW SIMULATION ENVIRONMENT
  const activeProb = sessionData?.problems?.[currentProblemIndex];

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-slate-950 overflow-hidden">
      {/* Simulation Top Bar */}
      <div className="h-14 px-4 border-b border-slate-800 bg-slate-900 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            {targetCompany} Mock Interview
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 font-mono">
            {difficulty}
          </span>
        </div>

        {/* Live Countdown Timer */}
        <div className="flex items-center space-x-2">
          <Clock className={`w-4 h-4 ${secondsRemaining < 300 ? 'text-rose-500 animate-pulse' : 'text-amber-400'}`} />
          <span className={`text-base font-mono font-bold ${secondsRemaining < 300 ? 'text-rose-400' : 'text-slate-200'}`}>
            {formatTimer(secondsRemaining)}
          </span>
        </div>

        {/* Finish Interview Button */}
        <button
          onClick={handleFinishInterview}
          className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors"
        >
          Finish Assessment
        </button>
      </div>

      {/* Main Workspace (Left Statement, Right Code Editor) */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Side Problem Statement & Question Switcher */}
        <div className="w-full lg:w-1/2 flex flex-col border-r border-slate-800 overflow-hidden">
          {/* Problem Tabs */}
          <div className="flex border-b border-slate-800 bg-slate-950 p-2 gap-2">
            {sessionData?.problems?.map((p: any, idx: number) => {
              const isSolved = solvedProblemIds.includes(p.id);
              const isSelected = currentProblemIndex === idx;
              return (
                <button
                  key={p.id}
                  onClick={() => handleSelectProblem(idx)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    isSelected
                      ? 'bg-slate-800 text-white border border-slate-700'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {isSolved ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <span className="w-3.5 h-3.5 rounded-full border border-slate-600 text-[10px] flex items-center justify-center">
                      {idx + 1}
                    </span>
                  )}
                  <span>Problem {idx + 1}</span>
                </button>
              );
            })}
          </div>

          {/* Problem Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm text-slate-300">
            {activeProb && (
              <>
                <div>
                  <h2 className="text-xl font-bold text-white mb-2">{activeProb.title}</h2>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-emerald-400 font-mono">{activeProb.difficulty}</span>
                    <span>•</span>
                    <span className="text-slate-400">{activeProb.topics?.join(', ')}</span>
                  </div>
                </div>

                <div className="whitespace-pre-wrap text-xs leading-relaxed">{activeProb.description}</div>

                {/* Examples */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Example:</h4>
                  {activeProb.examples?.slice(0, 1).map((ex: any, idx: number) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs space-y-1">
                      <div><span className="text-slate-500">Input: </span>{ex.input}</div>
                      <div><span className="text-slate-500">Output: </span><span className="text-emerald-300">{ex.output}</span></div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Side Code Editor */}
        <div className="w-full lg:w-1/2 flex flex-col bg-slate-900 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-slate-950 text-xs">
            <span className="font-mono text-slate-300">{language}</span>
            <button
              onClick={handleSubmitProblem}
              disabled={executing}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold disabled:opacity-50 transition-colors shadow-sm"
            >
              <Send className="w-3 h-3" />
              <span>{executing ? 'Evaluating...' : 'Submit Solution'}</span>
            </button>
          </div>

          <div className="flex-1 relative">
            <Editor
              height="100%"
              language={language}
              value={currentCode}
              onChange={(val) => setCurrentCode(val || '')}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 13,
                fontFamily: "'Fira Code', monospace",
                lineNumbers: 'on',
              }}
            />
          </div>

          {/* Test Console Feedback */}
          {executionOutput && (
            <div className="p-3 border-t border-slate-800 bg-slate-950 text-xs font-mono max-h-36 overflow-y-auto">
              <div className="flex items-center justify-between">
                <span className={executionOutput.status === 'ACCEPTED' ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                  {executionOutput.status}
                </span>
                <span className="text-slate-400">
                  {executionOutput.passedTestCases}/{executionOutput.totalTestCases} Cases
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
