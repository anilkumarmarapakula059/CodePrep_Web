'use client';

import { useState, useEffect } from 'react';
import { Bookmark, FolderPlus, ArrowRight, Trash2, Code2, ExternalLink } from 'lucide-react';

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCollectionName, setNewCollectionName] = useState('');

  const loadBookmarks = async () => {
    try {
      const res = await fetch('/api/bookmarks');
      if (res.ok) {
        const data = await res.json();
        setBookmarks(data.bookmarks || []);
        setCollections(data.collections || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookmarks();
  }, []);

  const handleCreateCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollectionName.trim()) return;

    // Use dummy problem bookmark or simple collection creation
    await fetch('/api/bookmarks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        problemId: bookmarks[0]?.problemId || '',
        createCollectionName: newCollectionName.trim(),
      }),
    });
    setNewCollectionName('');
    loadBookmarks();
  };

  const removeBookmark = async (problemId: string) => {
    await fetch('/api/bookmarks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ problemId }),
    });
    setBookmarks(bookmarks.filter((b) => b.problemId !== problemId));
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-sm text-slate-400">
        Loading saved bookmarks...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Saved Problems & Collections
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Organize revision lists for upcoming interview rounds and difficult algorithms.
          </p>
        </div>

        {/* Create Collection Form */}
        <form onSubmit={handleCreateCollection} className="flex gap-2">
          <input
            type="text"
            placeholder="New Collection Name..."
            value={newCollectionName}
            onChange={(e) => setNewCollectionName(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            className="px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <FolderPlus className="w-3.5 h-3.5" />
            <span>Add List</span>
          </button>
        </form>
      </div>

      {/* Bookmarks List */}
      {bookmarks.length === 0 ? (
        <div className="p-16 text-center bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
          <Bookmark className="w-8 h-8 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No bookmarked problems yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Click the bookmark ribbon on any problem in the problem catalog to save it for interview revision.
          </p>
          <a
            href="/problems"
            className="inline-block px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold mt-2"
          >
            Explore Problems
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarks.map((bm) => (
            <div
              key={bm.id}
              className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-semibold">
                    {bm.problem.difficulty}
                  </span>
                  <button
                    onClick={() => removeBookmark(bm.problemId)}
                    className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="text-base font-bold text-white">
                  {bm.problem.title}
                </h3>

                <div className="text-xs text-slate-400 flex flex-wrap gap-1">
                  {bm.problem.topics?.map((t: string) => (
                    <span key={t} className="px-2 py-0.5 rounded bg-slate-950 text-slate-300 text-[10px]">
                      {t}
                    </span>
                  ))}
                </div>

                {bm.notes && (
                  <div className="p-2.5 rounded-lg bg-slate-950 text-xs text-amber-300/90 font-mono">
                    📝 {bm.notes}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  {bm.collection?.name || 'General Revision'}
                </span>
                <a
                  href={`/problems/${bm.problem.slug}`}
                  className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1"
                >
                  <span>Practice</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
