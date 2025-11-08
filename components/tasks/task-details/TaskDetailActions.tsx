"use client";

import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import type { Task } from "@/types";

interface TaskDetailActionsProps {
    task: Task;
    onEdit?: (task: Task) => void;
    onDelete?: (task: Task) => void;
    onClose: () => void;
}

export function TaskDetailActions({
    task,
    onEdit,
    onDelete,
    onClose,
}: TaskDetailActionsProps) {
    if (!onEdit && !onDelete) return null;

    return (
        <div className="flex items-center justify-end gap-2 pt-4 border-t">
            {onDelete && (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                        onDelete(task);
                        onClose();
                    }}
                    className="text-destructive hover:text-destructive"
                >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                </Button>
            )}
            {onEdit && (
                <Button
                    variant="default"
                    size="sm"
                    onClick={() => {
                        onEdit(task);
                        onClose();
                    }}
                >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Task
                </Button>
            )}
        </div>
    );
}
