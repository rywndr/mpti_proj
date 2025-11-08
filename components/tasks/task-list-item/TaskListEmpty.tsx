import { Pause } from "lucide-react";

export function TaskListEmpty() {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
            <Pause className="w-12 h-12 text-muted-foreground/50 mb-3" />
            <p className="text-sm text-muted-foreground">No tasks yet</p>
            <p className="text-xs text-muted-foreground/75 mt-1">
                Click &ldquo;Add Task&rdquo; to get started
            </p>
        </div>
    );
}
