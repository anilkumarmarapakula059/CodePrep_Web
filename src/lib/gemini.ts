import { AIMentorRequest, AIMentorResponse } from './types';

/**
 * Intelligent CodePrep AI Mentor
 * Supports progressive hints, debugging, concept explanations, and complexity analysis.
 * Uses Google Gemini API when GEMINI_API_KEY is configured, with intelligent contextual
 * fallback heuristics for instant, zero-setup developer assistance.
 */
export async function getAIMentorAdvice(req: AIMentorRequest): Promise<AIMentorResponse> {
  const { problemTitle, problemDescription, userCode, language, mode, userMessage } = req;
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey && apiKey.trim().length > 0) {
    try {
      const systemPrompt = `You are CodePrep's senior MNC coding interview mentor.
Your job is to guide the candidate to solve "${problemTitle}" on their own.
Follow strict progressive guidance rules:
- NEVER reveal the full final code immediately unless explicitly asked.
- In 'hint' mode: give a single concise, thought-provoking hint.
- In 'debug' mode: point out logic flaws or edge cases without rewriting the whole code.
- In 'approach' mode: discuss the algorithmic intuition (e.g. Two Pointers, Monotonic Stack, DP recurrence).
- In 'complexity' mode: analyze Big-O time and space complexity tradeoffs.
- In 'explain' mode: break down the core concept in simple terms.
Keep responses concise, clear, and formatted in clean Markdown.`;

      const userPrompt = `Problem: ${problemTitle}
Description summary: ${problemDescription.slice(0, 300)}
Candidate's language: ${language}
Candidate's current code:
\`\`\`${language}
${userCode || '// No code written yet'}
\`\`\`
Mode requested: ${mode}
Candidate question/note: ${userMessage || 'Provide guidance for this mode'}`;

      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }],
            },
          ],
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 600,
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          return {
            mode,
            reply: text,
            followUpPrompt: 'Would you like to explore edge cases or move to the next hint?',
          };
        }
      }
    } catch (e) {
      console.warn('Gemini API call failed, using heuristic mentor fallback:', e);
    }
  }

  // Built-in intelligent contextual response based on mode and problem context
  switch (mode) {
    case 'hint':
      return {
        mode: 'hint',
        reply: `💡 **Mentor Hint for ${problemTitle}**:\n\n1. Consider the relationship between the inputs and what invariant remains constant as you iterate.\n2. Ask yourself: Can you trade **O(N)** additional memory (like a Hash Map or Set) to reduce the time complexity from **O(N²)** to **O(N)**?\n3. What happens if the input has duplicate values or negative numbers?`,
        followUpPrompt: 'Try identifying whether a single pass through the collection is possible.',
      };

    case 'debug':
      const codeLines = userCode.split('\n');
      const hasLoop = userCode.includes('for') || userCode.includes('while');
      const hasReturn = userCode.includes('return');
      return {
        mode: 'debug',
        reply: `🔍 **Code Analysis for ${problemTitle}**:\n\n` +
          `• **Structure Check**: Your ${language} code currently has ${codeLines.length} lines.\n` +
          `• **Return Invariant**: ${hasReturn ? '✅ Explicit return statement detected.' : '⚠️ No return statement detected! Ensure your function returns the expected value format.'}\n` +
          `• **Loop & Complexity**: ${hasLoop ? 'Iterative construct found. Ensure loop boundary indices do not go out of bounds.' : 'No loop found yet. Consider how you will traverse all input elements.'}\n` +
          `• **Edge Cases to Watch**: Empty arrays, single-element collections, and negative numbers.`,
        followUpPrompt: 'Run your code on the public test cases to inspect the exact discrepancy.',
      };

    case 'approach':
      return {
        mode: 'approach',
        reply: `🎯 **Recommended Algorithmic Approach for ${problemTitle}**:\n\n` +
          `1. **Brute Force (Baseline)**: Test all permutations/pairs. This typically yields **O(N²)** time.\n` +
          `2. **Optimal Approach**: Use an indexed lookup table (Hash Map) or Two Pointers (if sorted or sortable).\n` +
          `3. **Step-by-Step Flow**:\n` +
          `   - Read input stream.\n` +
          `   - Initialize lookup structure.\n` +
          `   - Iterate once, checking if the required complement or state is present.\n` +
          `   - Update the state and proceed.`,
        followUpPrompt: 'Would you like me to walk through the state transitions?',
      };

    case 'complexity':
      return {
        mode: 'complexity',
        reply: `⏱️ **Time & Space Complexity Breakdown**:\n\n` +
          `• **Time Complexity**: **O(N)** — We touch each element at most a constant number of times.\n` +
          `• **Space Complexity**: **O(N)** in the worst case where all elements are stored in a Hash Map.\n` +
          `• **MNC Interviewer Tip**: Always state your complexities before writing code. If asked to optimize space to **O(1)**, evaluate whether sorting first or using bitwise operations is acceptable!`,
        followUpPrompt: 'Does your solution satisfy the interview constraints?',
      };

    case 'explain':
    default:
      return {
        mode: 'explain',
        reply: `📚 **Concept Explanation: ${problemTitle}**:\n\n` +
          `This problem evaluates your core problem-solving intuition and ability to avoid redundant operations.\n\n` +
          `The goal is to produce the correct output format while maintaining optimal time complexity. Major MNCs like Amazon and Google evaluate:\n` +
          `1. Clean code syntax and idiomatic naming.\n` +
          `2. Handling of edge cases without crashing.\n` +
          `3. Explaining your thought process clearly before coding.`,
        followUpPrompt: 'Ready to write the implementation?',
      };
  }
}
