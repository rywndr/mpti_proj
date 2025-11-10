"use client";

import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Task } from "@/types";
import { getTaskNumber, hasChildren } from "@/lib/taskUtils";
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

    const visibleTasks: Task[] = [];

    const addTaskAndChildren = (task: Task, depth: number = 0) => {
        visibleTasks.push(task);

        // If this task is expanded and has children, add them
        if (expandedGroups.has(task.id)) {
            const children = tasks.filter((t) => t.parent === task.id);
            children.forEach((child) => addTaskAndChildren(child, depth + 1));
        }
    };

    // Start with top-level tasks only
    const topLevelTasks = tasks.filter((t) => !t.parent);
    topLevelTasks.forEach((task) => addTaskAndChildren(task));

    return (
        <div className="flex flex-col h-full">
            <TaskListHeader taskCount={tasks.length} />

            <ScrollArea className="flex-1 h-0">
                <div className="p-2.5 space-y-2">
                    {visibleTasks.length === 0 && tasks.length === 0 ? (
                        <TaskListEmpty />
                    ) : (
                        visibleTasks.map((task) => {
                            const taskHasChildren = hasChildren(task.id, tasks);
                            const isExpanded = expandedGroups.has(task.id);

                            return (
                                <div key={task.id} className="relative">
                                    <TaskCard
                                        task={task}
                                        taskNumber={getTaskNumber(
                                            task.id,
                                            tasks,
                                        )}
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
