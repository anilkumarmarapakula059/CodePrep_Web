'use client';

import { useState, useEffect } from 'react';
import { User, Mail, Shield, Building2, Code, Flame, Zap, Award, Check, Save } from 'lucide-react';

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form editable states
  const [fullName, setFullName] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState('python');
  const [experienceLevel, setExperienceLevel] = useState('BEGINNER');

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setProfile(data.user);
            setFullName(data.user.profile?.fullName || '');
            setPreferredLanguage(data.user.profile?.preferredLanguage || 'python');
            setExperienceLevel(data.user.profile?.experienceLevel || 'BEGINNER');
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);
    try {
      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          preferredLanguage,
          experienceLevel,
        }),
      });
      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 2500);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-sm text-slate-400">
        Loading user profile...
      </div>
    );
  }

  const userProfile = profile?.profile || {};
  let targetCompanies: string[] = [];
  try {
    targetCompanies = JSON.parse(userProfile.targetCompanies || '[]');
  } catch {}

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Profile Header Card */}
      <div className="p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/30 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white font-extrabold text-3xl shadow-lg">
          {fullName?.[0] || 'U'}
        </div>

        <div className="space-y-2 text-center sm:text-left flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="text-2xl font-extrabold text-white">{fullName}</h1>
            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold uppercase">
              {profile?.role || 'STUDENT'}
            </span>
            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 font-mono">
              Level {userProfile.level || 1}
            </span>
          </div>

          <p className="text-xs text-slate-400">{profile?.email}</p>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs font-mono text-slate-300 pt-1">
            <span className="flex items-center gap-1 text-amber-400">
              <Flame className="w-3.5 h-3.5 fill-current" /> {userProfile.streak || 1} Day Streak
            </span>
            <span className="flex items-center gap-1 text-emerald-400">
              <Zap className="w-3.5 h-3.5 fill-current" /> {userProfile.xp || 100} XP
            </span>
            <span>🏆 {userProfile.totalSolved || 0} Solved</span>
          </div>
        </div>
      </div>

      {/* Edit Settings Form */}
      <form onSubmit={handleSave} className="p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
        <h2 className="text-base font-bold text-white uppercase tracking-wider">
          Profile & Preparation Settings
        </h2>

        {savedSuccess && (
          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>Profile settings successfully saved!</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Default Coding Language</label>
            <select
              value={preferredLanguage}
              onChange={(e) => setPreferredLanguage(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
            >
              <option value="python">Python 3</option>
              <option value="javascript">JavaScript</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Experience Calibration</label>
            <select
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="BEGINNER">Beginner (Campus Placements)</option>
              <option value="INTERMEDIATE">Intermediate (SDE-1)</option>
              <option value="ADVANCED">Advanced (SDE-2 / Bar Raiser)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Target Companies Focus</label>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {targetCompanies.map((c) => (
                <span key={c} className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-purple-300">
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-colors flex items-center gap-1.5 shadow-md disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
