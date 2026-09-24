'use client';

import { useState, useEffect } from 'react';
import {
  TrendingUp,
  Flame,
  Award,
  CheckCircle2,
  Clock,
  Target,
  Zap,
  BarChart3,
  Shield,
  Layers,
} from 'lucide-react';

export default function ProgressPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch('/api/progress');
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-sm text-slate-400">
        Loading progress analytics...
      </div>
    );
  }

  const stats = data?.stats || {};
  const topicAnalysis = data?.topicAnalysis || [];
  const achievements = data?.achievements || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Performance Analytics & Mastery
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Track problem-solving trends, topic proficiencies, streaks, and interview readiness metrics.
        </p>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Total Solved</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">{stats.totalSolved}</div>
          <div className="text-xs text-slate-400">{stats.accuracy} submission accuracy</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Daily Streak</span>
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">{stats.streak} Days</div>
          <div className="text-xs text-slate-400">Active consistency badge</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Total Time</span>
            <Clock className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">{stats.codingHours} Hours</div>
          <div className="text-xs text-slate-400">In-editor coding sessions</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Developer Level</span>
            <Zap className="w-4 h-4 text-emerald-400 fill-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">Level {stats.level}</div>
          <div className="text-xs text-slate-400">{stats.xp} Total XP earned</div>
        </div>
      </div>

      {/* Grid: Difficulty Distribution + Weekly Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Difficulty Breakdown */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Difficulty Distribution
          </h3>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-emerald-400">Basic / Fundamentals</span>
                <span className="font-mono text-slate-400">{stats.easySolved} / {stats.totalBasicInPlatform}</span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${Math.min(100, (stats.easySolved / stats.totalBasicInPlatform) * 100)}%` }}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-amber-400">Intermediate (SDE-1)</span>
                <span className="font-mono text-slate-400">{stats.mediumSolved} / {stats.totalIntermediateInPlatform}</span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full"
                  style={{ width: `${Math.min(100, (stats.mediumSolved / stats.totalIntermediateInPlatform) * 100)}%` }}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-rose-400">Advanced / Bar Raiser</span>
                <span className="font-mono text-slate-400">{stats.hardSolved} / {stats.totalAdvancedInPlatform}</span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-rose-500 rounded-full"
                  style={{ width: `${Math.min(100, (stats.hardSolved / stats.totalAdvancedInPlatform) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Activity */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Recent Activity Heatmap
            </h3>
            <span className="text-xs text-slate-400">Last 7 Days</span>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center pt-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => (
              <div key={day} className="space-y-2">
                <div className="text-[10px] text-slate-400">{day}</div>
                <div className="h-16 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center">
                  <div
                    className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-xs font-mono font-bold text-slate-950"
                    style={{ opacity: 0.4 + (idx % 4) * 0.2 }}
                  >
                    {[3, 5, 2, 8, 4, 6, 7][idx]}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="text-xs text-slate-400">
            Keep solving daily to build muscle memory for coding assessments.
          </p>
        </div>
      </div>

      {/* Topic Mastery Progress Bars */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          Topic Proficiency & Diagnostic Radar
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {topicAnalysis.map((t: any) => (
            <div key={t.name} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-200">{t.name}</span>
                <span className={`font-mono font-bold ${t.percentage < 50 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {t.percentage}%
                </span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${t.percentage < 50 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                  style={{ width: `${t.percentage}%` }}
                />
              </div>
              <div className="text-[10px] text-slate-500">
                {t.solved} of {t.total} solved
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements Showcase */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          Unlocked Milestones & Badges
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {achievements.map((ach: any) => (
            <div
              key={ach.id}
              className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center space-x-3"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-lg border border-amber-500/20">
                🏆
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">{ach.title}</h4>
                <p className="text-[11px] text-slate-400">{ach.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
