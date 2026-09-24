'use client';

import { useState, useEffect } from 'react';
import {
  Shield,
  PlusCircle,
  Trash2,
  Users,
  Code2,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Building2,
  FileCode,
} from 'lucide-react';

export default function AdminPage() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'analytics' | 'add-problem' | 'users'>('analytics');

  // Form states for creating a new problem
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [difficulty, setDifficulty] = useState('BASIC');
  const [frequency, setFrequency] = useState(4);
  const [frequencySource, setFrequencySource] = useState('Tier-1 MNC Screening 2025');
  const [description, setDescription] = useState('');
  const [testInput, setTestInput] = useState('1 2 3');
  const [testOutput, setTestOutput] = useState('1');
  const [hintText, setHintText] = useState('Consider using a hash map for linear lookup time.');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const loadData = async () => {
    try {
      const res = await fetch('/api/admin/analytics');
      if (res.ok) {
        const data = await res.json();
        setAnalytics(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateProblem = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');
    try {
      const res = await fetch('/api/admin/problems', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug,
          difficulty,
          frequency,
          frequencySource,
          description,
          testCases: [
            { input: testInput, expectedOutput: testOutput, isHidden: false },
            { input: '4 5 6', expectedOutput: '4', isHidden: true },
          ],
          hints: [{ hintText }],
        }),
      });

      if (res.ok) {
        setMessage('Problem successfully published to the platform!');
        setTitle('');
        setSlug('');
        setDescription('');
        loadData();
      } else {
        const err = await res.json();
        setMessage(`Error: ${err.error || 'Failed to create problem'}`);
      }
    } catch (e: any) {
      setMessage('Network error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-sm text-slate-400">
        Loading admin control panel...
      </div>
    );
  }

  const metrics = analytics?.metrics || {
    totalUsers: 3,
    activeUsers: 3,
    totalProblems: 81,
    totalSubmissions: 15,
    dailyActiveUsers: 2,
    averageAccuracy: '84.2%',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white">Platform Administration</h1>
            <p className="text-xs text-slate-400">Manage curated problems, verify interview citations, and view metrics.</p>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'analytics' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Analytics
          </button>
          <button
            onClick={() => setActiveTab('add-problem')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'add-problem' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Add Problem
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'users' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            User Directory
          </button>
        </div>
      </div>

      {/* TAB 1: METRICS & ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Total Users</span>
                <Users className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-3xl font-extrabold text-white font-mono">{metrics.totalUsers}</div>
              <div className="text-xs text-slate-400">{metrics.dailyActiveUsers} Daily active</div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Curated Problems</span>
                <Code2 className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-3xl font-extrabold text-white font-mono">{metrics.totalProblems}</div>
              <div className="text-xs text-slate-400">Published across 12 MNCs</div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Submissions</span>
                <TrendingUp className="w-4 h-4 text-sky-400" />
              </div>
              <div className="text-3xl font-extrabold text-white font-mono">{metrics.totalSubmissions}</div>
              <div className="text-xs text-slate-400">Sandboxed evaluations</div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Success Rate</span>
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-3xl font-extrabold text-white font-mono">{metrics.averageAccuracy}</div>
              <div className="text-xs text-slate-400">First-time solve rate</div>
            </div>
          </div>

          {/* Popular Problems Table */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Most Attempted Problems
            </h3>
            <div className="space-y-2">
              {analytics?.popularProblems?.map((prob: any) => (
                <div key={prob.id} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">{prob.title}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">{prob.difficulty}</span>
                  </div>
                  <span className="font-mono text-slate-400">{prob.submissionsCount} Submissions</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ADD NEW PROBLEM */}
      {activeTab === 'add-problem' && (
        <form onSubmit={handleCreateProblem} className="p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white uppercase tracking-wider">
              Publish New Interview Problem
            </h2>
            <span className="text-xs text-slate-400">Includes public and hidden test cases</span>
          </div>

          {message && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
              {message}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Problem Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                }}
                placeholder="e.g. Next Permutation"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">URL Slug</label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="next-permutation"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="BASIC">Basic</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="ADVANCED">Advanced</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Frequency (1 - 5 Stars)</label>
              <input
                type="number"
                min={1}
                max={5}
                value={frequency}
                onChange={(e) => setFrequency(parseInt(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Verified MNC Reference / Citation</label>
            <input
              type="text"
              value={frequencySource}
              onChange={(e) => setFrequencySource(e.target.value)}
              placeholder="e.g. Amazon Online Assessment 2025"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Problem Description</label>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed algorithmic problem statement..."
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Test Case Inputs */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Sample Test Input</label>
              <input
                type="text"
                value={testInput}
                onChange={(e) => setTestInput(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Expected Output</label>
              <input
                type="text"
                value={testOutput}
                onChange={(e) => setTestOutput(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs font-mono text-emerald-400 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Progressive Hint 1</label>
            <input
              type="text"
              value={hintText}
              onChange={(e) => setHintText(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-md disabled:opacity-50"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{submitting ? 'Publishing...' : 'Publish Problem'}</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 3: REGISTERED CANDIDATES */}
      {activeTab === 'users' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Active Candidates Directory
          </h3>
          <div className="space-y-2">
            {analytics?.recentUsers?.map((u: any) => (
              <div key={u.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <div className="font-bold text-white flex items-center gap-2">
                    <span>{u.fullName}</span>
                    <span className="text-[10px] px-2 py-0.2 rounded bg-indigo-500/10 text-indigo-400">{u.role}</span>
                  </div>
                  <div className="text-slate-400 text-[11px]">{u.email}</div>
                </div>
                <div className="text-right text-xs font-mono text-slate-400">
                  <div>Solved: <b className="text-white">{u.totalSolved}</b></div>
                  <div className="text-[10px]">Level {u.level}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
