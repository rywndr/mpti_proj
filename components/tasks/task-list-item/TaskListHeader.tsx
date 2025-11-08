interface TaskListHeaderProps {
    taskCount: number;
}

export function TaskListHeader({ taskCount }: TaskListHeaderProps) {
    return (
        <div className="px-3 py-2 border-b bg-background shrink-0">
            <h2 className="text-sm font-semibold tracking-tight">Tasks</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
                {taskCount} {taskCount === 1 ? "task" : "tasks"}
            </p>
        </div>
    );
}
