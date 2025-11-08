"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { TaskForm } from "./TaskForm";
import { useAppStore } from "@/store/useAppStore";
import type { Task } from "@/types";
import type { TaskFormData } from "@/lib/validations";
import { toast } from "sonner";

interface TaskDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    task?: Task;
    parentId?: number;
    onSuccess?: (task: Task) => void;
}

export function TaskDialog({
    open,
    onOpenChange,
    task,
    parentId,
    onSuccess,
}: TaskDialogProps) {
    const addTask = useAppStore((state) => state.addTask);
    const updateTask = useAppStore((state) => state.updateTask);
    const currentProjectId = useAppStore((state) => state.currentProjectId);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (data: TaskFormData) => {
        if (!currentProjectId && !task) {
            toast.error("No project selected. Please select a project first.");
            return;
        }

        setIsSubmitting(true);
        try {
            // Auto-update status based on progress
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
                updateTask(task.id, {
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
                });
                toast.success("Task updated successfully");
                onSuccess?.(task);
            } else {
                // Create new task
                const newTask = addTask(currentProjectId!, {
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
                });
                toast.success("Task created successfully");
                onSuccess?.(newTask);
            }
            onOpenChange(false);
        } catch (error) {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
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
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                    isSubmitting={isSubmitting}
                />
            </DialogContent>
        </Dialog>
    );
}
