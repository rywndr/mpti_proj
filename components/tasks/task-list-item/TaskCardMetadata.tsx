import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, User } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    getPriorityColor,
    getStatusColor,
    getPriorityLabel,
    getStatusLabel,
    getProgressPercentage,
} from "@/lib/taskHelpers";
import { formatDate, formatCurrency } from "@/lib/formatters";
import type { Task } from "@/types";

interface TaskCardMetadataProps {
    task: Task;
}

export function TaskCardMetadata({ task }: TaskCardMetadataProps) {
    const progressPercent = getProgressPercentage(task.percent);

    return (
        <div className="space-y-1">
            {/* Priority and Status Badges */}
            <div className="flex items-center gap-1 flex-wrap">
                {task.priority && (
                    <Badge
                        variant="outline"
                        className={cn(
                            "text-xs h-5 px-2",
                            getPriorityColor(task.priority),
                        )}
                    >
                        {getPriorityLabel(task.priority)}
                    </Badge>
                )}
                {task.status && (
                    <Badge
                        variant="outline"
                        className={cn(
                            "text-xs h-5 px-2",
                            getStatusColor(task.status),
                        )}
                    >
                        {getStatusLabel(task.status)}
                    </Badge>
                )}
            </div>

            {/* Date Range and Assignee */}
            <div className="flex items-center gap-2.5 text-xs text-muted-foreground flex-wrap">
                <div className="flex items-center gap-1.5">
                    <Calendar className="w-3 h-3" />
                    <span className="text-xs">
                        {formatDate(task.start)} - {formatDate(task.end)}
                    </span>
                </div>
                {task.assignee && (
                    <div className="flex items-center gap-1.5">
                        <User className="w-3 h-3" />
                        <span className="text-xs">{task.assignee}</span>
                    </div>
                )}
            </div>

            {/* Cost */}
            {task.cost !== undefined && task.cost > 0 && (
                <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Cost</span>
                    <span className="font-semibold text-green-700">
                        {formatCurrency(task.cost)}
                    </span>
                </div>
            )}

            {/* Progress Bar */}
            {task.type !== "milestone" && (
                <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{progressPercent}%</span>
                    </div>
                    <Progress value={progressPercent} className="h-1.5" />
                </div>
            )}
        </div>
    );
}
