'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  GraduationCap,
  Briefcase,
  Trophy,
  Target,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  Building2,
  Code,
} from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form states
  const [goal, setGoal] = useState('PLACEMENT');
  const [level, setLevel] = useState('BEGINNER');
  const [language, setLanguage] = useState('python');
  const [targetCompanies, setTargetCompanies] = useState<string[]>([
    'Amazon',
    'Google',
    'Microsoft',
    'TCS',
  ]);

  const goals = [
    { id: 'PLACEMENT', title: 'College Placement', desc: 'On-campus & off-campus campus drives', icon: GraduationCap },
    { id: 'INTERNSHIP', title: 'Internship', desc: 'Summer & pre-final year technical rounds', icon: Sparkles },
    { id: 'JOB_SWITCH', title: 'Job Switch', desc: 'SDE-1, SDE-2 lateral career transition', icon: Briefcase },
    { id: 'COMPETITIVE', title: 'Competitive Programming', desc: 'Codeforces, CodeChef & LeetCode contests', icon: Trophy },
    { id: 'DSA_IMPROVEMENT', title: 'General DSA Mastery', desc: 'Build algorithmic intuition from scratch', icon: Target },
  ];

  const levels = [
    { id: 'BEGINNER', title: 'Beginner', desc: 'Familiar with basic loops and syntax, new to DSA' },
    { id: 'INTERMEDIATE', title: 'Intermediate', desc: 'Solved 50+ problems, comfortable with recursion & trees' },
    { id: 'ADVANCED', title: 'Advanced', desc: 'Comfortable with DP, Graphs, and Bar-Raiser level questions' },
  ];

  const languages = [
    { id: 'python', name: 'Python', ext: '.py' },
    { id: 'javascript', name: 'JavaScript', ext: '.js' },
    { id: 'java', name: 'Java', ext: '.java' },
    { id: 'cpp', name: 'C++', ext: '.cpp' },
    { id: 'c', name: 'C', ext: '.c' },
  ];

  const companiesList = [
    'Google', 'Microsoft', 'Amazon', 'Adobe', 'IBM', 'Oracle',
    'Infosys', 'TCS', 'Wipro', 'Accenture', 'Cognizant', 'Capgemini', 'Deloitte',
  ];

  const toggleCompany = (name: string) => {
    if (targetCompanies.includes(name)) {
      setTargetCompanies(targetCompanies.filter((c) => c !== name));
    } else {
      setTargetCompanies([...targetCompanies, name]);
    }
  };

  const handleFinish = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          preparationGoal: goal,
          experienceLevel: level,
          preferredLanguage: language,
          targetCompanies,
        }),
      });

      if (res.ok) {
        router.push('/dashboard');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl">
        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all ${
                  s === step ? 'w-10 bg-emerald-500' : s < step ? 'w-6 bg-emerald-500/50' : 'w-4 bg-slate-800'
                }`}
              />
            ))}
          </div>
          <span className="text-xs font-mono text-slate-400">Step {step} of 4</span>
        </div>

        {/* STEP 1: PREPARATION GOAL */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white">What are you preparing for?</h2>
              <p className="text-xs text-slate-400 mt-1">
                We'll tailor your roadmap and dashboard recommendations to your goal.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {goals.map((g) => {
                const Icon = g.icon;
                const isSelected = goal === g.id;
                return (
                  <button
                    key={g.id}
                    onClick={() => setGoal(g.id)}
                    className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all ${
                      isSelected
                        ? 'bg-emerald-500/10 border-emerald-500 text-white'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Icon className={`w-5 h-5 mt-0.5 ${isSelected ? 'text-emerald-400' : 'text-slate-500'}`} />
                    <div>
                      <div className="text-sm font-semibold">{g.title}</div>
                      <div className="text-xs text-slate-400">{g.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2: EXPERIENCE LEVEL */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white">Your current experience level?</h2>
              <p className="text-xs text-slate-400 mt-1">
                This helps us calibrate starting difficulty and avoid overwhelming you.
              </p>
            </div>

            <div className="space-y-3">
              {levels.map((l) => {
                const isSelected = level === l.id;
                return (
                  <button
                    key={l.id}
                    onClick={() => setLevel(l.id)}
                    className={`w-full p-4 rounded-xl border text-left flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-emerald-500/10 border-emerald-500 text-white'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div>
                      <div className="text-sm font-semibold">{l.title}</div>
                      <div className="text-xs text-slate-400">{l.desc}</div>
                    </div>
                    {isSelected && <Check className="w-5 h-5 text-emerald-400" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3: PREFERRED PROGRAMMING LANGUAGE */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white">Preferred coding language?</h2>
              <p className="text-xs text-slate-400 mt-1">
                Your online code editor and problem solutions will default to this language.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {languages.map((l) => {
                const isSelected = language === l.id;
                return (
                  <button
                    key={l.id}
                    onClick={() => setLanguage(l.id)}
                    className={`p-4 rounded-xl border text-center transition-all ${
                      isSelected
                        ? 'bg-emerald-500/10 border-emerald-500 text-white'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="text-base font-bold font-mono">{l.name}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{l.ext}</div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 4: TARGET MNC COMPANIES */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white">Target MNC Companies?</h2>
              <p className="text-xs text-slate-400 mt-1">
                Select the companies you want to focus on (we recommend choosing 3 or more).
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {companiesList.map((c) => {
                const isSelected = targetCompanies.includes(c);
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => toggleCompany(c)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all ${
                      isSelected
                        ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>{c}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-8 border-t border-slate-800 mt-8">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="px-6 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              disabled={loading}
              className="px-6 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md disabled:opacity-50"
            >
              <span>{loading ? 'Personalizing Dashboard...' : 'Finish Setup'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
