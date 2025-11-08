"use client";

import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Task } from "@/types";
import { useAppStore } from "@/store/useAppStore";
import { TaskListHeader, TaskListEmpty, TaskCard } from "./task-list-item";

interface TaskListProps {
    /** Array of tasks to display */
    tasks: Task[];
    /** Currently selected task ID */
    selectedTaskId?: number | null;
    /** Callback when a task is selected */
    onTaskSelect: (taskId: number) => void;
    /** Callback when a task is updated */
    onTaskUpdate?: (taskId: number, updates: Partial<Task>) => void;
}

export function TaskList({
    tasks,
    selectedTaskId,
    onTaskSelect,
    onTaskUpdate,
}: TaskListProps) {
    const getTaskNumber = useAppStore((state) => state.getTaskNumber);
    const hasChildren = useAppStore((state) => state.hasChildren);
    const [expandedGroups, setExpandedGroups] = useState<Set<number>>(
        new Set(),
    );

    const toggleGroup = (taskId: number, e: React.MouseEvent) => {
        e.stopPropagation();
        setExpandedGroups((prev) => {
            const next = new Set(prev);
            if (next.has(taskId)) {
                next.delete(taskId);
            } else {
                next.add(taskId);
            }
            return next;
        });
    };

    // Filter tasks to only show top-level tasks and children of expanded groups
    const visibleTasks = tasks.filter((task) => {
        // Always show top-level tasks
        if (!task.parent) return true;

        // Show child tasks only if parent is expanded
        return expandedGroups.has(task.parent);
    });

    return (
        <div className="flex flex-col h-full">
            <TaskListHeader taskCount={tasks.length} />

            <ScrollArea className="flex-1 h-0">
                <div className="p-2.5 space-y-2">
                    {visibleTasks.length === 0 && tasks.length === 0 ? (
                        <TaskListEmpty />
                    ) : (
                        visibleTasks.map((task) => {
                            const taskHasChildren = hasChildren(task.id);
                            const isExpanded = expandedGroups.has(task.id);

                            return (
                                <div key={task.id} className="relative">
                                    <TaskCard
                                        task={task}
                                        taskNumber={getTaskNumber(task.id)}
                                        hasChildren={taskHasChildren}
                                        isExpanded={isExpanded}
                                        isSelected={selectedTaskId === task.id}
                                        onToggle={(e) =>
                                            toggleGroup(task.id, e)
                                        }
                                        onSelect={() => onTaskSelect(task.id)}
                                    />
                                </div>
                            );
                        })
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}
