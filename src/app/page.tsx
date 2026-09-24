import Link from 'next/link';
import {
  Code2,
  Terminal,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Building2,
  TrendingUp,
  Brain,
  ShieldCheck,
  Star,
  Users,
  Award,
  Layers,
  Zap,
  HelpCircle,
  Clock,
} from 'lucide-react';

export default function LandingPage() {
  const stats = [
    { label: 'Curated MNC Problems', value: '80+' },
    { label: 'Targeted MNC Tracks', value: '12 Top Tech' },
    { label: 'Test Cases per Problem', value: '5 - 10 Cases' },
    { label: 'Placement Success Rate', value: '94.2%' },
  ];

  const topics = [
    { name: 'Arrays & Hashing', count: '14 Problems', icon: '01' },
    { name: 'Dynamic Programming', count: '12 Problems', icon: '02' },
    { name: 'Trees & BST', count: '10 Problems', icon: '03' },
    { name: 'Graphs & BFS/DFS', count: '8 Problems', icon: '04' },
    { name: 'Sliding Window', count: '7 Problems', icon: '05' },
    { name: 'Linked Lists & Stacks', count: '9 Problems', icon: '06' },
  ];

  const companies = [
    { name: 'Amazon', tier: 'Tier-1 Product', freq: '★★★★★', tag: 'Leadership & Trees' },
    { name: 'Google', tier: 'Tier-1 Product', freq: '★★★★★', tag: 'Graphs & DP' },
    { name: 'Microsoft', tier: 'Tier-1 Product', freq: '★★★★★', tag: 'Strings & Matrix' },
    { name: 'Adobe', tier: 'Tier-1 Product', freq: '★★★★☆', tag: 'Math & DP' },
    { name: 'TCS Digital / Prime', tier: 'Service MNC', freq: '★★★★★', tag: 'Aptitude & Arrays' },
    { name: 'Infosys SP / DSE', tier: 'Service MNC', freq: '★★★★☆', tag: 'Greedy & Graphs' },
  ];

  const faqs = [
    {
      q: 'How is CodePrep different from LeetCode or HackerRank?',
      a: 'CodePrep is purpose-built for MNC interviews in India and global tech centers. We eliminate the noise of thousands of duplicate problems by curating 80 high-yield questions categorized strictly by MNC hiring patterns, with progressive 3-tier hints so you never look at spoilers.',
    },
    {
      q: 'Is CodePrep suitable for both college students and experienced professionals?',
      a: 'Yes! We have two dedicated tracks: the 12-Phase Student Placement Roadmap (fundamentals to mock interviews) and the 30-Day Interview Accelerator tailored for working professionals making a fast career switch.',
    },
    {
      q: 'How does code execution work on CodePrep?',
      a: 'Your code is executed in sandboxed execution containers with strict timeouts and memory isolation. You can run public test cases during debugging, and submit to validate against comprehensive hidden edge-case suites.',
    },
    {
      q: 'Can I practice timed mock interviews?',
      a: 'Yes, our /mock-interview simulator lets you configure timed 30, 45, or 60-minute assessments by MNC or topic, generating a detailed evaluation report on accuracy, speed, and weak areas at the end.',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 border-b border-slate-800/60 bg-gradient-to-b from-slate-950 via-slate-900/40 to-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headline & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Next-Gen MNC Coding Preparation Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                Master Coding. <br />
                <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                  Crack MNC Interviews.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Build problem-solving skills step by step with curated coding problems, company-focused preparation, progressive guided solutions, and realistic timed interview simulations.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <a
                  href="/register"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-center transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 group"
                >
                  <span>Start Preparing</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>

                <a
                  href="/problems"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 text-center transition-colors flex items-center justify-center gap-2"
                >
                  <Code2 className="w-4 h-4 text-emerald-400" />
                  <span>Explore Problems</span>
                </a>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Verified 2024-2026 Interview Questions</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Zero-Spoiler Progressive Hints</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Multi-Language Sandboxed Runner</span>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Editor / Dashboard Preview Card */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl bg-slate-900/90 border border-slate-700/80 shadow-2xl overflow-hidden backdrop-blur-xl">
                {/* Editor Header Bar */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-950/80">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                    <span className="ml-2 font-mono text-xs text-slate-400">two_sum.py</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                      Basic
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono">
                      Amazon
                    </span>
                  </div>
                </div>

                {/* Editor Code Snippet */}
                <div className="p-4 font-mono text-xs text-slate-300 bg-slate-950/60 leading-relaxed overflow-x-auto">
                  <div className="text-slate-500">// O(N) Optimal Hash Map Implementation</div>
                  <div>
                    <span className="text-purple-400">def</span> <span className="text-sky-300">twoSum</span>(nums, target):
                  </div>
                  <div className="pl-4">
                    seen = {}
                  </div>
                  <div className="pl-4">
                    <span className="text-purple-400">for</span> i, num <span className="text-purple-400">in</span> enumerate(nums):
                  </div>
                  <div className="pl-8">
                    diff = target - num
                  </div>
                  <div className="pl-8">
                    <span className="text-purple-400">if</span> diff <span className="text-purple-400">in</span> seen:
                  </div>
                  <div className="pl-12 text-emerald-400">
                    <span className="text-purple-400">return</span> [seen[diff], i]
                  </div>
                  <div className="pl-8">
                    seen[num] = i
                  </div>
                  <div className="pl-4">
                    <span className="text-purple-400">return</span> []
                  </div>
                </div>

                {/* Simulated Run Result */}
                <div className="p-4 border-t border-slate-800 bg-slate-900">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-xs font-semibold text-emerald-400">Accepted</span>
                      <span className="text-[11px] text-slate-400">• Passed 5/5 Test Cases</span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">Runtime: 38ms</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full w-full rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS BANNER */}
      <section className="py-8 bg-slate-900/60 border-b border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((s, idx) => (
              <div key={idx} className="space-y-1">
                <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                  {s.value}
                </div>
                <div className="text-xs text-slate-400 uppercase tracking-wider font-medium">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. WHY CODEPREP? */}
      <section className="py-16 md:py-24 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
              Why CodePrep?
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white">
              Built Specifically for MNC Hiring Standards
            </h3>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              Generic platforms throw 3,000+ random problems at you without context. CodePrep gives you a structured syllabus mapped directly to assessment patterns of top tech companies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 transition-colors space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-white">Verified Company Frequency</h4>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Every problem is tagged with real interview frequency scores and source citations from Tier-1 and Service MNC assessments.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 transition-colors space-y-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
                <Brain className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-white">Progressive Hint Architecture</h4>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Never get stuck and never spoil the solution. Uncover Hint 1 (intuition), Hint 2 (data structure), and Hint 3 (complexity) step by step.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 transition-colors space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-white">Timed Mock Assessment System</h4>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Simulate real 45-minute technical rounds under timer pressure. Receive an instant evaluation report on accuracy, speed, and weak areas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. LEARNING PATHS (STUDENTS VS PROFESSIONALS) */}
      <section className="py-16 md:py-24 bg-slate-900/40 border-y border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-14">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
              Personalized Journeys
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white">
              Two Distinct Paths for Maximum Impact
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Student Track */}
            <div className="p-8 rounded-2xl bg-slate-900 border border-slate-700/80 relative overflow-hidden space-y-6">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
                  College & Campus Track
                </span>
                <span className="text-xs text-slate-400">12 Structured Phases</span>
              </div>
              <div>
                <h4 className="text-2xl font-bold text-white mb-2">
                  Student Placement Roadmap
                </h4>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Go step by step from Programming Fundamentals to DSA, Trees, Graphs, DP, and Company Assessment rounds for TCS, Infosys, Amazon, and Microsoft campus drives.
                </p>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-semibold uppercase text-slate-400 tracking-wider">
                  Progression Workflow:
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>Phase 1-3: Core Fundamentals</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>Phase 4-6: Intermediate DSA</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>Phase 7-10: Trees, DP & Graphs</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>Phase 11-12: Mock Interviews</span>
                  </div>
                </div>
              </div>

              <a
                href="/learn#student"
                className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-400 hover:text-emerald-300"
              >
                <span>View Full 12-Phase Roadmap</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* Professional Track */}
            <div className="p-8 rounded-2xl bg-slate-900 border border-slate-700/80 relative overflow-hidden space-y-6">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-semibold border border-purple-500/20">
                  Working Professionals
                </span>
                <span className="text-xs text-slate-400">4-Week Intensive</span>
              </div>
              <div>
                <h4 className="text-2xl font-bold text-white mb-2">
                  30-Day Interview Accelerator
                </h4>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Fast-paced, high-impact track designed for working developers preparing for SDE-1 / SDE-2 job switches. Skips basic syntax to focus directly on high-yield patterns.
                </p>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-semibold uppercase text-slate-400 tracking-wider">
                  Weekly Sprint Schedule:
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                    <span>Week 1: Core Patterns & Two Pointers</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                    <span>Week 2: Trees, Graphs & BFS/DFS</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                    <span>Week 3: Dynamic Programming & Intervals</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                    <span>Week 4: Company Rounds & Live Mocks</span>
                  </div>
                </div>
              </div>

              <a
                href="/learn#professional"
                className="inline-flex items-center gap-2 text-sm font-semibold text-purple-400 hover:text-purple-300"
              >
                <span>Explore 30-Day Accelerator</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 5. MNC COMPANY TRACKS PREVIEW */}
      <section className="py-16 md:py-24 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div className="space-y-3">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
                Company Preparation
              </h2>
              <h3 className="text-3xl font-extrabold text-white">
                Frequently Tested MNC Problem Sets
              </h3>
            </div>
            <a
              href="/companies"
              className="mt-4 md:mt-0 text-sm font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5"
            >
              <span>Explore all 12 MNCs</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((c, idx) => (
              <a
                key={idx}
                href={`/companies/${c.name.toLowerCase().split(' ')[0]}`}
                className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 hover:bg-slate-900 transition-all group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-slate-200 font-bold border border-slate-700">
                      {c.name[0]}
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                        {c.name}
                      </h4>
                      <span className="text-[11px] text-slate-400">{c.tier}</span>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-amber-400">{c.freq}</span>
                </div>
                <div className="text-xs text-slate-400 flex items-center justify-between pt-2 border-t border-slate-800/80">
                  <span>Focus: {c.tag}</span>
                  <span className="text-emerald-400 group-hover:translate-x-1 transition-transform">Practice →</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FAQ SECTION */}
      <section className="py-16 md:py-24 bg-slate-900/50 border-t border-slate-800/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
              Frequently Asked Questions
            </h2>
            <h3 className="text-3xl font-extrabold text-white">
              Everything You Need to Know
            </h3>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-2"
              >
                <div className="flex items-center gap-2 text-base font-semibold text-white">
                  <HelpCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>{faq.q}</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-400 pl-6 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CALL TO ACTION BANNER */}
      <section className="py-16 bg-gradient-to-br from-emerald-950/60 via-slate-950 to-slate-950 border-t border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Ready to Crack Your Next Technical Interview?
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            Join thousands of students and engineers preparing with CodePrep. Start solving today with personalized recommendations and company-focused roadmaps.
          </p>
          <div className="pt-2">
            <a
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-base shadow-xl shadow-emerald-500/20 transition-all hover:scale-105"
            >
              <span>Get Started Now — It's Free</span>
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
