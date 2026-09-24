'use client';

import { useState, useEffect } from 'react';
import {
  Flame,
  Zap,
  Target,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Code2,
  Sparkles,
  BookOpen,
  Building2,
} from 'lucide-react';

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [recommended, setRecommended] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [progRes, probRes] = await fetch('/api/progress').then(r => r.json()),
          probList = await fetch('/api/problems?limit=4').then(r => r.json());

        setData(progRes);
        setRecommended(probList.problems || []);
      } catch (e) {
        console.error('Failed to load dashboard data:', e);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse space-y-8">
          <div className="h-10 bg-slate-800 rounded-lg w-1/3" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-28 bg-slate-800 rounded-xl" />)}
          </div>
          <div className="h-64 bg-slate-800 rounded-2xl" />
        </div>
      </div>
    );
  }

  const profile = data?.profile || { fullName: 'Narendra Kotha', streak: 5, xp: 620, level: 4 };
  const stats = data?.stats || {
    totalSolved: 14,
    totalAttempted: 16,
    accuracy: '86%',
    streak: 5,
    codingHours: 8,
    easySolved: 10,
    mediumSolved: 4,
    hardSolved: 0,
    totalBasicInPlatform: 30,
    totalIntermediateInPlatform: 30,
    totalAdvancedInPlatform: 20,
  };

  const weakTopics = data?.topicAnalysis?.filter((t: any) => t.isWeak) || [
    { name: 'Dynamic Programming', percentage: 31 },
    { name: 'Recursion', percentage: 48 },
    { name: 'Strings', percentage: 72 },
    { name: 'Arrays', percentage: 85 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. WELCOME SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-emerald-950/40 border border-slate-800 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Good morning, {profile.fullName?.split(' ')[0] || 'Narendra'} 👋
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              Level {profile.level}
            </span>
          </div>
          <p className="text-sm text-slate-400">
            Ready to solve today's challenges? You're on a <b className="text-amber-400">{stats.streak}-day</b> streak!
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/mock-interview"
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center gap-1.5"
          >
            <Clock className="w-3.5 h-3.5 text-purple-400" />
            <span>Take Mock Interview</span>
          </a>

          <a
            href="/problems"
            className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors shadow-sm flex items-center gap-1.5"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Practice Problems</span>
          </a>
        </div>
      </div>

      {/* 2. PROGRESS OVERVIEW STAT CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Problems Solved */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Problems Solved</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">
            {stats.totalSolved}
            <span className="text-xs font-normal text-slate-400 ml-1">/ 80</span>
          </div>
          <div className="text-xs text-slate-400">
            {stats.totalAttempted} attempted ({stats.accuracy} accuracy)
          </div>
        </div>

        {/* Current Streak */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Current Streak</span>
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">
            {stats.streak} <span className="text-sm font-normal text-amber-400">Days</span>
          </div>
          <div className="text-xs text-slate-400">
            Solve 1 today to maintain streak
          </div>
        </div>

        {/* Coding Hours */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Total Coding Time</span>
            <Clock className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">
            {stats.codingHours} <span className="text-sm font-normal text-sky-400">Hours</span>
          </div>
          <div className="text-xs text-slate-400">
            Active sandbox practice
          </div>
        </div>

        {/* XP & Level */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>XP Accumulated</span>
            <Zap className="w-4 h-4 text-emerald-400 fill-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">
            {profile.xp} <span className="text-sm font-normal text-emerald-400">XP</span>
          </div>
          <div className="text-xs text-slate-400">
            {500 - (profile.xp % 500)} XP to Level {profile.level + 1}
          </div>
        </div>
      </div>

      {/* 3. DIFFICULTY BREAKDOWN BARS */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          Difficulty Progression Breakdown
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Basic */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-emerald-400">Basic / Fundamental</span>
              <span className="text-slate-400 font-mono">{stats.easySolved} / {stats.totalBasicInPlatform}</span>
            </div>
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (stats.easySolved / stats.totalBasicInPlatform) * 100)}%` }}
              />
            </div>
          </div>

          {/* Intermediate */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-amber-400">Intermediate (SDE-1)</span>
              <span className="text-slate-400 font-mono">{stats.mediumSolved} / {stats.totalIntermediateInPlatform}</span>
            </div>
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (stats.mediumSolved / stats.totalIntermediateInPlatform) * 100)}%` }}
              />
            </div>
          </div>

          {/* Advanced */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-rose-400">Advanced / Bar Raiser</span>
              <span className="text-slate-400 font-mono">{stats.hardSolved} / {stats.totalAdvancedInPlatform}</span>
            </div>
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-rose-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (stats.hardSolved / stats.totalAdvancedInPlatform) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 4. CURRENT LEARNING PATH & TODAY'S GOAL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Roadmap Progress */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Current Active Roadmap
              </h3>
            </div>
            <span className="text-xs font-semibold text-emerald-400">Phase 3: Searching & Sorting</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-base font-bold text-white">DSA Placement Roadmap</h4>
                <p className="text-xs text-slate-400">12-Phase Structured Journey for MNC Placements</p>
              </div>
              <span className="text-sm font-extrabold text-emerald-400 font-mono">42%</span>
            </div>
            <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 w-[42%] rounded-full" />
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              <span>Next: Binary Search on Answer Space</span>
              <a href="/learn" className="text-emerald-400 hover:underline flex items-center gap-1">
                <span>Resume Phase</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Today's Goal */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider">Today's Daily Target</span>
              <Target className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-white">
              Solve 3 Problems
            </div>
            <p className="text-xs text-slate-400">
              1 of 3 completed today
            </p>
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden mt-2">
              <div className="h-full bg-emerald-500 w-[33%] rounded-full" />
            </div>
          </div>

          <a
            href="/problems/maximum-subarray"
            className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-center transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            <span>Continue Practice</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* 5. RECOMMENDED PROBLEMS & WEAK TOPICS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recommended Problems */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Personalized Recommendations
              </h3>
            </div>
            <span className="text-xs text-slate-400">Based on Target MNCs & Weak Areas</span>
          </div>

          <div className="space-y-3">
            {recommended.map((prob) => (
              <a
                key={prob.id}
                href={`/problems/${prob.slug}`}
                className="flex items-center justify-between p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 hover:bg-slate-950 transition-all group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                      {prob.title}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                        prob.difficulty === 'BASIC'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : prob.difficulty === 'INTERMEDIATE'
                          ? 'bg-amber-500/10 text-amber-400'
                          : 'bg-rose-500/10 text-rose-400'
                      }`}
                    >
                      {prob.difficulty}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span>{prob.topics?.join(', ')}</span>
                    <span>•</span>
                    <span className="text-purple-400">{prob.companies?.slice(0, 2).join(', ')}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-amber-400">{'★'.repeat(prob.frequency || 4)}</span>
                  <div className="p-2 rounded-lg bg-slate-800 group-hover:bg-emerald-500 text-slate-400 group-hover:text-slate-950 transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Weak Topics */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Topic Mastery
              </h3>
            </div>
            <a href="/progress" className="text-xs text-emerald-400 hover:underline">
              Full Breakdown →
            </a>
          </div>

          <div className="space-y-4">
            {weakTopics.map((topic: any, idx: number) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">{topic.name}</span>
                  <span
                    className={`font-mono font-semibold ${
                      topic.percentage < 50
                        ? 'text-rose-400'
                        : topic.percentage < 75
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    {topic.percentage}%
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      topic.percentage < 50
                        ? 'bg-rose-500'
                        : topic.percentage < 75
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${topic.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-400 leading-relaxed">
            💡 <b>Recommendation</b>: Solve 2 more Dynamic Programming problems to boost your Amazon interview readiness score above 80%.
          </div>
        </div>
      </div>
    </div>
  );
}
