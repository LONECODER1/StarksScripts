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
    const defaultSnippet = codeSnippets.find((c: any) => c.language === 'javascript')?.code || '';
    const [userCode, setUserCode] = useState(defaultSnippet);

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
                <div style={{ height: '60%', width: '100%', overflow: 'hidden' }}>
                    <EditorPanel
                        initialCode={defaultSnippet}
                        onChange={(code: any) => setUserCode(code || '')}
                    />
                </div>
                <div style={{ height: 'calc(40% - 8px)', width: '100%', overflow: 'hidden' }}>
                    <ConsolePanel
                        testCases={testCases}
                        userCode={userCode}
                    />
                </div>
            </div>
        </div>
    );
}
