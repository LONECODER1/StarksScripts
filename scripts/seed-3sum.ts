import prisma from '../app/lib/prisma';

async function main() {
    const slug = '3sum';
    
    // Check if problem exists
    let problem = await prisma.problem.findUnique({
        where: { slug }
    });

    if (!problem) {
        problem = await prisma.problem.create({
            data: {
                title: '3Sum',
                slug: '3sum',
                description: `<p>Given an integer array <code>nums</code>, return all the triplets <code>[nums[i], nums[j], nums[k]]</code> such that <code>i != j</code>, <code>i != k</code>, and <code>j != k</code>, and <code>nums[i] + nums[j] + nums[k] == 0</code>.</p><p>Notice that the solution set must not contain duplicate triplets.</p>`,
                difficlty: 'Medium',
                points: 20,
                acceptanceRate: 34.5
            }
        });
        console.log('Created problem 3Sum');
    } else {
        console.log('Problem 3Sum already exists');
    }

    // Upsert Snippets
    const snippets = [
        {
            language: 'javascript',
            code: '/**\n * @param {number[]} nums\n * @return {number[][]}\n */\nvar threeSum = function(nums) {\n    \n};'
        },
        {
            language: 'cpp',
            code: '#include <vector>\n\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<vector<int>> threeSum(vector<int>& nums) {\n        \n    }\n};'
        },
        {
            language: 'java',
            code: 'import java.util.*;\n\nclass Solution {\n    public List<List<Integer>> threeSum(int[] nums) {\n        \n    }\n}'
        },
        {
            language: 'python',
            code: 'class Solution:\n    def threeSum(self, nums: List[int]) -> List[List[int]]:\n        '
        }
    ];

    for (const snip of snippets) {
        const existingSnippet = await prisma.codeSnippet.findFirst({
            where: { problemId: problem.id, language: snip.language }
        });

        if (!existingSnippet) {
            await prisma.codeSnippet.create({
                data: {
                    language: snip.language,
                    code: snip.code,
                    problemId: problem.id
                }
            });
            console.log(`Created code snippet for 3Sum (${snip.language})`);
        } else {
            console.log(`Code snippet for 3Sum (${snip.language}) already exists`);
        }
    }

    // Add test cases
    const testcases = [
        {
            input: '[-1,0,1,2,-1,-4]',
            output: '[[-1,-1,2],[-1,0,1]]',
            isSample: true
        },
        {
            input: '[0,1,1]',
            output: '[]',
            isSample: true
        },
        {
            input: '[0,0,0]',
            output: '[[0,0,0]]',
            isSample: true
        }
    ];

    const existingTestCases = await prisma.testCase.findMany({
        where: { problemId: problem.id }
    });

    if (existingTestCases.length === 0) {
        for (const tc of testcases) {
            await prisma.testCase.create({
                data: {
                    input: tc.input,
                    output: tc.output,
                    isSample: tc.isSample,
                    problemId: problem.id
                }
            });
        }
        console.log('Created 3 test cases for 3Sum');
    } else {
        console.log('Test cases already exist');
    }

    console.log('3Sum seed complete.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
