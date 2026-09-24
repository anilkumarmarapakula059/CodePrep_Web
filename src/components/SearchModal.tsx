'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Code2, Building2, BookOpen, X, ArrowRight } from 'lucide-react';

interface SearchResultItem {
  type: 'problem' | 'company' | 'path';
  title: string;
  subtitle: string;
  url: string;
}

export default function SearchModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Trigger open in parent
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([
        { type: 'path', title: 'Student Placement Roadmap', subtitle: '12-Phase Structured Journey', url: '/learn#student' },
        { type: 'path', title: '30-Day Interview Accelerator', subtitle: 'Fast Track for Working Professionals', url: '/learn#professional' },
        { type: 'company', title: 'Amazon Technical Preparation', subtitle: 'Arrays, Trees, Dynamic Programming', url: '/companies/amazon' },
        { type: 'company', title: 'Google Technical Preparation', subtitle: 'Graphs, Trees, Advanced Algorithms', url: '/companies/google' },
        { type: 'problem', title: 'Two Sum', subtitle: 'Basic · Arrays, Hashing', url: '/problems/two-sum' },
        { type: 'problem', title: 'Maximum Subarray (Kadane’s)', subtitle: 'Basic · Dynamic Programming', url: '/problems/maximum-subarray' },
      ]);
      return;
    }

    setLoading(true);
    const delayDebounce = setTimeout(async () => {
      try {
        const res = await fetch(`/api/problems?search=${encodeURIComponent(query)}&limit=6`);
        if (res.ok) {
          const data = await res.json();
          const mapped: SearchResultItem[] = (data.problems || []).map((p: any) => ({
            type: 'problem',
            title: p.title,
            subtitle: `${p.difficulty} · ${p.topics.join(', ')} · ${p.companies.slice(0, 2).join(', ')}`,
            url: `/problems/${p.slug}`,
          }));
          setResults(mapped);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  if (!isOpen) return null;

  const navigateTo = (url: string) => {
    onClose();
    router.push(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center px-4 py-3 border-b border-slate-800 bg-slate-950/50">
          <Search className="w-5 h-5 text-emerald-400 mr-3" />
          <input
            type="text"
            placeholder="Search problems, MNCs, algorithms, data structures..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-white placeholder-slate-400 focus:outline-none text-base"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto p-2">
          {loading ? (
            <div className="p-8 text-center text-sm text-slate-400">Searching problem catalog...</div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-400">No matching questions or topics found.</div>
          ) : (
            <div className="space-y-1">
              <div className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
                {query.trim() ? 'Search Results' : 'Suggested & Popular Quick Links'}
              </div>
              {results.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => navigateTo(item.url)}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-800 text-left transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-slate-800 group-hover:bg-emerald-500/10 text-slate-300 group-hover:text-emerald-400 border border-slate-700">
                      {item.type === 'problem' && <Code2 className="w-4 h-4" />}
                      {item.type === 'company' && <Building2 className="w-4 h-4" />}
                      {item.type === 'path' && <BookOpen className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-200 group-hover:text-emerald-400">
                        {item.title}
                      </div>
                      <div className="text-xs text-slate-400">{item.subtitle}</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between px-4 py-2 border-t border-slate-800 text-xs text-slate-400 bg-slate-950/40">
          <span>Navigate with <b>ESC</b> to close</span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700">Ctrl</kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700">K</kbd>
            to trigger anytime
          </span>
        </div>
      </div>
    </div>
  );
}
