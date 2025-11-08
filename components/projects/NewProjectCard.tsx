"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";

interface NewProjectCardProps {
    onClick: () => void;
}

export function NewProjectCard({ onClick }: NewProjectCardProps) {
    return (
        <Card
            className="group cursor-pointer transition-all hover:shadow-md hover:border-primary/50 border-dashed"
            onClick={onClick}
        >
            <CardContent className="p-4 h-full flex flex-col items-center justify-center min-h-[140px]">
                <div className="w-12 h-12 rounded-lg bg-muted/50 flex items-center justify-center mb-3 group-hover:bg-primary/10 transition-colors">
                    <Plus className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <h3 className="font-semibold text-sm mb-1">
                    Create New Project
                </h3>
                <p className="text-xs text-muted-foreground text-center">
                    Start organizing your work
                </p>
            </CardContent>
        </Card>
    );
}
