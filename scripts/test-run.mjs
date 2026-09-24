async function testRun() {
  const code = `def twoSum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        diff = target - num
        if diff in seen:
            return [seen[diff], i]
        seen[num] = i
    return []

import sys
lines = sys.stdin.read().strip().split('\\n')
if len(lines) >= 2:
    nums = list(map(int, lines[0].split()))
    target = int(lines[1].strip())
    res = twoSum(nums, target)
    print(f"{res[0]} {res[1]}")
`;

  const res = await fetch('http://localhost:3000/api/problems/two-sum/run', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ language: 'python', code }),
  });

  const data = await res.json();
  console.log('API Status:', res.status);
  console.log('Code Execution Result:', data.status);
  console.log('Passed Test Cases:', data.passedTestCases, 'of', data.totalTestCases);
  console.log('Execution Time:', data.executionTimeMs, 'ms');
}

testRun();
