"use client";

import { use } from "react";
import {
    ResizablePanelGroup,
    ResizablePanel,
    ResizableHandle,
} from "@/components/ui/resizable";
import { AppHeader, AppHeaderActions } from "@/components/layout/AppHeader";
import { TaskList } from "@/components/tasks/TaskList";
import { GanttChart } from "@/components/gantt/GanttChart";
import { TaskDetailsModal } from "@/components/tasks/TaskDetailsModal";
import { TaskDialog } from "@/components/forms/TaskDialog";
import { DeleteConfirmDialog } from "@/components/forms/DeleteConfirmDialog";
import { ExportDialog } from "@/components/export/ExportDialog";
import { useProjectPage } from "@/hooks/useProjectPage";

interface ProjectPageProps {
    params: Promise<{
        id: string;
    }>;
}

/**
 * Project page - displays Gantt chart and task list for a specific project
 */
export default function ProjectPage({ params }: ProjectPageProps) {
    // Unwrap params Promise for Next.js 15+
    const { id } = use(params);
    const {
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
    } = useProjectPage(id);

    // Show nothing while redirecting if project not found
    if (!project) {
        return null;
    }

    return (
        <div className="h-screen flex flex-col bg-background">
            {/* Top Bar */}
            <AppHeader
                onBack={handleBack}
                viewMode={viewMode}
                onViewModeChange={handleViewModeChange}
                actions={
                    <AppHeaderActions
                        onExport={openExportDialog}
                        onAddTask={handleAddTask}
                    />
                }
            />

            {/* Main Content - Resizable Panels */}
            <div className="flex-1 overflow-hidden">
                <ResizablePanelGroup direction="horizontal" className="h-full">
                    {/* Task List Panel */}
                    <ResizablePanel
                        defaultSize={30}
                        minSize={20}
                        maxSize={50}
                        className="bg-background"
                    >
                        <TaskList
                            tasks={tasks}
                            selectedTaskId={selectedTaskId}
                            onTaskSelect={handleTaskSelect}
                            onTaskUpdate={handleTaskUpdate}
                        />
                    </ResizablePanel>

                    {/* Resize Handle */}
                    <ResizableHandle
                        withHandle
                        className="bg-border hover:bg-primary/20 transition-colors"
                    />

                    {/* Gantt Chart Panel */}
                    <ResizablePanel
                        defaultSize={70}
                        minSize={50}
                        className="bg-background"
                    >
                        <GanttChart
                            tasks={tasks}
                            viewMode={viewMode}
                            onTaskClick={handleGanttTaskClick}
                        />
                    </ResizablePanel>
                </ResizablePanelGroup>
            </div>

            {/* Task Details Modal */}
            <TaskDetailsModal
                open={modalOpen}
                onOpenChange={setModalOpen}
                task={selectedTask}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
            />

            {/* Task Form Dialog */}
            <TaskDialog
                open={taskDialogOpen}
                onOpenChange={setTaskDialogOpen}
                task={editingTask}
                onSuccess={handleTaskSuccess}
            />

            {/* Delete Confirmation Dialog */}
            <DeleteConfirmDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onConfirm={confirmDeleteTask}
                title="Delete Task"
                itemName={deletingTask?.text}
                description={
                    deletingTask?.type === "group"
                        ? `This will permanently delete the task group "${deletingTask.text}" and all its subtasks. This action cannot be undone.`
                        : deletingTask
                          ? `This will permanently delete "${deletingTask.text}". This action cannot be undone.`
                          : undefined
                }
            />

            {/* Export Dialog */}
            <ExportDialog
                open={isExportDialogOpen}
                onOpenChange={closeExportDialog}
                onExport={handleExportAction}
                projectName={project.name}
            />
        </div>
    );
}
