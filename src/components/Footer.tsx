import { Code2, Terminal, Shield, Cpu, BookOpen } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-950 font-bold font-mono">
                CP
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                Code<span className="text-emerald-400">Prep</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Modern MNC Coding Interview Preparation Platform. Designed for college students and working professionals to bridge fundamental programming to placement-ready mastery.
            </p>
            <div className="flex items-center space-x-3 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Sandbox Ready
              </span>
              <span>•</span>
              <span>80 Curated Problems</span>
            </div>
          </div>

          {/* MNC Tracks */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-4">
              MNC Company Tracks
            </h4>
            <ul className="space-y-2 text-xs">
              <li><a href="/companies/amazon" className="hover:text-emerald-400 transition-colors">Amazon SDE Prep</a></li>
              <li><a href="/companies/google" className="hover:text-emerald-400 transition-colors">Google Software Engineer</a></li>
              <li><a href="/companies/microsoft" className="hover:text-emerald-400 transition-colors">Microsoft Codility Rounds</a></li>
              <li><a href="/companies/tcs" className="hover:text-emerald-400 transition-colors">TCS Digital & Prime Track</a></li>
              <li><a href="/companies/infosys" className="hover:text-emerald-400 transition-colors">Infosys SP & DSE Assessment</a></li>
              <li><a href="/companies" className="text-emerald-400 hover:underline">View All 12 Companies →</a></li>
            </ul>
          </div>

          {/* Core DSA Topics */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-4">
              Core DSA Topics
            </h4>
            <ul className="space-y-2 text-xs">
              <li><a href="/problems?topic=Arrays" className="hover:text-emerald-400 transition-colors">Arrays & Hashing</a></li>
              <li><a href="/problems?topic=Dynamic+Programming" className="hover:text-emerald-400 transition-colors">Dynamic Programming</a></li>
              <li><a href="/problems?topic=Trees" className="hover:text-emerald-400 transition-colors">Trees & Binary Search Trees</a></li>
              <li><a href="/problems?topic=Graphs" className="hover:text-emerald-400 transition-colors">Graphs & Traversals (BFS/DFS)</a></li>
              <li><a href="/problems?topic=Sliding+Window" className="hover:text-emerald-400 transition-colors">Sliding Window & Two Pointers</a></li>
              <li><a href="/problems" className="text-emerald-400 hover:underline">Browse All 19 Topics →</a></li>
            </ul>
          </div>

          {/* Architecture & Engineering */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-4">
              Platform Architecture
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                <span>Next.js App Router + TypeScript</span>
              </div>
              <div className="flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5 text-sky-400" />
                <span>Multi-Language Sandboxed Execution</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span>Prisma Relational Database ORM</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-3.5 h-3.5 text-purple-400" />
                <span>Progressive Hint & Solution System</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400">
          <p>© {new Date().getFullYear()} CodePrep. "Practice Smart. Solve Better. Get Interview Ready."</p>
          <div className="flex items-center space-x-6 mt-4 sm:mt-0">
            <a href="/learn" className="hover:text-slate-300">Placement Roadmap</a>
            <a href="/mock-interview" className="hover:text-slate-300">Mock Assessments</a>
            <a href="/problems" className="hover:text-slate-300">Problem Library</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
