"use client";

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Check, X, Code2 } from 'lucide-react';
import { cn } from '@/app/lib/utils';

interface TestCase {
    id: string;
    input: string;
    output: string;
    isSample: boolean;
}

interface ConsolePanelProps {
    problemSlug: string;
    language: string;
    testCases: TestCase[];
    userCode: string;
}

export default function ConsolePanel({ problemSlug, language, testCases, userCode }: ConsolePanelProps) {
    const [results, setResults] = useState<any>(null);
    const [isRunning, setIsRunning] = useState(false);
    const [activeTab, setActiveTab] = useState(0);

    const runCode = async () => {
        setIsRunning(true);
        setResults(null);
        try {
            const response = await fetch(`/api/problems/${problemSlug}/run`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    code: userCode,
                    language: language,
                }),
            });

            const data = await response.json();
            if (response.ok) {
                setResults(data);
            } else {
                setResults({
                    evalResults: [],
                    runtimeError: data.error || "Execution failed",
                });
            }
        } catch (err: any) {
            setResults({
                evalResults: [],
                runtimeError: err.message || "Failed to contact execution server",
            });
        } finally {
            setIsRunning(false);
        }
    };

    return (
        <Card className="h-full bg-card/30 backdrop-blur-md border border-border flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-black/20">
                <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                    <Code2 className="w-4 h-4" />
                    Console
                </div>
                <div className="flex gap-2">
                    <Button size="sm" variant="secondary" onClick={runCode} disabled={isRunning} className="bg-primary/20 text-primary hover:bg-primary/30">
                        <Play className="w-4 h-4 mr-2" />
                        Run
                    </Button>
                    <Button size="sm" onClick={runCode} disabled={isRunning} className="bg-green-600 hover:bg-green-700 text-white">
                        Submit
                    </Button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 font-mono text-sm">
                {!results ? (
                    <div className="text-muted-foreground">Click "Run" to evaluate your code against the sample test cases.</div>
                ) : results.runtimeError ? (
                    <div className="text-red-400 whitespace-pre-wrap">{results.runtimeError}</div>
                ) : (
                    <div className="flex flex-col gap-4">
                        <div className="flex gap-2 mb-2">
                            {results.evalResults.map((res: any, idx: number) => (
                                <button 
                                    key={idx} 
                                    onClick={() => setActiveTab(idx)}
                                    className={cn(
                                        "px-3 py-1 rounded-md border text-xs font-semibold flex items-center gap-1",
                                        activeTab === idx ? "bg-muted text-foreground" : "bg-transparent text-muted-foreground border-transparent hover:bg-muted/50",
                                        res.pass ? "hover:text-green-400" : "hover:text-red-400"
                                    )}
                                >
                                    {res.pass ? <Check className="w-3 h-3 text-green-500" /> : <X className="w-3 h-3 text-red-500" />}
                                    Case {idx + 1}
                                </button>
                            ))}
                        </div>
                        
                        {results.evalResults[activeTab] && (
                            <div className="flex flex-col gap-3">
                                {results.evalResults[activeTab].pass ? (
                                    <div className="text-green-500 font-bold text-lg">Accepted</div>
                                ) : (
                                    <div className="text-red-500 font-bold text-lg">Wrong Answer</div>
                                )}
                                <div>
                                    <div className="text-muted-foreground mb-1">Input:</div>
                                    <div className="bg-black/40 p-2 rounded text-foreground">
                                        nums = {JSON.stringify(results.evalResults[activeTab].input)}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-muted-foreground mb-1">Output:</div>
                                    <div className="bg-black/40 p-2 rounded text-foreground">
                                        {JSON.stringify(results.evalResults[activeTab].output)}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-muted-foreground mb-1">Expected:</div>
                                    <div className="bg-black/40 p-2 rounded text-foreground">
                                        {JSON.stringify(results.evalResults[activeTab].expected)}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Card>
    );
}
