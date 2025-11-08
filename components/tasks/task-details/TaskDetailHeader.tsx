import {
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { getStatusIcon } from "@/lib/taskHelpers";
import type { Task } from "@/types";

interface TaskDetailHeaderProps {
    task: Task;
    taskNumber: string;
}

export function TaskDetailHeader({ task, taskNumber }: TaskDetailHeaderProps) {
    return (
        <DialogHeader>
            <div className="flex items-start gap-3">
                <Badge
                    variant="outline"
                    className="h-7 px-2.5 text-sm font-mono shrink-0 mt-0.5"
                >
                    {taskNumber}
                </Badge>
                <div className="flex-1 min-w-0">
                    <DialogTitle className="text-lg flex items-center gap-2">
                        {getStatusIcon(task.status)}
                        <span className="truncate">{task.text}</span>
                    </DialogTitle>
                    {task.description && (
                        <DialogDescription className="mt-1.5 text-sm">
                            {task.description}
                        </DialogDescription>
                    )}
                </div>
            </div>
        </DialogHeader>
    );
}
