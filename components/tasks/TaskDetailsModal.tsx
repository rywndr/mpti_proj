"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { Task } from "@/types";
import { useAppStore } from "@/store/useAppStore";
import { isTaskOverdue } from "@/lib/taskHelpers";
import {
    TaskDetailHeader,
    TaskDetailBadges,
    TaskDetailInfo,
    TaskDetailProgress,
    TaskDetailDependencies,
    TaskDetailActions,
} from "./task-details";

interface TaskDetailsModalProps {
    /** Whether the modal is open */
    open: boolean;
    /** Callback when modal should close */
    onOpenChange: (open: boolean) => void;
    /** The task to display */
    task: Task | null;
    /** Callback when edit button is clicked */
    onEdit?: (task: Task) => void;
    /** Callback when delete button is clicked */
    onDelete?: (task: Task) => void;
}

export function TaskDetailsModal({
    open,
    onOpenChange,
    task,
    onEdit,
    onDelete,
}: TaskDetailsModalProps) {
    const getTaskNumber = useAppStore((state) => state.getTaskNumber);
    const getTask = useAppStore((state) => state.getTask);

    if (!task) return null;

    const isOverdue = isTaskOverdue(task.end, task.status);
    const taskNumber = getTaskNumber(task.id);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <TaskDetailHeader task={task} taskNumber={taskNumber} />

                <div className="space-y-5 mt-3">
                    <TaskDetailBadges task={task} isOverdue={isOverdue} />

                    <TaskDetailInfo
                        task={task}
                        taskNumber={taskNumber}
                        getTaskNumber={getTaskNumber}
                    />

                    <TaskDetailProgress task={task} />

                    <TaskDetailDependencies
                        task={task}
                        getTask={getTask}
                        getTaskNumber={getTaskNumber}
                    />

                    <TaskDetailActions
                        task={task}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onClose={() => onOpenChange(false)}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}
