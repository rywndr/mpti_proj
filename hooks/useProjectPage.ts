"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useProjects } from "@/hooks/useProjects";
import { useTasks, useUpdateTask, useDeleteTask } from "@/hooks/useTasks";
import { getTasksWithCalculatedCosts } from "@/lib/sampleData";
import { useExport } from "./useExport";
import type { ViewMode, Task } from "@/types";

export function useProjectPage(projectId: string) {
    const router = useRouter();

    // Fetch data from API
    const { data: projects = [] } = useProjects();
    const { data: tasksData = [] } = useTasks(projectId);
    const updateTaskMutation = useUpdateTask();
    const deleteTaskMutation = useDeleteTask();

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
    const project = projects.find((p) => p.id === projectId);

    const tasks = getTasksWithCalculatedCosts(tasksData);

    // Check if project exists and redirect if not found
    useEffect(() => {
        if (projects.length > 0 && !project) {
            toast.error("Project not found");
            router.push("/");
        }
    }, [project, projects.length, router]);

    const handleViewModeChange = (mode: ViewMode) => {
        setViewMode(mode);
    };

    const handleTaskSelect = (taskId: number) => {
        setSelectedTaskId(taskId);
        const task = tasks.find((t) => t.id === taskId);
        if (task) {
            setSelectedTask(task);
            setModalOpen(true);
        }
    };

    const handleGanttTaskClick = (task: { id: number }) => {
        setSelectedTaskId(task.id);
        const foundTask = tasks.find((t) => t.id === task.id);
        if (foundTask) {
            setSelectedTask(foundTask);
            setModalOpen(true);
        }
    };

    const handleAddTask = () => {
        setEditingTask(undefined);
        setTaskDialogOpen(true);
    };

    const handleBack = () => {
        router.push("/");
    };

    // Export
    const {
        isExportDialogOpen,
        openExportDialog,
        closeExportDialog,
        handleExport: handleExportAction,
    } = useExport({
        projectName: project?.name || "Project",
        tasks,
    });

    const handleEditTask = (task: Task) => {
        setModalOpen(false);
        setEditingTask(task);
        setTaskDialogOpen(true);
    };

    const handleDeleteTask = (task: Task) => {
        setModalOpen(false);
        setDeletingTask(task);
        setDeleteDialogOpen(true);
    };

    const confirmDeleteTask = async () => {
        if (deletingTask) {
            try {
                await deleteTaskMutation.mutateAsync({
                    id: deletingTask.id,
                    projectId,
                });
                toast.success(
                    `Task "${deletingTask.text}" deleted successfully`,
                );
                setDeletingTask(undefined);
                setDeleteDialogOpen(false);
                setSelectedTask(null);
                setSelectedTaskId(null);
            } catch (error) {
                console.error("Failed to delete task:", error);
            }
        }
    };

    const handleTaskUpdate = async (taskId: number, updates: Partial<Task>) => {
        try {
            await updateTaskMutation.mutateAsync({
                id: taskId,
                projectId,
                data: updates,
            });
        } catch (error) {
            console.error("Failed to update task:", error);
        }
    };

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
        openExportDialog,
        handleEditTask,
        handleDeleteTask,
        confirmDeleteTask,
        handleTaskUpdate,
        handleTaskSuccess,

        // Export
        isExportDialogOpen,
        closeExportDialog,
        handleExportAction,
    };
}
