'use client';

import { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Code2,
  CheckCircle2,
  Clock,
  Star,
  Bookmark,
  Building2,
  ArrowRight,
  Layers,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export default function ProblemsPage() {
  const [problems, setProblems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('ALL');
  const [selectedTopic, setSelectedTopic] = useState('ALL');
  const [selectedCompany, setSelectedCompany] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const topicsList = [
    'ALL', 'Arrays', 'Strings', 'Hashing', 'Two Pointers', 'Sliding Window',
    'Linked Lists', 'Stack', 'Queue', 'Searching', 'Sorting', 'Trees',
    'Graphs', 'Dynamic Programming', 'Greedy', 'Bit Manipulation', 'Mathematics'
  ];

  const companiesList = [
    'ALL', 'Amazon', 'Google', 'Microsoft', 'Adobe', 'Oracle',
    'TCS', 'Infosys', 'Wipro', 'Cognizant', 'Accenture', 'Deloitte'
  ];

  const fetchProblems = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: '15',
        search,
        difficulty,
        topic: selectedTopic,
        company: selectedCompany,
        status: statusFilter,
      });

      const res = await fetch(`/api/problems?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setProblems(data.problems || []);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 1);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, [page, difficulty, selectedTopic, selectedCompany, statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchProblems();
  };

  const toggleBookmark = async (problemId: string) => {
    try {
      const res = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problemId }),
      });
      if (res.ok) {
        const data = await res.json();
        setProblems(problems.map(p => p.id === problemId ? { ...p, isBookmarked: data.bookmarked } : p));
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            MNC Problem Library
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Curated repository of 80 high-yield questions asked in technical rounds & online assessments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
            Showing <b className="text-white">{problems.length}</b> of <b className="text-emerald-400">{total}</b>
          </span>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="space-y-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by problem name, keyword, or data structure..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-700/80 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors"
          >
            Search
          </button>
        </form>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-3 pt-2 text-xs border-t border-slate-800">
          {/* Difficulty Dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-medium">Difficulty:</span>
            <select
              value={difficulty}
              onChange={(e) => { setDifficulty(e.target.value); setPage(1); }}
              className="bg-slate-950 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-emerald-500"
            >
              <option value="ALL">All Difficulties</option>
              <option value="BASIC">Basic</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCED">Advanced</option>
            </select>
          </div>

          {/* Topic Dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-medium">Topic:</span>
            <select
              value={selectedTopic}
              onChange={(e) => { setSelectedTopic(e.target.value); setPage(1); }}
              className="bg-slate-950 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-emerald-500"
            >
              {topicsList.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          {/* Company Dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-medium">Company:</span>
            <select
              value={selectedCompany}
              onChange={(e) => { setSelectedCompany(e.target.value); setPage(1); }}
              className="bg-slate-950 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-emerald-500"
            >
              {companiesList.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Status Dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="bg-slate-950 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-emerald-500"
            >
              <option value="ALL">All Status</option>
              <option value="SOLVED">Solved</option>
              <option value="ATTEMPTED">Attempted</option>
              <option value="UNATTEMPTED">Unattempted</option>
            </select>
          </div>

          {/* Reset Filters */}
          {(difficulty !== 'ALL' || selectedTopic !== 'ALL' || selectedCompany !== 'ALL' || statusFilter !== 'ALL' || search) && (
            <button
              onClick={() => {
                setDifficulty('ALL');
                setSelectedTopic('ALL');
                setSelectedCompany('ALL');
                setStatusFilter('ALL');
                setSearch('');
                setPage(1);
              }}
              className="ml-auto text-xs text-rose-400 hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Problem Cards List */}
      <div className="space-y-3">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm">Loading problem catalog...</div>
        ) : problems.length === 0 ? (
          <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
            <div className="text-3xl">🔍</div>
            <h3 className="text-base font-bold text-white">No problems found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              We couldn't find any questions matching your current filters. Try resetting the filters or modifying your search query.
            </p>
          </div>
        ) : (
          problems.map((prob) => {
            const isSolved = prob.userStatus === 'SOLVED';
            const isAttempted = prob.userStatus === 'ATTEMPTED';

            return (
              <div
                key={prob.id}
                className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 hover:bg-slate-900 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group"
              >
                {/* Left: Status, Title, Tags */}
                <div className="flex items-start gap-4">
                  {/* Status Indicator */}
                  <div className="mt-1 flex-shrink-0">
                    {isSolved ? (
                      <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    ) : isAttempted ? (
                      <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center">
                        <Clock className="w-4 h-4" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full border border-slate-700 bg-slate-800" />
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <a
                        href={`/problems/${prob.slug}`}
                        className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors"
                      >
                        {prob.title}
                      </a>

                      {/* Difficulty Badge */}
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                          prob.difficulty === 'BASIC'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : prob.difficulty === 'INTERMEDIATE'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        {prob.difficulty}
                      </span>

                      {/* Time */}
                      <span className="text-[11px] text-slate-400 font-mono">
                        ~{prob.estimatedTimeMinutes}m
                      </span>
                    </div>

                    {/* Topics and Companies */}
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <div className="flex items-center gap-1 text-slate-400">
                        {prob.topics?.map((topic: string) => (
                          <span
                            key={topic}
                            className="px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800 text-[11px]"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>

                      <span className="text-slate-600">•</span>

                      {/* Companies */}
                      <div className="flex items-center gap-1 text-purple-400 text-[11px]">
                        <span>Asked by:</span>
                        <span className="text-slate-300 font-medium">
                          {prob.companies?.slice(0, 3).join(', ')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Frequency, Acceptance, Bookmark, CTA */}
                <div className="flex items-center justify-between md:justify-end gap-4 pt-3 md:pt-0 border-t md:border-t-0 border-slate-800">
                  {/* Frequency stars */}
                  <div className="text-right">
                    <div className="text-xs font-mono text-amber-400">
                      {'★'.repeat(prob.frequency || 3)}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {prob.acceptanceRate}% accept
                    </div>
                  </div>

                  {/* Bookmark Button */}
                  <button
                    onClick={() => toggleBookmark(prob.id)}
                    className={`p-2 rounded-xl border transition-colors ${
                      prob.isBookmarked
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                    title={prob.isBookmarked ? 'Remove bookmark' : 'Bookmark problem'}
                  >
                    <Bookmark className="w-4 h-4 fill-current" />
                  </button>

                  {/* Solve Button */}
                  <a
                    href={`/problems/${prob.slug}`}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 group-hover:bg-emerald-500 text-slate-200 group-hover:text-slate-950 transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <span>{isSolved ? 'Review' : 'Solve'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-6">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono text-slate-400">
            Page <b className="text-white">{page}</b> of <b className="text-white">{totalPages}</b>
          </span>
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-40"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
