"use client";

import React, { useRef } from 'react';
import Editor from '@monaco-editor/react';

interface EditorPanelProps {
    initialCode: string;
    language?: string;
    onChange: (code: string | undefined) => void;
}

export default function EditorPanel({ initialCode, language = 'javascript', onChange }: EditorPanelProps) {
    const editorRef = useRef<any>(null);

    return (
        <div style={{ height: '100%', width: '100%' }}>
            <Editor
                height="100%"
                width="100%"
                theme="vs-dark"
                language={language}
                defaultValue={initialCode}
                path={`main.${language === 'javascript' ? 'js' : language === 'python' ? 'py' : language}`}
                onMount={(editor) => { editorRef.current = editor; }}
                onChange={onChange}
                options={{
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    fontSize: 14,
                    lineHeight: 22,
                    fontFamily: '"Fira Code", "Consolas", "Courier New", monospace',
                    padding: { top: 12 },
                    automaticLayout: true,
                }}
            />
        </div>
    );
}
