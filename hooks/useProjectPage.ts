"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAppStore } from "@/store/useAppStore";
import { getTasksWithCalculatedCosts } from "@/lib/sampleData";
import type { ViewMode, Task } from "@/types";

/**
 * Custom hook to manage project page state and logic
 * Encapsulates all state management, effects, and handlers
 */
export function useProjectPage(projectId: string) {
    const router = useRouter();
    const getProject = useAppStore((state) => state.getProject);
    const tasksMap = useAppStore((state) => state.tasksMap);
    const setCurrentProjectId = useAppStore(
        (state) => state.setCurrentProjectId,
    );
    const deleteTask = useAppStore((state) => state.deleteTask);
    const updateTask = useAppStore((state) => state.updateTask);

    // State
    const [viewMode, setViewMode] = useState<ViewMode>("week");
    const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [taskDialogOpen, setTaskDialogOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | undefined>();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deletingTask, setDeletingTask] = useState<Task | undefined>();

    // Get project directly by ID
    const project = getProject(projectId);

    // Get tasks with calculated costs for this specific project
    const tasks = useMemo(() => {
        const projectTasks = tasksMap[projectId] || [];
        return getTasksWithCalculatedCosts(projectTasks);
    }, [projectId, tasksMap]);

    // Set current project on mount
    useEffect(() => {
        setCurrentProjectId(projectId);
    }, [projectId, setCurrentProjectId]);

    // Check if project exists and redirect if not found
    useEffect(() => {
        if (!project) {
            toast.error("Project not found");
            router.push("/");
        }
    }, [project, router]);

    /**
     * Handle view mode changes (day/week/month)
     */
    const handleViewModeChange = (mode: ViewMode) => {
        setViewMode(mode);
    };

    /**
     * Handle task selection from task list
     */
    const handleTaskSelect = (taskId: number) => {
        setSelectedTaskId(taskId);
        const task = tasks.find((t) => t.id === taskId);
        if (task) {
            setSelectedTask(task);
            setModalOpen(true);
        }
    };

    /**
     * Handle task click from Gantt chart
     */
    const handleGanttTaskClick = (task: { id: number }) => {
        setSelectedTaskId(task.id);
        const foundTask = tasks.find((t) => t.id === task.id);
        if (foundTask) {
            setSelectedTask(foundTask);
            setModalOpen(true);
        }
    };

    /**
     * Handle add task button click
     */
    const handleAddTask = () => {
        setEditingTask(undefined);
        setTaskDialogOpen(true);
    };

    /**
     * Handle back button click - navigate to homepage
     */
    const handleBack = () => {
        router.push("/");
    };

    /**
     * Handle export button click
     */
    const handleExport = () => {
        // TODO: Implement export functionality
        console.log("Export button clicked");
        toast.info("Export functionality - Coming soon");
    };

    /**
     * Handle edit task from modal
     */
    const handleEditTask = (task: Task) => {
        setModalOpen(false);
        setEditingTask(task);
        setTaskDialogOpen(true);
    };

    /**
     * Handle delete task from modal
     */
    const handleDeleteTask = (task: Task) => {
        setModalOpen(false);
        setDeletingTask(task);
        setDeleteDialogOpen(true);
    };

    /**
     * Confirm delete task
     */
    const confirmDeleteTask = () => {
        if (deletingTask) {
            deleteTask(deletingTask.id);
            toast.success(`Task "${deletingTask.text}" deleted successfully`);
            setDeletingTask(undefined);
            setSelectedTask(null);
            setSelectedTaskId(null);
        }
    };

    /**
     * Handle task update (progress bar click)
     */
    const handleTaskUpdate = (taskId: number, updates: Partial<Task>) => {
        updateTask(taskId, updates);
    };

    /**
     * Handle successful task creation/edit
     */
    const handleTaskSuccess = () => {
        // Refresh selected task if it was edited
        if (editingTask && selectedTask?.id === editingTask.id) {
            const updatedTask = tasks.find((t) => t.id === editingTask.id);
            setSelectedTask(updatedTask || null);
        }
    };

    return {
        // Data
        project,
        tasks,

        // View state
        viewMode,
        selectedTaskId,

        // Modal state
        modalOpen,
        setModalOpen,
        selectedTask,
        taskDialogOpen,
        setTaskDialogOpen,
        editingTask,
        deleteDialogOpen,
        setDeleteDialogOpen,
        deletingTask,

        // Handlers
        handleViewModeChange,
        handleTaskSelect,
        handleGanttTaskClick,
        handleAddTask,
        handleBack,
        handleExport,
        handleEditTask,
        handleDeleteTask,
        confirmDeleteTask,
        handleTaskUpdate,
        handleTaskSuccess,
    };
}
