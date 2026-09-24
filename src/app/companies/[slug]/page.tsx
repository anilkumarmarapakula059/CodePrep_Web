'use client';

import { useState, useEffect, use } from 'react';
import {
  Building2,
  Clock,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Star,
  Play,
  Layers,
} from 'lucide-react';

export default function CompanyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [company, setCompany] = useState<any>(null);
  const [problems, setProblems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCompanyData() {
      try {
        const res = await fetch(`/api/companies/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setCompany(data.company);
          setProblems(data.problems || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadCompanyData();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center text-slate-400 text-sm">
        Loading company preparation track...
      </div>
    );
  }

  if (!company) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Company track not found</h2>
        <a href="/companies" className="text-xs text-emerald-400 underline">
          Return to All Companies
        </a>
      </div>
    );
  }

  const topicEntries = Object.entries(company.testedTopicsOverview || {});

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-emerald-950/30 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-white font-extrabold text-xl">
              {company.name[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {company.name} Preparation Track
                </h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                  {company.tier}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Verified assessment patterns, high-frequency algorithms, and hiring process.
              </p>
            </div>
          </div>
          <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
            {company.description}
          </p>
        </div>

        {/* Start Mock Interview Button */}
        <div className="flex-shrink-0">
          <a
            href={`/mock-interview?company=${encodeURIComponent(company.name)}`}
            className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all hover:scale-105"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>Start {company.name} Mock Interview</span>
          </a>
        </div>
      </div>

      {/* Grid: Topic Breakdown + Hiring Process */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Topic Frequency Distribution */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Frequently Tested Topics Overview
          </h3>
          <p className="text-xs text-slate-400">
            Historical distribution of questions asked in {company.name} technical assessments:
          </p>

          <div className="space-y-3 pt-2">
            {topicEntries.map(([tName, pct]: [string, any], idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">{tName}</span>
                  <span className="font-mono text-emerald-400 font-semibold">{pct}%</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hiring Process Rounds Timeline */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Interview Rounds & Workflow
          </h3>
          <div className="space-y-3 pt-2">
            {company.hiringRounds?.map((round: string, idx: number) => (
              <div key={idx} className="flex items-start space-x-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
                <span className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-400 font-mono font-bold flex items-center justify-center flex-shrink-0">
                  {idx + 1}
                </span>
                <div>
                  <div className="font-semibold text-white">{round}</div>
                  <div className="text-[11px] text-slate-400">Standard MNC evaluation benchmark</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Curated Problem Collection */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">
              Curated {company.name} Questions ({problems.length})
            </h3>
            <p className="text-xs text-slate-400">
              Problems frequently reported by candidates in {company.name} rounds.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {problems.map((prob) => (
            <div
              key={prob.id}
              className="p-5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <a
                    href={`/problems/${prob.slug}`}
                    className="text-sm font-bold text-white hover:text-emerald-400 transition-colors"
                  >
                    {prob.title}
                  </a>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
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
                  <span>Stage: {prob.interviewStage?.replace(/_/g, ' ')}</span>
                  <span>•</span>
                  <span className="text-amber-400 font-mono">{'★'.repeat(prob.frequency || 3)}</span>
                </div>
              </div>

              <a
                href={`/problems/${prob.slug}`}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-emerald-500 text-slate-200 hover:text-slate-950 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
              >
                <span>{prob.userStatus === 'SOLVED' ? 'Review' : 'Solve Problem'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
