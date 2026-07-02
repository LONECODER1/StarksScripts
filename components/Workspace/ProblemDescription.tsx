import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

interface ProblemDescriptionProps {
    problem: {
        title: string;
        description: string;
        difficlty: string;
        points: number;
        acceptanceRate: number;
    };
}

export default function ProblemDescription({ problem }: ProblemDescriptionProps) {
    const difficultyColor = 
        problem.difficlty === 'Easy' ? 'bg-green-500/20 text-green-400' :
        problem.difficlty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
        'bg-red-500/20 text-red-400';

    return (
        <Card className="h-full bg-card/30 backdrop-blur-md border border-border flex flex-col p-6 overflow-y-auto">
            <h1 className="text-2xl font-bold mb-4">{problem.title}</h1>
            <div className="flex flex-wrap gap-2 mb-6">
                <Badge variant="outline" className={difficultyColor + " border-none"}>
                    {problem.difficlty}
                </Badge>
                <Badge variant="outline" className="bg-primary/20 text-primary border-none">
                    {problem.points} Points
                </Badge>
                <Badge variant="outline" className="bg-muted text-muted-foreground border-none">
                    Acceptance: {problem.acceptanceRate}%
                </Badge>
            </div>
            <div 
                className="prose prose-invert max-w-none text-foreground/80 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: problem.description }}
            />
        </Card>
    );
}
