import { create } from "zustand";
import type { Task } from "@/types";
import { getTasksWithCalculatedCosts } from "@/lib/sampleData";
import {
    getTaskNumber as getTaskNumberUtil,
    hasChildren as hasChildrenUtil,
    getChildren as getChildrenUtil,
    isDescendantOf,
} from "@/lib/taskUtils";

/**
 * Project interface
 */
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

/**
 * Sample projects for demo
 */
const sampleProjects: Project[] = [];

interface AppState {
    // Projects
    projects: Project[];
    currentProjectId: string | null;

    // Tasks (organized by project ID)
    tasksMap: Record<string, Task[]>;
    nextTaskId: number;

    // Actions
    setCurrentProjectId: (id: string | null) => void;

    // Project actions
    getProject: (id: string) => Project | undefined;
    addProject: (
        project: Omit<Project, "id" | "createdAt" | "updatedAt">,
    ) => Project;
    updateProject: (
        id: string,
        updates: Partial<Omit<Project, "id" | "createdAt">>,
    ) => void;
    deleteProject: (id: string) => void;

    // Task actions
    getTask: (id: number) => Task | undefined;
    addTask: (projectId: string, task: Omit<Task, "id">) => Task;
    updateTask: (id: number, updates: Partial<Omit<Task, "id">>) => void;
    deleteTask: (id: number) => void;

    // Helper to get task display number (e.g., "1", "1.1", "1.2", "2", "2.1")
    getTaskNumber: (taskId: number) => string;

    // Helper to check if a task has children
    hasChildren: (taskId: number) => boolean;

    // Helper to get direct children of a task
    getChildren: (taskId: number) => Task[];
}

export const useAppStore = create<AppState>((set, get) => ({
    projects: sampleProjects,
    currentProjectId: null,
    tasksMap: {},
    nextTaskId: 1000,

    setCurrentProjectId: (id) => set({ currentProjectId: id }),

    // Project operations
    getProject: (id) => {
        return get().projects.find((p) => p.id === id);
    },

    addProject: (projectData) => {
        const newProject: Project = {
            ...projectData,
            id: Date.now().toString(),
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        set((state) => ({
            projects: [...state.projects, newProject],
            tasksMap: { ...state.tasksMap, [newProject.id]: [] },
        }));
        return newProject;
    },

    updateProject: (id, updates) => {
        set((state) => ({
            projects: state.projects.map((project) =>
                project.id === id
                    ? { ...project, ...updates, updatedAt: new Date() }
                    : project,
            ),
        }));
    },

    deleteProject: (id) => {
        set((state) => {
            const newTasksMap = { ...state.tasksMap };
            delete newTasksMap[id];
            return {
                projects: state.projects.filter((p) => p.id !== id),
                tasksMap: newTasksMap,
            };
        });
    },

    // Task operations
    getTask: (id) => {
        const { currentProjectId, tasksMap } = get();
        if (!currentProjectId) return undefined;
        const projectTasks = tasksMap[currentProjectId] || [];
        const tasksWithCosts = getTasksWithCalculatedCosts(projectTasks);
        return tasksWithCosts.find((t) => t.id === id);
    },

    addTask: (projectId, taskData) => {
        const state = get();
        const newTask: Task = {
            ...taskData,
            id: state.nextTaskId,
        };

        set((prevState) => {
            const projectTasks = prevState.tasksMap[projectId] || [];

            // Find the correct insertion position based on parent
            let insertIndex = projectTasks.length;

            if (newTask.parent !== undefined) {
                // Find parent task
                const parentIndex = projectTasks.findIndex(
                    (t) => t.id === newTask.parent,
                );

                if (parentIndex !== -1) {
                    // Find the last child of this parent (or the parent itself if no children)
                    let lastChildIndex = parentIndex;
                    for (
                        let i = parentIndex + 1;
                        i < projectTasks.length;
                        i++
                    ) {
                        const task = projectTasks[i];
                        // Check if this task is a child or descendant of the parent
                        if (
                            task.parent === newTask.parent ||
                            isDescendantOf(task, newTask.parent!, projectTasks)
                        ) {
                            lastChildIndex = i;
                        } else {
                            break;
                        }
                    }
                    insertIndex = lastChildIndex + 1;
                }
            }

            // Insert task at the correct position
            const updatedTasks = [
                ...projectTasks.slice(0, insertIndex),
                newTask,
                ...projectTasks.slice(insertIndex),
            ];

            return {
                tasksMap: {
                    ...prevState.tasksMap,
                    [projectId]: updatedTasks,
                },
                nextTaskId: prevState.nextTaskId + 1,
            };
        });

        return newTask;
    },

    updateTask: (id, updates) => {
        set((state) => {
            const newTasksMap = { ...state.tasksMap };
            Object.keys(newTasksMap).forEach((projectId) => {
                newTasksMap[projectId] = newTasksMap[projectId].map((task) =>
                    task.id === id ? { ...task, ...updates } : task,
                );
            });
            return { tasksMap: newTasksMap };
        });
    },

    deleteTask: (id) => {
        set((state) => {
            const newTasksMap = { ...state.tasksMap };
            Object.keys(newTasksMap).forEach((projectId) => {
                // Remove the task and any tasks that have this as parent
                const removeTaskAndChildren = (
                    tasks: Task[],
                    taskId: number,
                ): Task[] => {
                    const childIds = tasks
                        .filter((t) => t.parent === taskId)
                        .map((t) => t.id);
                    let filtered = tasks.filter((t) => t.id !== taskId);
                    childIds.forEach((childId) => {
                        filtered = removeTaskAndChildren(filtered, childId);
                    });
                    return filtered;
                };
                newTasksMap[projectId] = removeTaskAndChildren(
                    newTasksMap[projectId],
                    id,
                );
            });
            return { tasksMap: newTasksMap };
        });
    },

    getTaskNumber: (taskId) => {
        const { currentProjectId, tasksMap } = get();
        if (!currentProjectId) return "";

        const tasks = tasksMap[currentProjectId] || [];
        return getTaskNumberUtil(taskId, tasks);
    },

    hasChildren: (taskId) => {
        const { currentProjectId, tasksMap } = get();
        if (!currentProjectId) return false;

        const tasks = tasksMap[currentProjectId] || [];
        return hasChildrenUtil(taskId, tasks);
    },

    getChildren: (taskId) => {
        const { currentProjectId, tasksMap } = get();
        if (!currentProjectId) return [];

        const tasks = tasksMap[currentProjectId] || [];
        const tasksWithCosts = getTasksWithCalculatedCosts(tasks);
        return getChildrenUtil(taskId, tasksWithCosts);
    },
}));
