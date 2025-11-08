"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CardTitle } from "@/components/ui/card";
import { ChevronRight, ChevronDown, Flag } from "lucide-react";
import { cn } from "@/lib/utils";
import { getStatusIcon } from "@/lib/taskHelpers";
import type { Task } from "@/types";

interface TaskCardHeaderProps {
    task: Task;
    taskNumber: string;
    hasChildren: boolean;
    isExpanded: boolean;
    onToggle: (e: React.MouseEvent) => void;
}

export function TaskCardHeader({
    task,
    taskNumber,
    hasChildren,
    isExpanded,
    onToggle,
}: TaskCardHeaderProps) {
    return (
        <div className="flex items-center gap-2 min-w-0">
            {/* Expand/Collapse Button for Groups with Children */}
            {task.type === "group" && hasChildren && (
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 shrink-0"
                    onClick={onToggle}
                >
                    {isExpanded ? (
                        <ChevronDown className="h-4 w-4" />
                    ) : (
                        <ChevronRight className="h-4 w-4" />
                    )}
                </Button>
            )}

            {/* Task Type Icon */}
            <div className="shrink-0">
                {task.type === "milestone" && (
                    <Flag className="w-4 h-4 text-purple-600 fill-purple-200" />
                )}
                {task.type !== "milestone" &&
                    task.type !== "group" &&
                    getStatusIcon(task.status)}
                {task.type === "group" &&
                    !hasChildren &&
                    getStatusIcon(task.status)}
            </div>

            {/* Task Number Badge */}
            <Badge
                variant="outline"
                className={cn(
                    "h-5 px-1.5 text-xs font-mono shrink-0",
                    task.type === "group" &&
                        "bg-blue-50 border-blue-300 text-blue-700",
                    task.type === "milestone" &&
                        "bg-purple-100 border-purple-400 text-purple-700",
                )}
            >
                {taskNumber}
            </Badge>

            {/* Task Title */}
            <CardTitle
                className={cn(
                    "text-sm leading-tight truncate min-w-0 flex-1",
                    task.type === "group" && "font-semibold text-blue-700",
                    task.type === "milestone" &&
                        "font-semibold text-purple-700",
                )}
            >
                {task.text}
            </CardTitle>
        </div>
    );
}
