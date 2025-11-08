import { TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { getProgressPercentage } from "@/lib/taskHelpers";
import type { Task } from "@/types";

interface TaskDetailProgressProps {
    task: Task;
}

export function TaskDetailProgress({ task }: TaskDetailProgressProps) {
    const progressPercent = getProgressPercentage(task.percent);

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <TrendingUp className="w-4 h-4" />
                <span className="font-medium">Progress</span>
            </div>
            <div className="ml-6 space-y-2">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Completion</span>
                    <span className="font-semibold text-lg">
                        {progressPercent}%
                    </span>
                </div>
                <Progress value={progressPercent} className="h-3" />
            </div>
        </div>
    );
}
