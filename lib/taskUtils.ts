import type { Task } from "@/types";

export function getTaskNumber(taskId: number, tasks: Task[]): string {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return "";

    // If task has no parent, it's a top-level task
    if (!task.parent) {
        const topLevelTasks = tasks.filter((t) => !t.parent);
        const index = topLevelTasks.findIndex((t) => t.id === taskId);
        return (index + 1).toString();
    }

    // if a parent then get parent's number and add child index
    const parentNumber = getTaskNumber(task.parent, tasks);
    const siblings = tasks.filter((t) => t.parent === task.parent);
    const childIndex = siblings.findIndex((t) => t.id === taskId);
    return `${parentNumber}.${childIndex + 1}`;
}

export function hasChildren(taskId: number, tasks: Task[]): boolean {
    return tasks.some((t) => t.parent === taskId);
}

export function getChildren(taskId: number, tasks: Task[]): Task[] {
    return tasks.filter((t) => t.parent === taskId);
}

export function calculateDuration(start: Date, end: Date): number {
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

export function calculateEndDate(start: Date, durationDays: number): Date {
    const end = new Date(start);
    end.setDate(end.getDate() + durationDays);
    return end;
}

export function calculateStartDate(end: Date, durationDays: number): Date {
    const start = new Date(end);
    start.setDate(start.getDate() - durationDays);
    return start;
}

export function isDescendantOf(
    task: Task,
    ancestorId: number,
    tasks: Task[],
): boolean {
    if (task.parent === ancestorId) return true;
    if (!task.parent) return false;

    const parent = tasks.find((t) => t.id === task.parent);
    if (!parent) return false;

    return isDescendantOf(parent, ancestorId, tasks);
}
