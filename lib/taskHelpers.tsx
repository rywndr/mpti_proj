import { CheckCircle2, Clock, Circle, AlertCircle } from "lucide-react";
import type { TaskStatus, TaskPriority, Task } from "@/types";

export function getStatusIcon(status?: TaskStatus) {
    switch (status) {
        case "completed":
            return <CheckCircle2 className="w-4 h-4 text-green-600" />;
        case "in-progress":
            return <Clock className="w-4 h-4 text-blue-600" />;
        case "blocked":
            return <AlertCircle className="w-4 h-4 text-red-600" />;
        case "pending":
        default:
            return <Circle className="w-4 h-4 text-gray-400" />;
    }
}

export function getPriorityVariant(
    priority?: TaskPriority,
): "default" | "secondary" | "destructive" | "outline" {
    switch (priority) {
        case "critical":
            return "destructive";
        case "high":
            return "default";
        case "medium":
            return "secondary";
        case "low":
        default:
            return "outline";
    }
}

export function getStatusColor(status?: TaskStatus): string {
    switch (status) {
        case "completed":
            return "text-green-600 bg-green-50 border-green-200";
        case "in-progress":
            return "text-blue-600 bg-blue-50 border-blue-200";
        case "blocked":
            return "text-red-600 bg-red-50 border-red-200";
        case "pending":
        default:
            return "text-gray-600 bg-gray-50 border-gray-200";
    }
}

export function getPriorityColor(priority?: TaskPriority): string {
    switch (priority) {
        case "critical":
            return "text-red-700 bg-red-100 border-red-300";
        case "high":
            return "text-orange-700 bg-orange-100 border-orange-300";
        case "medium":
            return "text-yellow-700 bg-yellow-100 border-yellow-300";
        case "low":
        default:
            return "text-gray-600 bg-gray-100 border-gray-300";
    }
}

export function getProgressPercentage(percent: number): number {
    return Math.round(percent * 100);
}

export function isTaskOverdue(endDate: Date, status?: TaskStatus): boolean {
    if (status === "completed") return false;
    return endDate < new Date();
}

export function getStatusLabel(status?: TaskStatus): string {
    switch (status) {
        case "in-progress":
            return "In Progress";
        case "completed":
            return "Completed";
        case "blocked":
            return "Blocked";
        case "pending":
        default:
            return "Pending";
    }
}

export function getPriorityLabel(priority?: TaskPriority): string {
    switch (priority) {
        case "critical":
            return "Critical";
        case "high":
            return "High";
        case "medium":
            return "Medium";
        case "low":
        default:
            return "Low";
    }
}

export function getStatusBadgeVariant(
    status?: string,
): "default" | "secondary" | "destructive" | "outline" {
    switch (status) {
        case "in-progress":
            return "default";
        case "planning":
        case "pending":
            return "secondary";
        case "completed":
            return "outline";
        case "blocked":
            return "destructive";
        default:
            return "secondary";
    }
}

export function getTaskDepth(task: Task, tasks: Task[]): number {
    let depth = 0;
    let currentTask = task;

    while (currentTask.parent) {
        depth++;
        const parent = tasks.find((t) => t.id === currentTask.parent);
        if (!parent) break;
        currentTask = parent;
    }

    return depth;
}

export function getTaskNumber(taskId: number, tasks: Task[]): string {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return "";

    // If task has no parent, it's a top-level task
    if (!task.parent) {
        const topLevelTasks = tasks.filter((t) => !t.parent);
        const index = topLevelTasks.findIndex((t) => t.id === taskId);
        return (index + 1).toString();
    }

    // Task has a parent - get parent's number and add child index
    const parentNumber = getTaskNumber(task.parent, tasks);
    const siblings = tasks.filter((t) => t.parent === task.parent);
    const childIndex = siblings.findIndex((t) => t.id === taskId);
    return `${parentNumber}.${childIndex + 1}`;
}
