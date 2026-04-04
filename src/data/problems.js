export const PROBLEMS = [
  {
    id: 1,
    title: 'Two Sum',
    difficulty: 'easy',
    tags: ['Array', 'Hash Table'],
    acceptance: 49.2,
    submissions: 12840,
    solved: true,
    description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have **exactly one solution**, and you may not use the same element twice.

You can return the answer in any order.`,
    examples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].' },
      { input: 'nums = [3,2,4], target = 6', output: '[1,2]' },
    ],
    constraints: [
      '2 ≤ nums.length ≤ 10⁴',
      '-10⁹ ≤ nums[i] ≤ 10⁹',
      '-10⁹ ≤ target ≤ 10⁹',
      'Only one valid answer exists.',
    ],
    starterCode: {
      python: `def twoSum(nums: list[int], target: int) -> list[int]:
    # Write your solution here
    pass`,
      javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
    // Write your solution here
}`,
      cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Write your solution here
    }
};`,
    },
  },
  {
    id: 2,
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'medium',
    tags: ['String', 'Sliding Window', 'Hash Table'],
    acceptance: 34.1,
    submissions: 9210,
    solved: false,
    description: `Given a string \`s\`, find the length of the **longest substring** without duplicate characters.`,
    examples: [
      { input: 's = "abcabcbb"', output: '3', explanation: 'The answer is "abc", with the length of 3.' },
      { input: 's = "bbbbb"', output: '1', explanation: 'The answer is "b", with the length of 1.' },
    ],
    constraints: [
      '0 ≤ s.length ≤ 5 × 10⁴',
      's consists of English letters, digits, symbols and spaces.',
    ],
    starterCode: {
      python: `def lengthOfLongestSubstring(s: str) -> int:
    # Write your solution here
    pass`,
      javascript: `/**
 * @param {string} s
 * @return {number}
 */
function lengthOfLongestSubstring(s) {
    // Write your solution here
}`,
      cpp: `class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        // Write your solution here
    }
};`,
    },
  },
  {
    id: 3,
    title: 'Median of Two Sorted Arrays',
    difficulty: 'hard',
    tags: ['Array', 'Binary Search', 'Divide and Conquer'],
    acceptance: 38.7,
    submissions: 5430,
    solved: false,
    description: `Given two sorted arrays \`nums1\` and \`nums2\` of size \`m\` and \`n\` respectively, return **the median** of the two sorted arrays.

The overall run time complexity should be **O(log(m+n))**.`,
    examples: [
      { input: 'nums1 = [1,3], nums2 = [2]', output: '2.00000', explanation: 'merged array = [1,2,3] and median is 2.' },
      { input: 'nums1 = [1,2], nums2 = [3,4]', output: '2.50000', explanation: 'merged array = [1,2,3,4] and median is (2 + 3) / 2 = 2.5.' },
    ],
    constraints: [
      'nums1.length == m',
      'nums2.length == n',
      '0 ≤ m, n ≤ 1000',
      '1 ≤ m + n ≤ 2000',
      '-10⁶ ≤ nums1[i], nums2[i] ≤ 10⁶',
    ],
    starterCode: {
      python: `def findMedianSortedArrays(nums1: list[int], nums2: list[int]) -> float:
    # Write your solution here
    pass`,
      javascript: `/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number}
 */
function findMedianSortedArrays(nums1, nums2) {
    // Write your solution here
}`,
      cpp: `class Solution {
public:
    double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {
        // Write your solution here
    }
};`,
    },
  },
  {
    id: 4,
    title: 'Valid Parentheses',
    difficulty: 'easy',
    tags: ['String', 'Stack'],
    acceptance: 40.3,
    submissions: 11200,
    solved: true,
    description: `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.

An input string is valid if:
- Open brackets must be closed by the same type of brackets.
- Open brackets must be closed in the correct order.
- Every close bracket has a corresponding open bracket of the same type.`,
    examples: [
      { input: 's = "()"', output: 'true' },
      { input: 's = "()[]{}"', output: 'true' },
      { input: 's = "(]"', output: 'false' },
    ],
    constraints: [
      '1 ≤ s.length ≤ 10⁴',
      "s consists of parentheses only '()[]{}'.",
    ],
    starterCode: {
      python: `def isValid(s: str) -> bool:
    pass`,
      javascript: `function isValid(s) {
    // Write your solution here
}`,
      cpp: `class Solution {
public:
    bool isValid(string s) {
        // Write your solution here
    }
};`,
    },
  },
  {
    id: 5,
    title: 'Merge K Sorted Lists',
    difficulty: 'hard',
    tags: ['Linked List', 'Heap', 'Divide and Conquer'],
    acceptance: 47.8,
    submissions: 4180,
    solved: false,
    description: `You are given an array of \`k\` linked-lists \`lists\`, each linked-list is sorted in ascending order.

*Merge all the linked-lists into one sorted linked-list and return it.*`,
    examples: [
      { input: 'lists = [[1,4,5],[1,3,4],[2,6]]', output: '[1,1,2,3,4,4,5,6]' },
      { input: 'lists = []', output: '[]' },
    ],
    constraints: [
      'k == lists.length',
      '0 ≤ k ≤ 10⁴',
      '0 ≤ lists[i].length ≤ 500',
      '-10⁴ ≤ lists[i][j] ≤ 10⁴',
    ],
    starterCode: {
      python: `def mergeKLists(lists):
    pass`,
      javascript: `function mergeKLists(lists) {
    // Write your solution here
}`,
      cpp: `class Solution {
public:
    ListNode* mergeKLists(vector<ListNode*>& lists) {
        // Write your solution here
    }
};`,
    },
  },
  {
    id: 6,
    title: 'Climbing Stairs',
    difficulty: 'easy',
    tags: ['Dynamic Programming', 'Math'],
    acceptance: 51.6,
    submissions: 13900,
    solved: true,
    description: `You are climbing a staircase. It takes \`n\` steps to reach the top.

Each time you can either climb \`1\` or \`2\` steps. In how many distinct ways can you climb to the top?`,
    examples: [
      { input: 'n = 2', output: '2', explanation: 'There are two ways to climb to the top. 1 step + 1 step | 2 steps' },
      { input: 'n = 3', output: '3', explanation: '1+1+1 | 1+2 | 2+1' },
    ],
    constraints: ['1 ≤ n ≤ 45'],
    starterCode: {
      python: `def climbStairs(n: int) -> int:
    pass`,
      javascript: `function climbStairs(n) {
    // Write your solution here
}`,
      cpp: `class Solution {
public:
    int climbStairs(int n) {
        // Write your solution here
    }
};`,
    },
  },
  {
    id: 7,
    title: 'LRU Cache',
    difficulty: 'medium',
    tags: ['Hash Table', 'Linked List', 'Design'],
    acceptance: 41.2,
    submissions: 7650,
    solved: false,
    description: `Design a data structure that follows the constraints of a **Least Recently Used (LRU) cache**.

Implement the \`LRUCache\` class:
- \`LRUCache(int capacity)\` Initialize the LRU cache with positive size \`capacity\`.
- \`int get(int key)\` Return the value of the key if the key exists, otherwise return \`-1\`.
- \`void put(int key, int value)\` Update the value of the key if the key exists. Otherwise, add the key-value pair to the cache. If the number of keys exceeds the capacity from this operation, **evict** the least recently used key.

The functions \`get\` and \`put\` must each run in \`O(1)\` average time complexity.`,
    examples: [
      {
        input: '["LRUCache","put","put","get","put","get","put","get","get","get"]\n[[2],[1,1],[2,2],[1],[3,3],[2],[4,4],[1],[3],[4]]',
        output: '[null,null,null,1,null,-1,null,-1,3,4]',
      },
    ],
    constraints: [
      '1 ≤ capacity ≤ 3000',
      '0 ≤ key ≤ 10⁴',
      '0 ≤ value ≤ 10⁵',
      'At most 2 × 10⁵ calls will be made to get and put.',
    ],
    starterCode: {
      python: `class LRUCache:
    def __init__(self, capacity: int):
        pass

    def get(self, key: int) -> int:
        pass

    def put(self, key: int, value: int) -> None:
        pass`,
      javascript: `class LRUCache {
    constructor(capacity) {
        // Initialize
    }
    get(key) { }
    put(key, value) { }
}`,
      cpp: `class LRUCache {
public:
    LRUCache(int capacity) { }
    int get(int key) { }
    void put(int key, int value) { }
};`,
    },
  },
  {
    id: 8,
    title: 'Trapping Rain Water',
    difficulty: 'hard',
    tags: ['Array', 'Two Pointers', 'Dynamic Programming', 'Stack'],
    acceptance: 57.9,
    submissions: 6320,
    solved: false,
    description: `Given \`n\` non-negative integers representing an elevation map where the width of each bar is \`1\`, compute how much water it can trap after raining.`,
    examples: [
      { input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]', output: '6', explanation: 'The above elevation map is represented by array [0,1,0,2,1,0,1,3,2,1,2,1]. In this case, 6 units of rain water are being trapped.' },
      { input: 'height = [4,2,0,3,2,5]', output: '9' },
    ],
    constraints: [
      'n == height.length',
      '1 ≤ n ≤ 2 × 10⁴',
      '0 ≤ height[i] ≤ 10⁵',
    ],
    starterCode: {
      python: `def trap(height: list[int]) -> int:
    pass`,
      javascript: `function trap(height) {
    // Write your solution here
}`,
      cpp: `class Solution {
public:
    int trap(vector<int>& height) {
        // Write your solution here
    }
};`,
    },
  },
]

export const LEADERBOARD = [
  { rank: 1, username: 'aurora_dev', displayName: 'Aurora Dev', solved: 312, score: 48920, streak: 87, badge: 'Grandmaster' },
  { rank: 2, username: 'nx_coder', displayName: 'nx_coder', solved: 298, score: 45210, streak: 62, badge: 'Master' },
  { rank: 3, username: 'void_ptr', displayName: 'void_ptr', solved: 285, score: 43800, streak: 44, badge: 'Master' },
  { rank: 4, username: 'lambda_x', displayName: 'lambda_x', solved: 271, score: 41200, streak: 38, badge: 'Expert' },
  { rank: 5, username: 'hex_zero', displayName: 'hex_zero', solved: 264, score: 39750, streak: 29, badge: 'Expert' },
  { rank: 6, username: 'sigma_run', displayName: 'sigma_run', solved: 252, score: 37400, streak: 22, badge: 'Expert' },
  { rank: 7, username: 'bit_shift', displayName: 'bit_shift', solved: 239, score: 35100, streak: 18, badge: 'Advanced' },
  { rank: 8, username: 'deep_node', displayName: 'deep_node', solved: 228, score: 33600, streak: 15, badge: 'Advanced' },
  { rank: 9, username: 'r3cursion', displayName: 'r3cursion', solved: 215, score: 31200, streak: 11, badge: 'Advanced' },
  { rank: 10, username: 'poly_math', displayName: 'poly_math', solved: 203, score: 29800, streak: 9, badge: 'Intermediate' },
]

export const STATS = {
  totalProblems: 2847,
  totalUsers: 142000,
  submissionsToday: 48300,
  easySolved: 892,
  mediumSolved: 1241,
  hardSolved: 714,
}
