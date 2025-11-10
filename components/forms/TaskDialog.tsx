"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { TaskForm } from "./TaskForm";
import { useCreateTask, useUpdateTask, useTasks } from "@/hooks/useTasks";
import type { Task } from "@/types";
import type { TaskFormData } from "@/lib/validations";

interface TaskDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    task?: Task;
    parentId?: number;
    projectId: string;
    onSuccess?: (task: Task) => void;
}

export function TaskDialog({
    open,
    onOpenChange,
    task,
    parentId,
    projectId,
    onSuccess,
}: TaskDialogProps) {
    const createTask = useCreateTask();
    const updateTask = useUpdateTask();
    const { data: tasks = [] } = useTasks(projectId);

    const handleSubmit = async (data: TaskFormData) => {
        try {
            // update status based on progress
            let autoStatus = data.status;
            if (data.percent === 1) {
                autoStatus = "completed";
            } else if (data.percent > 0 && data.percent < 1) {
                autoStatus = "in-progress";
            } else if (data.percent === 0 && data.status === "completed") {
                autoStatus = "pending";
            }

            if (task) {
                // Update existing task
                const updatedTask = await updateTask.mutateAsync({
                    id: task.id,
                    projectId,
                    data: {
                        text: data.text,
                        description: data.description,
                        start: data.start,
                        end: data.end,
                        status: autoStatus,
                        priority: data.priority,
                        assignee: data.assignee,
                        parent: data.parent,
                        type: data.type,
                        cost: data.type === "milestone" ? 0 : data.cost,
                        percent: data.percent,
                        links: data.links || [],
                    },
                });
                onSuccess?.(updatedTask);
            } else {
                // Create new task
                const newTask = await createTask.mutateAsync({
                    projectId,
                    data: {
                        text: data.text,
                        description: data.description,
                        start: data.start,
                        end: data.end,
                        percent: data.percent,
                        links: data.links || [],
                        status: autoStatus,
                        priority: data.priority,
                        assignee: data.assignee,
                        parent: data.parent,
                        type: data.type,
                        cost: data.type === "milestone" ? 0 : data.cost,
                    },
                });
                onSuccess?.(newTask);
            }
            onOpenChange(false);
        } catch (error) {
            console.error("Task operation failed:", error);
        }
    };

    const handleCancel = () => {
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {task ? "Edit Task" : "Create New Task"}
                    </DialogTitle>
                    <DialogDescription>
                        {task
                            ? "Update the task details below."
                            : "Fill in the details to create a new task."}
                    </DialogDescription>
                </DialogHeader>
                <TaskForm
                    task={task}
                    parentId={parentId}
                    tasks={tasks}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                    isSubmitting={createTask.isPending || updateTask.isPending}
                />
            </DialogContent>
        </Dialog>
    );
}
