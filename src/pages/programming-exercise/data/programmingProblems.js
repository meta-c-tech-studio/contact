function dedent(str) {
    const lines = str.split("\n")
    // Find the smallest common indentation (excluding empty lines)
    let minIndent = Number.POSITIVE_INFINITY
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        if (line.trim().length === 0) continue // Skip empty lines
        const match = line.match(/^\s*/)
        if (match && match[0].length < minIndent) {
            minIndent = match[0].length
        }
    }

    if (minIndent === Number.POSITIVE_INFINITY) return str.trim() // All lines were empty or no common indent

    // Remove the common indentation from each line
    return lines
        .map((line) => line.substring(minIndent))
        .join("\n")
        .trim()
}

export const programmingProblems = [
    {
        id: "1",
        title: "Two Sum",
        difficulty: "Easy",
        description: dedent(`
      Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.
      You may assume that each input would have exactly one solution, and you may not use the same element twice.
      You can return the answer in any order.

      **Example 1:**
      \`\`\`
      Input: nums = [2,7,11,15], target = 9
      Output: [0,1]
      Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].
      \`\`\`

      **Example 2:**
      \`\`\`
      Input: nums = [3,2,4], target = 6
      Output: [1,2]
      \`\`\`

      **Constraints:**
      *   \`2 <= nums.length <= 10^4\`
      *   \`-10^9 <= nums[i] <= 10^9\`
      *   \`-10^9 <= target <= 10^9\`
      *   Only one valid answer exists.
    `),
        starterCode: `
function twoSum(nums, target) {
  // Write your code here
};
`,
    },
    {
        id: "2",
        title: "Reverse String",
        difficulty: "Easy",
        description: dedent(`
      Write a function that reverses a string. The input string is given as an array of characters \`s\`.
      You must do this by modifying the input array in-place with O(1) extra memory.

      **Example 1:**
      \`\`\`
      Input: s = ["h","e","l","l","o"]
      Output: ["o","l","l","e","h"]
      \`\`\`

      **Example 2:**
      \`\`\`
      Input: s = ["H","a","n","n","a","h"]
      Output: ["h","a","n","n","a","H"]
      \`\`\`

      **Constraints:**
      *   \`1 <= s.length <= 10^5\`
      *   \`s[i]\` is a printable ascii character.
    `),
        starterCode: `
function reverseString(s) {
  // Write your code here
};
`,
    },
    {
        id: "3",
        title: "Palindrome Number",
        difficulty: "Easy",
        description: dedent(`
      Given an integer \`x\`, return \`true\` if \`x\` is a palindrome, and \`false\` otherwise.
      An integer is a palindrome when it reads the same backward as forward.
      For example, \`121\` is a palindrome while \`123\` is not.

      **Example 1:**
      \`\`\`
      Input: x = 121
      Output: true
      \`\`\`

      **Example 2:**
      \`\`\`
      Input: x = -121
      Output: false
      Explanation: From left to right, it reads -121. From right to left, it becomes 121-. Therefore it is not a palindrome.
      \`\`\`

      **Constraints:**
      *   \`-2^31 <= x <= 2^31 - 1\`
    `),
        starterCode: `
function isPalindrome(x) {
  // Write your code here
};
`,
    },
]
