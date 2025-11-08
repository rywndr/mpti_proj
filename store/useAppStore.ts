import { create } from "zustand";
import type { Task } from "@/types";
import { sampleTasks, getTasksWithCalculatedCosts } from "@/lib/sampleData";

/**
 * Project interface
 */
export interface Project {
    id: string;
    name: string;
    description?: string;
    startDate: Date;
    endDate: Date;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Sample projects for demo
 */
const sampleProjects: Project[] = [
    {
        id: "1",
        name: "E-Commerce Platform Redesign",
        description:
            "Complete overhaul of the existing e-commerce platform with modern UI/UX",
        startDate: new Date("2024-01-15"),
        endDate: new Date("2024-06-30"),
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
    },
    {
        id: "2",
        name: "Mobile App Development",
        description: "Native mobile applications for iOS and Android",
        startDate: new Date("2024-02-01"),
        endDate: new Date("2024-08-31"),
        createdAt: new Date("2024-01-15"),
        updatedAt: new Date("2024-01-15"),
    },
    {
        id: "3",
        name: "Infrastructure Migration",
        description: "Migrate services to cloud infrastructure",
        startDate: new Date("2024-03-01"),
        endDate: new Date("2024-09-30"),
        createdAt: new Date("2024-02-01"),
        updatedAt: new Date("2024-02-01"),
    },
];

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
    tasksMap: {
        "1": sampleTasks,
        "2": [],
        "3": [],
    },
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
                            isDescendantOf(task, newTask.parent, projectTasks)
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
        const task = tasks.find((t) => t.id === taskId);
        if (!task) return "";

        // If task has no parent, it's a top-level task
        if (!task.parent) {
            const topLevelTasks = tasks.filter((t) => !t.parent);
            const index = topLevelTasks.findIndex((t) => t.id === taskId);
            return (index + 1).toString();
        }

        // Task has a parent - get parent's number and add child index
        const parentNumber = get().getTaskNumber(task.parent);
        const siblings = tasks.filter((t) => t.parent === task.parent);
        const childIndex = siblings.findIndex((t) => t.id === taskId);
        return `${parentNumber}.${childIndex + 1}`;
    },

    hasChildren: (taskId) => {
        const { currentProjectId, tasksMap } = get();
        if (!currentProjectId) return false;

        const tasks = tasksMap[currentProjectId] || [];
        return tasks.some((t) => t.parent === taskId);
    },

    getChildren: (taskId) => {
        const { currentProjectId, tasksMap } = get();
        if (!currentProjectId) return [];

        const tasks = tasksMap[currentProjectId] || [];
        const tasksWithCosts = getTasksWithCalculatedCosts(tasks);
        return tasksWithCosts.filter((t) => t.parent === taskId);
    },
}));

/**
 * Helper function to check if a task is a descendant of a parent
 */
function isDescendantOf(
    task: Task,
    parentId: number,
    allTasks: Task[],
): boolean {
    if (task.parent === parentId) return true;
    if (!task.parent) return false;

    const parent = allTasks.find((t) => t.id === task.parent);
    if (!parent) return false;

    return isDescendantOf(parent, parentId, allTasks);
}
