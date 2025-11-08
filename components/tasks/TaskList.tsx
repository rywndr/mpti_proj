"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, Pause, Flag } from "lucide-react";
import type { Task } from "@/types";
import { cn } from "@/lib/utils";
import {
    getStatusIcon,
    getPriorityVariant,
    getPriorityLabel,
    getStatusLabel,
    getProgressPercentage,
} from "@/lib/taskHelpers";
import { formatDate, formatCurrency } from "@/lib/formatters";

interface TaskListProps {
    /** Array of tasks to display */
    tasks: Task[];
    /** Currently selected task ID */
    selectedTaskId?: number | null;
    /** Callback when a task is selected */
    onTaskSelect: (taskId: number) => void;
}

export function TaskList({
    tasks,
    selectedTaskId,
    onTaskSelect,
}: TaskListProps) {
    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="px-3 py-2 border-b bg-background shrink-0">
                <h2 className="text-sm font-semibold tracking-tight">Tasks</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                    {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
                </p>
            </div>

            {/* Task List */}
            <ScrollArea className="flex-1 h-0">
                <div className="p-2.5 space-y-2">
                    {tasks.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <Pause className="w-12 h-12 text-muted-foreground/50 mb-3" />
                            <p className="text-sm text-muted-foreground">
                                No tasks yet
                            </p>
                            <p className="text-xs text-muted-foreground/75 mt-1">
                                Click &ldquo;Add Task&rdquo; to get started
                            </p>
                        </div>
                    ) : (
                        tasks.map((task) => (
                            <div key={task.id} className="relative">
                                {task.parent && (
                                    <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-linear-to-b from-primary/40 via-primary/20 to-transparent rounded-full" />
                                )}
                                <Card
                                    className={cn(
                                        "cursor-pointer transition-all hover:shadow-sm relative",
                                        selectedTaskId === task.id &&
                                            "ring-1 ring-primary",
                                        task.parent && "ml-6",
                                    )}
                                    onClick={() => onTaskSelect(task.id)}
                                >
                                    <CardHeader className="pb-1.5 pt-2.5 px-3">
                                        <div className="flex items-center gap-2">
                                            {task.parent && (
                                                <div className="flex items-center">
                                                    <div className="w-3 h-px bg-linear-to-r from-primary/50 to-transparent rounded-full" />
                                                </div>
                                            )}
                                            {task.type === "milestone" && (
                                                <Flag className="w-4 h-4 text-purple-600 fill-purple-200" />
                                            )}
                                            {task.type !== "milestone" &&
                                                getStatusIcon(task.status)}
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
                                                #{task.id}
                                            </Badge>
                                            <CardTitle
                                                className={cn(
                                                    "text-sm leading-tight truncate",
                                                    task.type === "group" &&
                                                        "font-semibold text-blue-700",
                                                    task.type === "milestone" &&
                                                        "font-semibold text-purple-700",
                                                )}
                                            >
                                                {task.text}
                                            </CardTitle>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="pb-2 pt-0 px-3">
                                        {/* Task Metadata */}
                                        <div className="space-y-1">
                                            {/* Priority and Status Badges */}
                                            <div className="flex items-center gap-1 flex-wrap">
                                                {task.priority && (
                                                    <Badge
                                                        variant={getPriorityVariant(
                                                            task.priority,
                                                        )}
                                                        className="text-xs h-5 px-2"
                                                    >
                                                        {getPriorityLabel(
                                                            task.priority,
                                                        )}
                                                    </Badge>
                                                )}
                                                {task.status && (
                                                    <Badge
                                                        variant="outline"
                                                        className="text-xs h-5 px-2"
                                                    >
                                                        {getStatusLabel(
                                                            task.status,
                                                        )}
                                                    </Badge>
                                                )}
                                            </div>

                                            {/* Date Range and Assignee */}
                                            <div className="flex items-center gap-2.5 text-xs text-muted-foreground flex-wrap">
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar className="w-3 h-3" />
                                                    <span className="text-xs">
                                                        {formatDate(task.start)}{" "}
                                                        - {formatDate(task.end)}
                                                    </span>
                                                </div>
                                                {task.assignee && (
                                                    <div className="flex items-center gap-1.5">
                                                        <User className="w-3 h-3" />
                                                        <span className="text-xs">
                                                            {task.assignee}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Cost */}
                                            {task.cost !== undefined &&
                                                task.cost > 0 && (
                                                    <div className="flex items-center justify-between text-xs">
                                                        <span className="text-muted-foreground">
                                                            Cost
                                                        </span>
                                                        <span className="font-semibold text-green-700">
                                                            {formatCurrency(
                                                                task.cost,
                                                            )}
                                                        </span>
                                                    </div>
                                                )}

                                            {/* Progress Bar */}
                                            {task.type !== "milestone" && (
                                                <div className="space-y-1">
                                                    <div className="flex items-center justify-between text-xs">
                                                        <span className="text-muted-foreground">
                                                            Progress
                                                        </span>
                                                        <span className="font-medium">
                                                            {getProgressPercentage(
                                                                task.percent,
                                                            )}
                                                            %
                                                        </span>
                                                    </div>
                                                    <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-primary transition-all duration-300"
                                                            style={{
                                                                width: `${getProgressPercentage(task.percent)}%`,
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        ))
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}
