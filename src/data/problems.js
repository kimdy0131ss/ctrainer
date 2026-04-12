export const PROBLEMS = [
  {
    id: 1,
    title: 'Two Sum',
    difficulty: 'easy',
    tags: ['Array', 'Hash Table'],
    acceptance: 0,
    submissions: 0,
    solved: false,
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
      c: `#include <stdio.h>
#include <stdlib.h>

/* 이 함수를 완성하세요 */
void twoSum(int* nums, int n, int target, int* out) {

}

/* ── 아래 main은 수정하지 마세요 ── */
int main() {
    int n, target;
    scanf("%d %d", &n, &target);
    int* nums = (int*)malloc(n * sizeof(int));
    for (int i = 0; i < n; i++) scanf("%d", &nums[i]);
    int out[2];
    twoSum(nums, n, target, out);
    printf("[%d,%d]\\n", out[0], out[1]);
    free(nums);
    return 0;
}`,
    },
    testCases: [
      { input: '4 9\n2 7 11 15', expected: '[0,1]' },
      { input: '3 6\n3 2 4', expected: '[1,2]' },
      { input: '2 6\n3 3', expected: '[0,1]' },
    ],
  },
  {
    id: 2,
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'medium',
    tags: ['String', 'Sliding Window', 'Hash Table'],
    acceptance: 0,
    submissions: 0,
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
      c: `#include <stdio.h>
#include <string.h>

/* 이 함수를 완성하세요 */
int lengthOfLongestSubstring(char* s) {

}

/* ── 아래 main은 수정하지 마세요 ── */
int main() {
    char s[50001];
    scanf("%s", s);
    printf("%d\\n", lengthOfLongestSubstring(s));
    return 0;
}`,
    },
    testCases: [
      { input: 'abcabcbb', expected: '3' },
      { input: 'bbbbb', expected: '1' },
      { input: 'pwwkew', expected: '3' },
    ],
  },
  {
    id: 3,
    title: 'Median of Two Sorted Arrays',
    difficulty: 'hard',
    tags: ['Array', 'Binary Search', 'Divide and Conquer'],
    acceptance: 0,
    submissions: 0,
    solved: false,
    description: `Given two sorted arrays \`nums1\` and \`nums2\` of size \`m\` and \`n\` respectively, return **the median** of the two sorted arrays.

The overall run time complexity should be **O(log(m+n))**.`,
    examples: [
      { input: 'nums1 = [1,3], nums2 = [2]', output: '2.00000', explanation: 'merged array = [1,2,3] and median is 2.' },
      { input: 'nums1 = [1,2], nums2 = [3,4]', output: '2.50000', explanation: 'merged array = [1,2,3,4] and median is (2 + 3) / 2 = 2.5.' },
    ],
    constraints: [
      '0 ≤ m, n ≤ 1000',
      '1 ≤ m + n ≤ 2000',
      '-10⁶ ≤ nums1[i], nums2[i] ≤ 10⁶',
    ],
    starterCode: {
      c: `#include <stdio.h>
#include <stdlib.h>

/* 이 함수를 완성하세요 */
double findMedianSortedArrays(int* nums1, int m, int* nums2, int n) {

}

/* ── 아래 main은 수정하지 마세요 ── */
int main() {
    int m;
    scanf("%d", &m);
    int* nums1 = (int*)malloc(m * sizeof(int));
    for (int i = 0; i < m; i++) scanf("%d", &nums1[i]);
    int n;
    scanf("%d", &n);
    int* nums2 = (int*)malloc(n * sizeof(int));
    for (int i = 0; i < n; i++) scanf("%d", &nums2[i]);
    printf("%.5f\\n", findMedianSortedArrays(nums1, m, nums2, n));
    free(nums1); free(nums2);
    return 0;
}`,
    },
    testCases: [
      { input: '2\n1 3\n1\n2', expected: '2.00000' },
      { input: '2\n1 2\n2\n3 4', expected: '2.50000' },
    ],
  },
  {
    id: 4,
    title: 'Valid Parentheses',
    difficulty: 'easy',
    tags: ['String', 'Stack'],
    acceptance: 0,
    submissions: 0,
    solved: false,
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
      c: `#include <stdio.h>
#include <string.h>

/* 이 함수를 완성하세요 */
int isValid(char* s) {

}

/* ── 아래 main은 수정하지 마세요 ── */
int main() {
    char s[10001];
    scanf("%s", s);
    printf("%s\\n", isValid(s) ? "true" : "false");
    return 0;
}`,
    },
    testCases: [
      { input: '()', expected: 'true' },
      { input: '()[]{}', expected: 'true' },
      { input: '(]', expected: 'false' },
      { input: '([)]', expected: 'false' },
    ],
  },
  {
    id: 5,
    title: 'Merge K Sorted Lists',
    difficulty: 'hard',
    tags: ['Linked List', 'Heap', 'Divide and Conquer'],
    acceptance: 0,
    submissions: 0,
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
      c: `#include <stdio.h>
#include <stdlib.h>

struct ListNode {
    int val;
    struct ListNode* next;
};

/* 이 함수를 완성하세요 */
struct ListNode* mergeKLists(struct ListNode** lists, int k) {

}

/* ── 아래 코드는 수정하지 마세요 ── */
struct ListNode* makeList(int* arr, int n) {
    if (n == 0) return NULL;
    struct ListNode* h = malloc(sizeof(struct ListNode));
    h->val = arr[0]; h->next = NULL;
    struct ListNode* c = h;
    for (int i = 1; i < n; i++) {
        c->next = malloc(sizeof(struct ListNode));
        c->next->val = arr[i]; c->next->next = NULL;
        c = c->next;
    }
    return h;
}

int main() {
    int k;
    scanf("%d", &k);
    struct ListNode** lists = malloc(k * sizeof(struct ListNode*));
    for (int i = 0; i < k; i++) {
        int n; scanf("%d", &n);
        int* arr = malloc(n * sizeof(int));
        for (int j = 0; j < n; j++) scanf("%d", &arr[j]);
        lists[i] = makeList(arr, n);
        free(arr);
    }
    struct ListNode* r = mergeKLists(lists, k);
    printf("[");
    int first = 1;
    while (r) { if (!first) printf(","); printf("%d", r->val); first = 0; r = r->next; }
    printf("]\\n");
    free(lists);
    return 0;
}`,
    },
    testCases: [
      { input: '3\n3\n1 4 5\n3\n1 3 4\n2\n2 6', expected: '[1,1,2,3,4,4,5,6]' },
      { input: '0', expected: '[]' },
    ],
  },
  {
    id: 6,
    title: 'Climbing Stairs',
    difficulty: 'easy',
    tags: ['Dynamic Programming', 'Math'],
    acceptance: 0,
    submissions: 0,
    solved: false,
    description: `You are climbing a staircase. It takes \`n\` steps to reach the top.

Each time you can either climb \`1\` or \`2\` steps. In how many distinct ways can you climb to the top?`,
    examples: [
      { input: 'n = 2', output: '2', explanation: '1+1 | 2' },
      { input: 'n = 3', output: '3', explanation: '1+1+1 | 1+2 | 2+1' },
    ],
    constraints: ['1 ≤ n ≤ 45'],
    starterCode: {
      c: `#include <stdio.h>

/* 이 함수를 완성하세요 */
int climbStairs(int n) {

}

/* ── 아래 main은 수정하지 마세요 ── */
int main() {
    int n;
    scanf("%d", &n);
    printf("%d\\n", climbStairs(n));
    return 0;
}`,
    },
    testCases: [
      { input: '2', expected: '2' },
      { input: '3', expected: '3' },
      { input: '5', expected: '8' },
    ],
  },
  {
    id: 7,
    title: 'LRU Cache',
    difficulty: 'medium',
    tags: ['Hash Table', 'Linked List', 'Design'],
    acceptance: 0,
    submissions: 0,
    solved: false,
    description: `Design a data structure that follows the constraints of a **Least Recently Used (LRU) cache**.

Implement the \`LRUCache\` struct:
- \`lRUCacheCreate(capacity)\` Initialize with positive size \`capacity\`.
- \`lRUCacheGet(obj, key)\` Return value if exists, otherwise return \`-1\`.
- \`lRUCachePut(obj, key, value)\` Update or insert key-value. Evict LRU key if over capacity.`,
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
    ],
    starterCode: {
      c: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct LRUCache LRUCache;

/* 이 함수들을 완성하세요 */
LRUCache* lRUCacheCreate(int capacity) {

}

int lRUCacheGet(LRUCache* obj, int key) {

}

void lRUCachePut(LRUCache* obj, int key, int value) {

}

void lRUCacheFree(LRUCache* obj) {

}

/* ── 아래 main은 수정하지 마세요 ── */
int main() {
    int q; scanf("%d", &q);
    LRUCache* cache = NULL;
    for (int i = 0; i < q; i++) {
        char op[20]; scanf("%s", op);
        if (i > 0) printf(",");
        if (strcmp(op, "LRUCache") == 0) {
            int cap; scanf("%d", &cap);
            cache = lRUCacheCreate(cap); printf("null");
        } else if (strcmp(op, "put") == 0) {
            int k, v; scanf("%d %d", &k, &v);
            lRUCachePut(cache, k, v); printf("null");
        } else {
            int k; scanf("%d", &k);
            printf("%d", lRUCacheGet(cache, k));
        }
    }
    printf("\\n");
    if (cache) lRUCacheFree(cache);
    return 0;
}`,
    },
    testCases: [
      {
        input: '10\nLRUCache 2\nput 1 1\nput 2 2\nget 1\nput 3 3\nget 2\nput 4 4\nget 1\nget 3\nget 4',
        expected: 'null,null,null,1,null,-1,null,-1,3,4',
      },
    ],
  },
  {
    id: 8,
    title: 'Trapping Rain Water',
    difficulty: 'hard',
    tags: ['Array', 'Two Pointers', 'Dynamic Programming', 'Stack'],
    acceptance: 0,
    submissions: 0,
    solved: false,
    description: `Given \`n\` non-negative integers representing an elevation map where the width of each bar is \`1\`, compute how much water it can trap after raining.`,
    examples: [
      { input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]', output: '6' },
      { input: 'height = [4,2,0,3,2,5]', output: '9' },
    ],
    constraints: [
      '1 ≤ n ≤ 2 × 10⁴',
      '0 ≤ height[i] ≤ 10⁵',
    ],
    starterCode: {
      c: `#include <stdio.h>
#include <stdlib.h>

/* 이 함수를 완성하세요 */
int trap(int* height, int n) {

}

/* ── 아래 main은 수정하지 마세요 ── */
int main() {
    int n; scanf("%d", &n);
    int* h = (int*)malloc(n * sizeof(int));
    for (int i = 0; i < n; i++) scanf("%d", &h[i]);
    printf("%d\\n", trap(h, n));
    free(h);
    return 0;
}`,
    },
    testCases: [
      { input: '12\n0 1 0 2 1 0 1 3 2 1 2 1', expected: '6' },
      { input: '6\n4 2 0 3 2 5', expected: '9' },
    ],
  },
]

export const LEADERBOARD = []

export const STATS = {
  totalProblems: 8,
  totalUsers: 0,
  submissionsToday: 0,
  totalAC: 0,
  easySolved: 0,
  mediumSolved: 0,
  hardSolved: 0,
}
