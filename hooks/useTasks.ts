"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { Task } from "@/types";

interface CreateTaskData {
    parent?: number;
    type?: "task" | "group" | "milestone";
    text: string;
    description?: string;
    start: Date;
    end: Date;
    percent?: number;
    status?: "pending" | "in-progress" | "completed" | "blocked";
    priority?: "low" | "medium" | "high" | "critical";
    assignee?: string;
    cost?: number;
    links?: Array<{ target: number; type: string }>;
}

interface UpdateTaskData {
    parent?: number;
    type?: "task" | "group" | "milestone";
    text?: string;
    description?: string;
    start?: Date;
    end?: Date;
    percent?: number;
    status?: "pending" | "in-progress" | "completed" | "blocked";
    priority?: "low" | "medium" | "high" | "critical";
    assignee?: string;
    cost?: number;
    links?: Array<{ target: number; type: string }>;
}

// Fetch all tasks for a project
export function useTasks(projectId: string | null) {
    return useQuery({
        queryKey: ["tasks", projectId],
        queryFn: async () => {
            if (!projectId) {
                return [];
            }

            const response = await fetch(`/api/projects/${projectId}/tasks`);
            if (!response.ok) {
                throw new Error("Failed to fetch tasks");
            }
            const data = await response.json();
            // Transform dates from strings to Date objects
            return data.map((task: Task) => ({
                ...task,
                start: new Date(task.start),
                end: new Date(task.end),
            })) as Task[];
        },
        enabled: !!projectId,
    });
}

// Create a new task
export function useCreateTask() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            projectId,
            data,
        }: {
            projectId: string;
            data: CreateTaskData;
        }) => {
            const response = await fetch(`/api/projects/${projectId}/tasks`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to create task");
            }

            const result = await response.json();
            // Transform dates
            return {
                ...result,
                start: new Date(result.start),
                end: new Date(result.end),
            };
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["tasks", variables.projectId],
            });
            toast.success(`Task "${data.text}" created successfully`);
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to create task");
        },
    });
}

// Update an existing task
export function useUpdateTask() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            data,
        }: {
            id: number;
            projectId: string;
            data: UpdateTaskData;
        }) => {
            const response = await fetch(`/api/tasks/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to update task");
            }

            const result = await response.json();
            // Transform dates
            return {
                ...result,
                start: new Date(result.start),
                end: new Date(result.end),
            };
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["tasks", variables.projectId],
            });
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to update task");
        },
    });
}

// Delete a task
export function useDeleteTask() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id }: { id: number; projectId: string }) => {
            const response = await fetch(`/api/tasks/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to delete task");
            }

            return response.json();
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["tasks", variables.projectId],
            });
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to delete task");
        },
    });
}
