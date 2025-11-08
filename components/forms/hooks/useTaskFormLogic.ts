import { useMemo } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskSchema, type TaskFormData } from "@/lib/validations";
import type { Task } from "@/types";
import { useAppStore } from "@/store/useAppStore";
import { getTasksWithCalculatedCosts } from "@/lib/sampleData";

interface UseTaskFormLogicProps {
    task?: Task;
    parentId?: number;
}

export function useTaskFormLogic({ task, parentId }: UseTaskFormLogicProps) {
    const currentProjectId = useAppStore((state) => state.currentProjectId);
    const tasksMap = useAppStore((state) => state.tasksMap);
    const hasChildren = useAppStore((state) => state.hasChildren);
    const getTaskNumber = useAppStore((state) => state.getTaskNumber);

    // Get tasks with calculated costs from tasksMap
    const tasks = useMemo(() => {
        if (!currentProjectId) return [];
        const projectTasks = tasksMap[currentProjectId] || [];
        return getTasksWithCalculatedCosts(projectTasks);
    }, [currentProjectId, tasksMap]);

    // Check if the current task is a group with children
    const isGroupWithChildren =
        task?.type === "group" && task?.id ? hasChildren(task.id) : false;

    const defaultEndDate = useMemo(() => {
        const date = new Date();
        date.setDate(date.getDate() + 7);
        return date;
    }, []);

    const form = useForm<TaskFormData>({
        resolver: zodResolver(taskSchema),
        defaultValues: {
            text: task?.text ?? "",
            description: task?.description ?? "",
            start: task?.start ?? new Date(),
            end: task?.end ?? defaultEndDate,
            status: task?.status ?? "pending",
            priority: task?.priority ?? "medium",
            assignee: task?.assignee ?? "",
            parent: parentId !== undefined ? parentId : task?.parent,
            type: task?.type ?? "task",
            cost: task?.cost ?? 0,
            percent: task?.percent ?? 0,
            links: task?.links ?? [],
        },
    });

    const fieldArray = useFieldArray({
        control: form.control,
        name: "links",
    });

    // Get potential parent tasks (groups only, excluding current task and its descendants)
    const potentialParents = useMemo(() => {
        return tasks.filter((t) => {
            if (t.type !== "group") return false;
            if (task && t.id === task.id) return false;
            // Prevent circular dependencies - exclude descendants
            if (task) {
                let current = t;
                while (current.parent) {
                    if (current.parent === task.id) return false;
                    const parent = tasks.find((p) => p.id === current.parent);
                    if (!parent) break;
                    current = parent;
                }
            }
            return true;
        });
    }, [tasks, task]);

    // Get potential dependency tasks (exclude current task and its descendants)
    const potentialDependencies = useMemo(() => {
        return tasks.filter((t) => {
            if (task && t.id === task.id) return false;
            // Prevent circular dependencies
            if (task) {
                let current = t;
                while (current.parent) {
                    if (current.parent === task.id) return false;
                    const parent = tasks.find((p) => p.id === current.parent);
                    if (!parent) break;
                    current = parent;
                }
            }
            return true;
        });
    }, [tasks, task]);

    const taskType = form.watch("type");
    const isMilestone = taskType === "milestone";

    return {
        form,
        fieldArray,
        isGroupWithChildren,
        potentialParents,
        potentialDependencies,
        taskType,
        isMilestone,
        getTaskNumber,
    };
}
