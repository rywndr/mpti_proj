"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Calendar,
    User,
    Clock,
    TrendingUp,
    Link as LinkIcon,
    Edit,
    Trash2,
} from "lucide-react";
import type { Task } from "@/types";
import {
    getStatusIcon,
    getPriorityVariant,
    getStatusLabel,
    getPriorityLabel,
    getProgressPercentage,
    isTaskOverdue,
} from "@/lib/taskHelpers";
import { formatDate, daysBetween, formatCurrency } from "@/lib/formatters";

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
    if (!task) return null;

    const duration = daysBetween(task.start, task.end);
    const isOverdue = isTaskOverdue(task.end, task.status);
    const progressPercent = getProgressPercentage(task.percent);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <div className="flex items-start gap-3">
                        <Badge
                            variant="outline"
                            className="h-7 px-2.5 text-sm font-mono shrink-0 mt-0.5"
                        >
                            #{task.id}
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

                <div className="space-y-5 mt-3">
                    {/* Badges */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                        {task.status && (
                            <Badge variant="outline" className="text-sm">
                                {getStatusLabel(task.status)}
                            </Badge>
                        )}
                        {task.priority && (
                            <Badge
                                variant={getPriorityVariant(task.priority)}
                                className="text-sm"
                            >
                                {getPriorityLabel(task.priority)} Priority
                            </Badge>
                        )}
                        {task.type === "group" && (
                            <Badge variant="secondary" className="text-sm">
                                Group
                            </Badge>
                        )}
                        {isOverdue && (
                            <Badge variant="destructive" className="text-sm">
                                Overdue
                            </Badge>
                        )}
                    </div>

                    {/* Task Details Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Start Date */}
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="w-4 h-4" />
                                <span className="font-medium">Start Date</span>
                            </div>
                            <p className="text-sm ml-6">
                                {formatDate(task.start)}
                            </p>
                        </div>

                        {/* End Date */}
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="w-4 h-4" />
                                <span className="font-medium">End Date</span>
                            </div>
                            <p className="text-sm ml-6">
                                {formatDate(task.end)}
                            </p>
                        </div>

                        {/* Duration */}
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Clock className="w-4 h-4" />
                                <span className="font-medium">Duration</span>
                            </div>
                            <p className="text-sm ml-6">
                                {duration} {duration === 1 ? "day" : "days"}
                            </p>
                        </div>

                        {/* Assignee */}
                        {task.assignee && (
                            <div className="space-y-1.5">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <User className="w-4 h-4" />
                                    <span className="font-medium">
                                        Assignee
                                    </span>
                                </div>
                                <p className="text-sm ml-6">{task.assignee}</p>
                            </div>
                        )}

                        {/* Task ID */}
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span className="font-medium">Task ID</span>
                            </div>
                            <p className="text-sm font-mono text-muted-foreground">
                                #{task.id}
                            </p>
                        </div>

                        {/* Parent Task */}
                        {task.parent && (
                            <div className="space-y-1.5">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <span className="font-medium">
                                        Parent Task
                                    </span>
                                </div>
                                <p className="text-sm font-mono text-muted-foreground">
                                    #{task.parent}
                                </p>
                            </div>
                        )}

                        {/* Cost */}
                        {task.cost !== undefined && task.cost > 0 && (
                            <div className="space-y-1.5">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <span className="font-medium">Cost</span>
                                </div>
                                <p className="text-lg font-semibold text-green-700">
                                    {formatCurrency(task.cost)}
                                    {task.type === "group" && (
                                        <span className="text-xs font-normal text-muted-foreground ml-1">
                                            (calculated)
                                        </span>
                                    )}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Progress Section */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <TrendingUp className="w-4 h-4" />
                            <span className="font-medium">Progress</span>
                        </div>
                        <div className="ml-6 space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">
                                    Completion
                                </span>
                                <span className="font-semibold text-lg">
                                    {progressPercent}%
                                </span>
                            </div>
                            <div className="h-3 bg-secondary rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary transition-all duration-300"
                                    style={{ width: `${progressPercent}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Dependencies */}
                    {task.links && task.links.length > 0 && (
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <LinkIcon className="w-4 h-4" />
                                <span className="font-medium">
                                    Dependencies
                                </span>
                            </div>
                            <div className="ml-6 space-y-2">
                                {task.links.map((link, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between text-sm p-2 rounded-md bg-muted"
                                    >
                                        <span>Task #{link.target}</span>
                                        <Badge
                                            variant="outline"
                                            className="text-xs"
                                        >
                                            {link.type}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end gap-2 pt-4 border-t">
                        {onDelete && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    onDelete(task);
                                    onOpenChange(false);
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
                                    onOpenChange(false);
                                }}
                            >
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Task
                            </Button>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
