'use client';

import { useState, useEffect } from 'react';
import { Building2, ArrowRight, Star, Layers, ShieldCheck, Search } from 'lucide-react';

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCompanies() {
      try {
        const res = await fetch('/api/companies');
        if (res.ok) {
          const data = await res.json();
          setCompanies(data.companies || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadCompanies();
  }, []);

  const filtered = companies.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase());
    const matchesTier = tierFilter === 'ALL' || c.tier === tierFilter;
    return matchesSearch && matchesTier;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          MNC Interview Preparation Hub
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
          Comprehensive preparation tracks mapped to assessment patterns, frequently tested algorithms, and hiring workflows of 12 top tech and service MNCs.
        </p>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search company (e.g. Amazon, Google, TCS)..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-700/80 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto text-xs">
          <span className="text-slate-400">Filter Tier:</span>
          {['ALL', 'Tier-1 Product', 'Service MNC', 'Big-4 Consulting'].map((tier) => (
            <button
              key={tier}
              onClick={() => setTierFilter(tier)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                tierFilter === tier
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {tier === 'ALL' ? 'All Tiers' : tier}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Company Cards */}
      {loading ? (
        <div className="p-12 text-center text-sm text-slate-400">Loading MNC company tracks...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((comp) => (
            <a
              key={comp.id}
              href={`/companies/${comp.slug}`}
              className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 hover:bg-slate-850 transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-white font-bold text-base group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors">
                      {comp.name[0]}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                        {comp.name}
                      </h3>
                      <span className="text-[11px] text-slate-400">{comp.tier}</span>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-emerald-400 font-semibold">
                    {comp.totalProblems} Questions
                  </span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                  {comp.description}
                </p>

                {/* Difficulty Pill Distribution */}
                <div className="flex items-center gap-2 pt-2 text-[10px] font-mono">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">
                    {comp.difficultyBreakdown?.basic || 0} Basic
                  </span>
                  <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400">
                    {comp.difficultyBreakdown?.intermediate || 0} Medium
                  </span>
                  <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400">
                    {comp.difficultyBreakdown?.advanced || 0} Hard
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-emerald-400 font-semibold group-hover:translate-x-0.5 transition-transform">
                <span>View Full Roadmap & Problems</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
