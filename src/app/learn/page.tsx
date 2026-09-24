'use client';

import { useState } from 'react';
import {
  GraduationCap,
  Briefcase,
  CheckCircle2,
  Clock,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Layers,
  Sparkles,
  BookOpen,
} from 'lucide-react';

export default function LearnPage() {
  const [activeTrack, setActiveTrack] = useState<'student' | 'professional'>('student');
  const [expandedPhase, setExpandedPhase] = useState<number | null>(1);

  const studentPhases = [
    {
      phase: 1,
      title: 'Programming Fundamentals',
      duration: 'Week 1-2',
      topics: 'Variables, loops, condition branches, array indexing, function recursion baseline.',
      problemsCount: 6,
      progress: 100,
      problems: [
        { title: 'Palindrome Number', slug: 'palindrome-number', diff: 'BASIC' },
        { title: 'Contains Duplicate', slug: 'contains-duplicate', diff: 'BASIC' },
      ],
    },
    {
      phase: 2,
      title: 'Arrays & Strings Mastery',
      duration: 'Week 3-4',
      topics: 'Two Pointers, Prefix Sum, Sliding Window, In-place array operations, Anagrams.',
      problemsCount: 8,
      progress: 85,
      problems: [
        { title: 'Two Sum', slug: 'two-sum', diff: 'BASIC' },
        { title: 'Valid Anagram', slug: 'valid-anagram', diff: 'BASIC' },
        { title: 'Best Time to Buy and Sell Stock', slug: 'best-time-to-buy-and-sell-stock', diff: 'BASIC' },
      ],
    },
    {
      phase: 3,
      title: 'Searching & Sorting Algorithms',
      duration: 'Week 5',
      topics: 'Binary search variations, search on answer space, merge sort, quick sort partition.',
      problemsCount: 7,
      progress: 50,
      problems: [
        { title: 'Binary Search', slug: 'binary-search', diff: 'BASIC' },
      ],
    },
    {
      phase: 4,
      title: 'Linked Lists',
      duration: 'Week 6',
      topics: 'Singly linked lists, slow/fast pointers, cycle detection, list reversal, merge sort on list.',
      problemsCount: 6,
      progress: 30,
      problems: [
        { title: 'Merge Two Sorted Lists', slug: 'merge-two-sorted-lists', diff: 'BASIC' },
      ],
    },
    {
      phase: 5,
      title: 'Stack & Queue Systems',
      duration: 'Week 7',
      topics: 'Monotonic stack, valid parentheses, expression evaluation, queue using two stacks.',
      problemsCount: 6,
      progress: 0,
      problems: [
        { title: 'Valid Parentheses', slug: 'valid-parentheses', diff: 'BASIC' },
      ],
    },
    {
      phase: 6,
      title: 'Recursion & Backtracking',
      duration: 'Week 8',
      topics: 'Subsets, permutations, combination sum, pruning invalid states, N-Queens intuition.',
      problemsCount: 7,
      progress: 0,
      problems: [],
    },
    {
      phase: 7,
      title: 'Trees & Binary Search Trees',
      duration: 'Week 9-10',
      topics: 'DFS traversals, level-order BFS, LCA, BST validation, subtree checks.',
      problemsCount: 8,
      progress: 0,
      problems: [
        { title: 'Invert Binary Tree', slug: 'invert-binary-tree', diff: 'BASIC' },
      ],
    },
    {
      phase: 8,
      title: 'Graph Traversals & Connectivity',
      duration: 'Week 11-12',
      topics: 'Adjacency lists, BFS shortest path, DFS cycle detection, topological sort, Dijkstra.',
      problemsCount: 8,
      progress: 0,
      problems: [],
    },
    {
      phase: 9,
      title: 'Greedy Algorithms',
      duration: 'Week 13',
      topics: 'Interval scheduling, jump game, activity selection, fractional knapsack.',
      problemsCount: 5,
      progress: 0,
      problems: [],
    },
    {
      phase: 10,
      title: 'Dynamic Programming',
      duration: 'Week 14-16',
      topics: '1D DP, 2D grid DP, 0/1 Knapsack, Longest Common Subsequence, state transitions.',
      problemsCount: 12,
      progress: 0,
      problems: [
        { title: 'Climbing Stairs', slug: 'climbing-stairs', diff: 'BASIC' },
        { title: 'Maximum Subarray (Kadane’s)', slug: 'maximum-subarray', diff: 'BASIC' },
      ],
    },
    {
      phase: 11,
      title: 'Company-Specific Preparation',
      duration: 'Week 17-18',
      topics: 'Amazon Leadership & Trees, Google Graphs/DP, Microsoft Codility, TCS Digital sets.',
      problemsCount: 15,
      progress: 0,
      problems: [],
    },
    {
      phase: 12,
      title: 'Mock Interviews & Placement Ready',
      duration: 'Week 19-20',
      topics: 'Live timed simulations, verbal walkthroughs, behavioral alignment, bar-raiser practice.',
      problemsCount: 10,
      progress: 0,
      problems: [],
    },
  ];

  const proWeeks = [
    {
      week: 1,
      title: 'Week 1: Core DSA & Two Pointers',
      focus: 'High-frequency patterns in Arrays, Hash Maps, Strings, and Sliding Window.',
      target: '15 High-Yield Problems',
      topics: ['Two Sum Variants', 'Sliding Window Substrings', 'Monotonic Stack', 'In-place Matrix'],
    },
    {
      week: 2,
      title: 'Week 2: Trees, Graphs & Recursion',
      focus: 'Level-order BFS, Tree traversals, Topological Sort, and Disjoint Set Union (DSU).',
      target: '15 Intermediate Problems',
      topics: ['Lowest Common Ancestor', 'Course Schedule (Cycle)', 'Rotting Oranges BFS', 'Word Search'],
    },
    {
      week: 3,
      title: 'Week 3: Advanced DP & Intervals',
      focus: 'Knapsack variations, Longest Increasing Subsequence, Interval overlaps, and Subsequence DP.',
      target: '12 Advanced Problems',
      topics: ['Coin Change', 'Merge Intervals', 'Edit Distance', 'Trapping Rain Water'],
    },
    {
      week: 4,
      title: 'Week 4: MNC Problems & Timed Mocks',
      focus: 'Simulating full 45-minute technical rounds for target companies (Google, Amazon, Microsoft).',
      target: '8 Mocks + Company Sets',
      topics: ['Amazon Bar Raiser Sim', 'Google Screening Assessment', 'Time & Space Tradeoffs'],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Structured Learning Roadmaps
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Eliminate guesswork. Follow a step-by-step verified path tailored specifically for campus placements or job switches.
        </p>

        {/* Track Switcher Tabs */}
        <div className="inline-flex p-1 rounded-xl bg-slate-900 border border-slate-800 mt-4">
          <button
            onClick={() => setActiveTrack('student')}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTrack === 'student'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Student Placement Roadmap (12 Phases)</span>
          </button>

          <button
            onClick={() => setActiveTrack('professional')}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTrack === 'professional'
                ? 'bg-purple-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>30-Day Interview Accelerator</span>
          </button>
        </div>
      </div>

      {/* TRACK 1: STUDENT PLACEMENT ROADMAP */}
      {activeTrack === 'student' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs text-slate-300">
            <span>Overall Roadmap Progress: <b>42% Complete</b></span>
            <span className="font-mono text-emerald-400 font-bold">Phase 3 in Progress</span>
          </div>

          <div className="space-y-3">
            {studentPhases.map((phase) => {
              const isExpanded = expandedPhase === phase.phase;
              return (
                <div
                  key={phase.phase}
                  className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden transition-all"
                >
                  {/* Phase Summary Bar */}
                  <div
                    onClick={() => setExpandedPhase(isExpanded ? null : phase.phase)}
                    className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-850"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold font-mono ${
                        phase.progress === 100
                          ? 'bg-emerald-500 text-slate-950'
                          : phase.progress > 0
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {phase.progress === 100 ? '✓' : phase.phase}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-white">
                            Phase {phase.phase}: {phase.title}
                          </h3>
                          <span className="text-[11px] font-mono text-slate-400">({phase.duration})</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                          {phase.topics}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="hidden sm:block text-right">
                        <span className="text-xs font-mono text-emerald-400 font-semibold">{phase.progress}%</span>
                        <div className="w-24 bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
                          <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${phase.progress}%` }} />
                        </div>
                      </div>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </div>
                  </div>

                  {/* Expanded Phase Problems */}
                  {isExpanded && (
                    <div className="p-5 border-t border-slate-800/80 bg-slate-950/60 space-y-4">
                      <div className="text-xs text-slate-300 font-medium">
                        <b>Core Concepts:</b> {phase.topics}
                      </div>

                      {phase.problems.length > 0 ? (
                        <div className="space-y-2">
                          <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-400">
                            Key Practice Questions:
                          </div>
                          {phase.problems.map((p, idx) => (
                            <div
                              key={idx}
                              className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs"
                            >
                              <div className="flex items-center gap-2 font-medium text-white">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                <span>{p.title}</span>
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">
                                  {p.diff}
                                </span>
                              </div>
                              <a
                                href={`/problems/${p.slug}`}
                                className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1"
                              >
                                <span>Solve</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-xs text-slate-500 italic">
                          Problems curated for this phase will unlock as you complete prerequisite milestones.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TRACK 2: 30-DAY PROFESSIONAL ACCELERATOR */}
      {activeTrack === 'professional' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-slate-900 border border-purple-500/30 space-y-2">
            <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Sprint Structure for Working Engineers</span>
            </div>
            <h3 className="text-xl font-bold text-white">
              30-Day Interview Accelerator
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
              Targeted high-frequency algorithmic patterns for developers targeting SDE-1 and SDE-2 lateral moves. Focuses strictly on Tier-1 patterns without wasting time on basic syntax.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {proWeeks.map((week) => (
              <div
                key={week.week}
                className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono px-2.5 py-1 rounded bg-purple-500/10 text-purple-300 font-semibold border border-purple-500/20">
                      Sprint {week.week}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">{week.target}</span>
                  </div>

                  <h4 className="text-base font-bold text-white">{week.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{week.focus}</p>

                  <div className="space-y-1.5 pt-2">
                    <span className="text-[11px] uppercase font-semibold text-slate-400 tracking-wider">
                      Target Focus Topics:
                    </span>
                    <ul className="space-y-1 text-xs text-slate-300">
                      {week.topics.map((t, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                          <span>{t}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <a
                  href="/problems?difficulty=INTERMEDIATE"
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-purple-600 text-slate-200 hover:text-white text-xs font-bold text-center transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Start Week {week.week} Sprint</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
