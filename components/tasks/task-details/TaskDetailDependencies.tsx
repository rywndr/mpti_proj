import { Link as LinkIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Task } from "@/types";

interface TaskDetailDependenciesProps {
    task: Task;
    getTask: (id: number) => Task | undefined;
    getTaskNumber: (taskId: number) => string;
}

export function TaskDetailDependencies({
    task,
    getTask,
    getTaskNumber,
}: TaskDetailDependenciesProps) {
    if (!task.links || task.links.length === 0) return null;

    const getLinkTypeLabel = (type: string) => {
        switch (type) {
            case "FS":
                return "Finish-Start";
            case "FF":
                return "Finish-Finish";
            case "SS":
                return "Start-Start";
            case "SF":
                return "Start-Finish";
            default:
                return type;
        }
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <LinkIcon className="w-4 h-4" />
                <span className="font-medium">
                    Dependencies ({task.links.length})
                </span>
            </div>
            <div className="ml-6 space-y-2">
                {task.links.map((link, index) => {
                    const dependentTask = getTask(link.target);
                    const linkTypeLabel = getLinkTypeLabel(link.type);
                    return (
                        <div
                            key={index}
                            className="flex items-center justify-between text-sm p-3 rounded-md bg-muted/50 border"
                        >
                            <div className="flex-1">
                                <p className="font-medium">
                                    {getTaskNumber(link.target)}{" "}
                                    {dependentTask?.text}
                                </p>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    {linkTypeLabel}
                                </p>
                            </div>
                            <Badge
                                variant="secondary"
                                className="text-xs font-mono"
                            >
                                {link.type}
                            </Badge>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
