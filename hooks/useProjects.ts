"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export interface Project {
    id: string;
    name: string;
    description?: string;
    startDate: Date;
    endDate: Date;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}

interface CreateProjectData {
    name: string;
    description?: string;
    startDate: Date;
    endDate: Date;
}

interface UpdateProjectData {
    name?: string;
    description?: string;
    startDate?: Date;
    endDate?: Date;
}

// Fetch all projects for authenticated user
export function useProjects() {
    return useQuery({
        queryKey: ["projects"],
        queryFn: async () => {
            const response = await fetch("/api/projects");
            if (!response.ok) {
                throw new Error("Failed to fetch projects");
            }
            const data = await response.json();
            // Transform dates from strings to Date objects
            return data.map((project: Project) => ({
                ...project,
                startDate: new Date(project.startDate),
                endDate: new Date(project.endDate),
                createdAt: new Date(project.createdAt),
                updatedAt: new Date(project.updatedAt),
            })) as Project[];
        },
    });
}

// Create a new project
export function useCreateProject() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: CreateProjectData) => {
            const response = await fetch("/api/projects", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to create project");
            }

            return response.json();
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["projects"] });
            toast.success(`Project "${data.name}" created successfully`);
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to create project");
        },
    });
}

// Update an existing project
export function useUpdateProject() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            data,
        }: {
            id: string;
            data: UpdateProjectData;
        }) => {
            const response = await fetch(`/api/projects/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to update project");
            }

            return response.json();
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["projects"] });
            toast.success(`Project "${data.name}" updated successfully`);
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to update project");
        },
    });
}

// Delete a project
export function useDeleteProject() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const response = await fetch(`/api/projects/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to delete project");
            }

            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["projects"] });
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to delete project");
        },
    });
}
