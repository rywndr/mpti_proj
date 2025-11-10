import { useMemo, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskSchema, type TaskFormData } from "@/lib/validations";
import type { Task } from "@/types";
import {
    getTaskNumber,
    hasChildren,
    calculateDuration,
    calculateEndDate,
    calculateStartDate,
} from "@/lib/taskUtils";

interface UseTaskFormLogicProps {
    task?: Task;
    parentId?: number;
    tasks: Task[];
}

export function useTaskFormLogic({
    task,
    parentId,
    tasks,
}: UseTaskFormLogicProps) {
    // Check if current task is a group with children
    const isGroupWithChildren =
        task?.type === "group" && task?.id
            ? hasChildren(task.id, tasks)
            : false;

    const defaultEndDate = useMemo(() => {
        const date = new Date();
        date.setDate(date.getDate() + 7);
        return date;
    }, []);

    const defaultDuration = useMemo(() => {
        if (task?.start && task?.end) {
            return calculateDuration(task.start, task.end);
        }
        return 7;
    }, [task]);

    const form = useForm<TaskFormData>({
        resolver: zodResolver(taskSchema),
        defaultValues: {
            text: task?.text ?? "",
            description: task?.description ?? "",
            start: task?.start ?? new Date(),
            end: task?.end ?? defaultEndDate,
            duration: defaultDuration,
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

    const startDate = form.watch("start");
    const endDate = form.watch("end");
    const duration = form.watch("duration");

    useEffect(() => {
        const newDuration = calculateDuration(startDate, endDate);
        if (duration !== newDuration) {
            form.setValue("duration", newDuration, { shouldValidate: false });
        }
    }, [startDate, endDate, form, duration]);

    const fieldArray = useFieldArray({
        control: form.control,
        name: "links",
    });

    // Get potential parent tasks
    const potentialParents = useMemo(() => {
        return tasks.filter((t) => {
            if (t.type !== "group") return false;
            if (task && t.id === task.id) return false;
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

    const potentialDependencies = useMemo(() => {
        return tasks.filter((t) => {
            if (task && t.id === task.id) return false;
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

    // Helper to get task number
    const getTaskNumberHelper = (taskId: number) =>
        getTaskNumber(taskId, tasks);

    // Helper to handle duration change
    const handleDurationChange = (newDuration: number) => {
        const currentStart = form.getValues("start");
        const newEnd = calculateEndDate(currentStart, newDuration);
        form.setValue("end", newEnd);
    };

    return {
        form,
        fieldArray,
        isGroupWithChildren,
        potentialParents,
        potentialDependencies,
        taskType,
        isMilestone,
        getTaskNumber: getTaskNumberHelper,
        handleDurationChange,
    };
}
