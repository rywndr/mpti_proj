"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Task } from "@/types";
import { TaskCardHeader } from "./TaskCardHeader";
import { TaskCardMetadata } from "./TaskCardMetadata";

interface TaskCardProps {
    task: Task;
    taskNumber: string;
    hasChildren: boolean;
    isExpanded: boolean;
    isSelected: boolean;
    onToggle: (e: React.MouseEvent) => void;
    onSelect: () => void;
}

export function TaskCard({
    task,
    taskNumber,
    hasChildren,
    isExpanded,
    isSelected,
    onToggle,
    onSelect,
}: TaskCardProps) {
    return (
        <Card
            className={cn(
                "cursor-pointer transition-all hover:shadow-sm relative",
                isSelected && "ring-1 ring-primary",
            )}
            onClick={onSelect}
        >
            <CardHeader className="pb-1.5 pt-2.5 px-3">
                <TaskCardHeader
                    task={task}
                    taskNumber={taskNumber}
                    hasChildren={hasChildren}
                    isExpanded={isExpanded}
                    onToggle={onToggle}
                />
            </CardHeader>

            <CardContent className="pb-2 pt-0 px-3">
                <TaskCardMetadata task={task} />
            </CardContent>
        </Card>
    );
}
