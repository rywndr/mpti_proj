"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { Task } from "@/types";
import { isTaskOverdue } from "@/lib/taskHelpers";
import { getTaskNumber } from "@/lib/taskUtils";
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
    /** All tasks for calculating task numbers */
    tasks: Task[];
    /** Callback when edit button is clicked */
    onEdit?: (task: Task) => void;
    /** Callback when delete button is clicked */
    onDelete?: (task: Task) => void;
}

export function TaskDetailsModal({
    open,
    onOpenChange,
    task,
    tasks,
    onEdit,
    onDelete,
}: TaskDetailsModalProps) {
    if (!task) return null;

    const isOverdue = isTaskOverdue(task.end, task.status);
    const taskNumber = getTaskNumber(task.id, tasks);

    const getTask = (id: number) => tasks.find((t) => t.id === id);
    const getTaskNumberHelper = (id: number) => getTaskNumber(id, tasks);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <TaskDetailHeader task={task} taskNumber={taskNumber} />

                <div className="space-y-5 mt-3">
                    <TaskDetailBadges task={task} isOverdue={isOverdue} />

                    <TaskDetailInfo
                        task={task}
                        taskNumber={taskNumber}
                        getTaskNumber={getTaskNumberHelper}
                    />

                    <TaskDetailProgress task={task} />

                    <TaskDetailDependencies
                        task={task}
                        getTask={getTask}
                        getTaskNumber={getTaskNumberHelper}
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
