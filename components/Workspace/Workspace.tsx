"use client";

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import ProblemDescription from './ProblemDescription';
import ConsolePanel from './ConsolePanel';

const EditorPanel = dynamic(() => import('./EditorPanel'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full bg-[#1e1e1e] flex items-center justify-center text-muted-foreground rounded-md border border-border">
            Loading Editor...
        </div>
    ),
});

interface WorkspaceProps {
    problem: any;
    testCases: any[];
    codeSnippets: any[];
}

export default function Workspace({ problem, testCases, codeSnippets }: WorkspaceProps) {
    const [selectedLanguage, setSelectedLanguage] = useState('javascript');
    const [codeByLang, setCodeByLang] = useState<Record<string, string>>(() => {
        const initial: Record<string, string> = {
            javascript: 'var threeSum = function(nums) {\n    \n};',
            cpp: '#include <vector>\n\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<vector<int>> threeSum(vector<int>& nums) {\n        \n    }\n};',
            java: 'import java.util.*;\n\nclass Solution {\n    public List<List<Integer>> threeSum(int[] nums) {\n        \n    }\n}',
            python: 'class Solution:\n    def threeSum(self, nums: List[int]) -> List[List[int]]:\n        '
        };
        codeSnippets.forEach((c: any) => {
            initial[c.language] = c.code;
        });
        return initial;
    });

    const handleCodeChange = (lang: string, code: string) => {
        setCodeByLang(prev => ({
            ...prev,
            [lang]: code
        }));
    };

    return (
        <div
            style={{
                display: 'flex',
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                padding: '8px',
                gap: '8px',
                boxSizing: 'border-box',
                backgroundColor: 'var(--background)',
            }}
        >
            {/* Left: Problem Description */}
            <div style={{ width: '50%', height: '100%', overflow: 'hidden' }}>
                <ProblemDescription problem={problem} />
            </div>

            {/* Right: Editor (60%) + Console (40%) */}
            <div style={{ width: '50%', height: '100%', display: 'flex', flexDirection: 'column', gap: '8px', overflow: 'hidden' }}>
                <div style={{ height: '60%', width: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden', backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '6px' }}>
                    {/* Editor Header Bar with Language Selector */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 16px', borderBottom: '1px solid var(--border)', backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
                        <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--muted-foreground)' }}>
                            Code Editor
                        </div>
                        <select
                            value={selectedLanguage}
                            onChange={(e) => setSelectedLanguage(e.target.value)}
                            style={{
                                padding: '4px 8px',
                                borderRadius: '4px',
                                backgroundColor: 'var(--background)',
                                color: 'var(--foreground)',
                                border: '1px solid var(--border)',
                                fontSize: '13px',
                                outline: 'none',
                                cursor: 'pointer',
                            }}
                        >
                            <option value="javascript">JavaScript</option>
                            <option value="cpp">C++ (GCC 17)</option>
                            <option value="java">Java (JDK 17)</option>
                            <option value="python">Python (Python 3)</option>
                        </select>
                    </div>
                    {/* Monaco Editor Container */}
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                        <EditorPanel
                            key={selectedLanguage}
                            initialCode={codeByLang[selectedLanguage] || ''}
                            language={selectedLanguage}
                            onChange={(code: any) => handleCodeChange(selectedLanguage, code || '')}
                        />
                    </div>
                </div>
                <div style={{ height: 'calc(40% - 8px)', width: '100%', overflow: 'hidden' }}>
                    <ConsolePanel
                        problemSlug={problem.slug}
                        language={selectedLanguage}
                        testCases={testCases}
                        userCode={codeByLang[selectedLanguage] || ''}
                    />
                </div>
            </div>
        </div>
    );
}
