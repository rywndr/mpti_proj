import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
    getStatusColor,
    getStatusLabel,
    getPriorityColor,
    getPriorityLabel,
} from "@/lib/taskHelpers";
import type { Task } from "@/types";

interface TaskDetailBadgesProps {
    task: Task;
    isOverdue: boolean;
}

export function TaskDetailBadges({ task, isOverdue }: TaskDetailBadgesProps) {
    return (
        <div className="flex items-center gap-1.5 flex-wrap">
            {task.status && (
                <Badge
                    variant="outline"
                    className={cn("text-sm", getStatusColor(task.status))}
                >
                    {getStatusLabel(task.status)}
                </Badge>
            )}
            {task.priority && (
                <Badge
                    variant="outline"
                    className={cn("text-sm", getPriorityColor(task.priority))}
                >
                    {getPriorityLabel(task.priority)} Priority
                </Badge>
            )}
            {task.type === "group" && (
                <Badge variant="secondary" className="text-sm">
                    Group
                </Badge>
            )}
            {isOverdue && (
                <Badge variant="destructive" className="text-sm">
                    Overdue
                </Badge>
            )}
        </div>
    );
}
