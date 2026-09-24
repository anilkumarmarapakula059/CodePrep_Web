# CodePrep — MNC Coding Interview Preparation Platform

> **"Practice Smart. Solve Better. Get Interview Ready."**

CodePrep is a production-ready, modern, responsive full-stack web application designed to bridge fundamental programming concepts to MNC-level algorithmic problem solving. Tailored for college students preparing for campus placements and working professionals executing focused career switches.

---

## 🚀 Live Demo & Quick Access

- **URL:** [http://localhost:3000](http://localhost:3000)
- **Preconfigured Evaluator Accounts (Password: `Password123!`):**
  - **Student Account (Narendra):** `student@codeprep.dev` (12-Phase Placement Roadmap, 5-Day Streak, Level 4)
  - **Working Professional (Vikram):** `pro@codeprep.dev` (30-Day Interview Accelerator, Advanced SDE-2 focus)
  - **System Admin:** `admin@codeprep.dev` (Full access to `/admin` content publishing & platform metrics)

> *Tip: You can switch between demo profiles instantly using the 1-click switcher in the user dropdown menu in the top right navigation bar.*

---

## 🌟 Key Architecture & Features

### 1. Curated MNC Problem Dataset (80 Questions)
- **80 Authentic, Curated Questions** across 20+ DSA topics and 12 MNCs:
  - **Basic (30 Problems):** Variables, conditions, loops, array manipulation, binary search, two pointers, valid parentheses, Kadane's algorithm.
  - **Intermediate (30 Problems):** Sliding window, trees, LCA, graphs, dynamic programming, backtracking, priority queues.
  - **Advanced (20 Problems):** Trapping rain water, alien dictionary, median of two sorted arrays, N-Queens, hard DP.
- **Verified Interview Frequency:** 1 to 5 stars (`★★★★★`) backed by verified reference citations from Tier-1 (Google, Amazon, Microsoft, Adobe, Oracle) and Service MNCs (TCS Digital, Infosys SP/DSE, Wipro, Cognizant, Accenture, Deloitte).

### 2. Zero-Spoiler Progressive Hint System
- Does not spoil solutions immediately.
- Unlocks **Hint 1** (conceptual intuition) → **Hint 2** (optimal data structure) → **Hint 3** (complexity & invariants) sequentially on candidate demand.

### 3. Online Code Editor & Execution Architecture
- **Monaco Editor** integration with syntax highlighting, line numbers, and developer themes.
- **Multi-Language Support:** Python 3, JavaScript (Node.js), Java, and C++.
- **Sandboxed Execution Engine:**
  - Fast public test case evaluation via **Run Code**.
  - Comprehensive hidden test suite evaluation via **Submit Code**.
  - Strict timeouts (2.5s) to eliminate infinite loops and resource abuse.
  - Subprocess and VM isolation with standard input/output normalization.
- **Production Scalability Specification:** Architecture ready for decoupled `API Server -> Redis Queue (BullMQ) -> Ephemeral Docker Sandbox Containers (--network=none, --memory=128m)`.

### 4. Interactive Learning Paths
- **Student Placement Roadmap:** 12 structured phases from Programming Fundamentals to Campus Mock Interviews.
- **30-Day Interview Accelerator:** Intensive 4-week sprint for working software engineers focusing on high-yield patterns.

### 5. MNC Company Preparation Hub (`/companies`)
- Deep-dive pages for 12 major tech companies.
- Historical topic weightage breakdowns (e.g. Amazon: 32% Trees & Graphs, 24% Arrays, 20% Heaps).
- Standard hiring rounds roadmap (Online Assessment, Tech Round 1, Tech Round 2, Bar Raiser).
- 1-click targeted mock assessment generator.

### 6. Timed Mock Interview Simulator (`/mock-interview`)
- Configurable by difficulty (Basic, Intermediate, Advanced), duration (30, 45, 60 minutes), company, and topic.
- Distraction-free live interview simulation mode with ticking countdown timer and real-time problem switching.
- **Post-Assessment Evaluation Report:** Score percentage, time management diagnosis, weak topics identification, and recommended next steps.

### 7. AI Coding Mentor
- 5 guided mentoring modes: **Explain Concept**, **Progressive Hint**, **Debug Code**, **Algorithmic Approach**, and **Big-O Complexity Analysis**.
- Optional integration with **Google Gemini API** (`GEMINI_API_KEY`), backed by heuristic domain analysis when running without external API keys.

### 8. Developer Gamification & Progress Tracking
- Daily streaks with flame indicator, XP accumulation, levels, and achievement badges.
- Weekly coding activity heatmaps, difficulty breakdown bars, and topic mastery diagnostic radar.

### 9. Admin Control Center (`/admin`)
- Add, edit, and delete problems with custom test cases, solutions, hints, and verified citations.
- Platform telemetry: DAU, total submissions, active users, popular problems, and user directories.

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Monaco Editor, Lucide Icons, Canvas Confetti.
- **Backend:** Next.js API Routes, JWT Session Management, BCryptJS.
- **Database & ORM:** Relational SQLite / PostgreSQL, Prisma ORM.
- **Sandboxed Code Execution:** Node.js VM Context & Python child processes with timeout guards.

---

## 📦 Setup & Local Development

### 1. Clone & Install Dependencies
```bash
git clone <repository-url>
cd Webfolder
npm install
```

### 2. Environment Configuration
Create a `.env` file in the root directory (or use default `.env`):
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="codeprep-super-secret-production-key-2026"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Optional: Add your Google Gemini API Key for live AI mentor generation
GEMINI_API_KEY=""
```

### 3. Initialize Database & Seed 80 Curated Problems
```bash
npx prisma generate
npx prisma db push
node scripts/seed.mjs
```

### 4. Run Development or Production Server
```bash
# Development mode
npm run dev

# Or Production build & start
npm run build
npm run start
```
Open [http://localhost:3000](http://localhost:3000) in your browser.
