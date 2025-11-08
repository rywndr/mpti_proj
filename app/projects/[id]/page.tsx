"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    ResizablePanelGroup,
    ResizablePanel,
    ResizableHandle,
} from "@/components/ui/resizable";
import { Topbar } from "@/components/layout/Topbar";
import { TaskList } from "@/components/tasks/TaskList";
import { GanttChart } from "@/components/gantt/GanttChart";
import { TaskDetailsModal } from "@/components/tasks/TaskDetailsModal";
import { sampleTasks, getTasksWithCalculatedCosts } from "@/lib/sampleData";
import type { ViewMode, Task } from "@/types";

export default function Home() {
    // State management
    const [viewMode, setViewMode] = useState<ViewMode>("week");
    const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
    const [tasks] = useState(getTasksWithCalculatedCosts(sampleTasks));
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

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
        // TODO: Implement add task dialog/modal
        console.log("Add task clicked");
        alert("Add Task functionality - To be implemented");
    };

    const router = useRouter();

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
        alert("Export functionality - To be implemented");
    };

    /**
     * Handle edit task from modal
     */
    const handleEditTask = (task: Task) => {
        // TODO: Implement edit task
        console.log("Edit task:", task);
        alert(`Edit task: ${task.text} - To be implemented`);
    };

    /**
     * Handle delete task from modal
     */
    const handleDeleteTask = (task: Task) => {
        // TODO: Implement delete task
        console.log("Delete task:", task);
        alert(`Delete task: ${task.text} - To be implemented`);
    };

    return (
        <div className="h-screen flex flex-col bg-background">
            {/* Top  Bar */}
            <Topbar
                viewMode={viewMode}
                onViewModeChange={handleViewModeChange}
                onAddTask={handleAddTask}
                onBack={handleBack}
                onExport={handleExport}
            />

            <div className="flex-1 overflow-hidden">
                <ResizablePanelGroup direction="horizontal" className="h-full">
                    {/* Task List */}
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
                        />
                    </ResizablePanel>

                    {/* Resize Handle */}
                    <ResizableHandle
                        withHandle
                        className="bg-border hover:bg-primary/20 transition-colors"
                    />

                    {/*Gantt Chart */}
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
        </div>
    );
}
