import { Calendar, User, Clock } from "lucide-react";
import { formatDate, daysBetween, formatCurrency } from "@/lib/formatters";
import type { Task } from "@/types";

interface TaskDetailInfoProps {
    task: Task;
    taskNumber: string;
    getTaskNumber: (taskId: number) => string;
}

export function TaskDetailInfo({
    task,
    taskNumber,
    getTaskNumber,
}: TaskDetailInfoProps) {
    const duration = daysBetween(task.start, task.end);

    return (
        <div className="grid grid-cols-2 gap-4">
            {/* Start Date */}
            <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span className="font-medium">Start Date</span>
                </div>
                <p className="text-sm ml-6">{formatDate(task.start)}</p>
            </div>

            {/* End Date */}
            <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span className="font-medium">End Date</span>
                </div>
                <p className="text-sm ml-6">{formatDate(task.end)}</p>
            </div>

            {/* Duration */}
            <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span className="font-medium">Duration</span>
                </div>
                <p className="text-sm ml-6">
                    {duration} {duration === 1 ? "day" : "days"}
                </p>
            </div>

            {/* Assignee */}
            {task.assignee && (
                <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <User className="w-4 h-4" />
                        <span className="font-medium">Assignee</span>
                    </div>
                    <p className="text-sm ml-6">{task.assignee}</p>
                </div>
            )}

            {/* Task Number */}
            <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="font-medium">Task Number</span>
                </div>
                <p className="text-sm font-mono text-muted-foreground">
                    {taskNumber}
                </p>
            </div>

            {/* Parent Task */}
            {task.parent && (
                <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="font-medium">Parent Task</span>
                    </div>
                    <p className="text-sm font-mono text-muted-foreground">
                        {getTaskNumber(task.parent)}
                    </p>
                </div>
            )}

            {/* Cost */}
            {task.cost !== undefined && task.cost > 0 && (
                <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="font-medium">Cost</span>
                    </div>
                    <p className="text-lg font-semibold text-green-700">
                        {formatCurrency(task.cost)}
                        {task.type === "group" && (
                            <span className="text-xs font-normal text-muted-foreground ml-1">
                                (calculated)
                            </span>
                        )}
                    </p>
                </div>
            )}
        </div>
    );
}
