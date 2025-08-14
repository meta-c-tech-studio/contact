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
        starterCode: {
            javascript: dedent(`
        function twoSum(nums, target) {
          // Write your JavaScript code here
        }
        
        // Test the function
        console.log(JSON.stringify(twoSum([2,7,11,15], 9)));
        console.log(JSON.stringify(twoSum([3,2,4], 6)));
        console.log(JSON.stringify(twoSum([3,3], 6)));
      `),
            python: dedent(`
        def twoSum(nums, target):
            # Write your Python code here
            pass
        
        # Test the function
        import json
        print(json.dumps(twoSum([2,7,11,15], 9)))
        print(json.dumps(twoSum([3,2,4], 6)))
        print(json.dumps(twoSum([3,3], 6)))
      `),
            java: dedent(`
        import java.util.*;
        
        class Solution {
            public int[] twoSum(int[] nums, int target) {
                // Write your Java code here
                return new int[]{};
            }
            
            public static void main(String[] args) {
                Solution solution = new Solution();
                System.out.println(Arrays.toString(solution.twoSum(new int[]{2,7,11,15}, 9)));
                System.out.println(Arrays.toString(solution.twoSum(new int[]{3,2,4}, 6)));
                System.out.println(Arrays.toString(solution.twoSum(new int[]{3,3}, 6)));
            }
        }
      `),
        },
        testCases: [
            {
                input: "[2,7,11,15], 9",
                expectedOutput: "[0,1]",
                description: "Basic case with solution at beginning",
            },
            {
                input: "[3,2,4], 6",
                expectedOutput: "[1,2]",
                description: "Solution not at beginning",
            },
            {
                input: "[3,3], 6",
                expectedOutput: "[0,1]",
                description: "Duplicate numbers",
            },
        ],
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
        starterCode: {
            javascript: dedent(`
        function reverseString(s) {
          // Write your JavaScript code here
        }
        
        // Test the function
        let test1 = ["h","e","l","l","o"];
        reverseString(test1);
        console.log(JSON.stringify(test1));
        
        let test2 = ["H","a","n","n","a","h"];
        reverseString(test2);
        console.log(JSON.stringify(test2));
      `),
            python: dedent(`
        def reverseString(s):
            # Write your Python code here
            pass
        
        # Test the function
        import json
        test1 = ["h","e","l","l","o"]
        reverseString(test1)
        print(json.dumps(test1))
        
        test2 = ["H","a","n","n","a","h"]
        reverseString(test2)
        print(json.dumps(test2))
      `),
            java: dedent(`
        import java.util.*;
        
        class Solution {
          public void reverseString(char[] s) {
              // Write your Java code here
          }
          
          public static void main(String[] args) {
              Solution solution = new Solution();
              
              char[] test1 = {'h','e','l','l','o'};
              solution.reverseString(test1);
              System.out.println(Arrays.toString(test1));
              
              char[] test2 = {'H','a','n','n','a','h'};
              solution.reverseString(test2);
              System.out.println(Arrays.toString(test2));
          }
        }
      `),
        },
        testCases: [
            {
                input: '["h","e","l","l","o"]',
                expectedOutput: '["o","l","l","e","h"]',
                description: "Basic string reversal",
            },
            {
                input: '["H","a","n","n","a","h"]',
                expectedOutput: '["h","a","n","n","a","H"]',
                description: "Mixed case string - should be case sensitive",
            },
        ],
    },
    {
        id: "3",
        title: "Merge Two Sorted Lists",
        difficulty: "Easy",
        description: dedent(`
      You are given the heads of two sorted linked lists \`list1\` and \`list2\`.
      
      Merge the two lists into one sorted list. The list should be made by splicing together the nodes of the first two lists.
      
      Return the head of the merged linked list.

      **Example 1:**
      \`\`\`
      Input: list1 = [1,2,4], list2 = [1,3,4]
      Output: [1,1,2,3,4,4]
      \`\`\`

      **Example 2:**
      \`\`\`
      Input: list1 = [], list2 = []
      Output: []
      \`\`\`

      **Example 3:**
      \`\`\`
      Input: list1 = [], list2 = [0]
      Output: [0]
      \`\`\`

      **Constraints:**
      *   The number of nodes in both lists is in the range \`[0, 50]\`.
      *   \`-100 <= Node.val <= 100\`
      *   Both \`list1\` and \`list2\` are sorted in non-decreasing order.
    `),
        starterCode: {
            javascript: dedent(`
        // Definition for singly-linked list.
        class ListNode {
            constructor(val = 0, next = null) {
                this.val = val;
                this.next = next;
            }
        }

        function mergeTwoLists(list1, list2) {
            // Write your JavaScript code here
        }
        
        // Helper function to create linked list from array
        function createList(arr) {
            if (arr.length === 0) return null;
            let head = new ListNode(arr[0]);
            let current = head;
            for (let i = 1; i < arr.length; i++) {
                current.next = new ListNode(arr[i]);
                current = current.next;
            }
            return head;
        }
        
        // Helper function to convert linked list to array
        function listToArray(head) {
            let result = [];
            while (head) {
                result.push(head.val);
                head = head.next;
            }
            return result;
        }
        
        // Test the function
        console.log(JSON.stringify(listToArray(mergeTwoLists(createList([1,2,4]), createList([1,3,4])))));
        console.log(JSON.stringify(listToArray(mergeTwoLists(createList([]), createList([])))));
        console.log(JSON.stringify(listToArray(mergeTwoLists(createList([]), createList([0])))));
      `),
            python: dedent(`
        # Definition for singly-linked list.
        class ListNode:
            def __init__(self, val=0, next=None):
                self.val = val
                self.next = next

        def mergeTwoLists(list1, list2):
            # Write your Python code here
            pass
        
        # Helper function to create linked list from array
        def create_list(arr):
            if not arr:
                return None
            head = ListNode(arr[0])
            current = head
            for i in range(1, len(arr)):
                current.next = ListNode(arr[i])
                current = current.next
            return head
        
        # Helper function to convert linked list to array
        def list_to_array(head):
            result = []
            while head:
                result.append(head.val)
                head = head.next
            return result
        
        # Test the function
        import json
        print(json.dumps(list_to_array(mergeTwoLists(create_list([1,2,4]), create_list([1,3,4])))))
        print(json.dumps(list_to_array(mergeTwoLists(create_list([]), create_list([])))))
        print(json.dumps(list_to_array(mergeTwoLists(create_list([]), create_list([0])))))
      `),
            java: dedent(`
        import java.util.*;
        
        // Definition for singly-linked list.
        class ListNode {
            int val;
            ListNode next;
            ListNode() {}
            ListNode(int val) { this.val = val; }
            ListNode(int val, ListNode next) { this.val = val; this.next = next; }
        }
        
        class Solution {
            public ListNode mergeTwoLists(ListNode list1, ListNode list2) {
                // Write your Java code here
                return null;
            }
            
            // Helper function to create linked list from array
            public static ListNode createList(int[] arr) {
                if (arr.length == 0) return null;
                ListNode head = new ListNode(arr[0]);
                ListNode current = head;
                for (int i = 1; i < arr.length; i++) {
                    current.next = new ListNode(arr[i]);
                    current = current.next;
                }
                return head;
            }
            
            // Helper function to convert linked list to array
            public static int[] listToArray(ListNode head) {
                List<Integer> result = new ArrayList<>();
                while (head != null) {
                    result.add(head.val);
                    head = head.next;
                }
                return result.stream().mapToInt(i -> i).toArray();
            }
            
            public static void main(String[] args) {
                Solution solution = new Solution();
                System.out.println(Arrays.toString(listToArray(solution.mergeTwoLists(createList(new int[]{1,2,4}), createList(new int[]{1,3,4})))));
                System.out.println(Arrays.toString(listToArray(solution.mergeTwoLists(createList(new int[]{}), createList(new int[]{})))));
                System.out.println(Arrays.toString(listToArray(solution.mergeTwoLists(createList(new int[]{}), createList(new int[]{0})))));
            }
        }
      `),
        },
        testCases: [
            {
                input: "list1 = [1,2,4], list2 = [1,3,4]",
                expectedOutput: "[1,1,2,3,4,4]",
                description: "Merge two non-empty sorted lists",
            },
            {
                input: "list1 = [], list2 = []",
                expectedOutput: "[]",
                description: "Both lists are empty",
            },
            {
                input: "list1 = [], list2 = [0]",
                expectedOutput: "[0]",
                description: "One list is empty",
            },
        ],
    },
]
