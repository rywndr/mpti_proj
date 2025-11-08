"use client";

import { Button } from "@/components/ui/button";
import { Calendar, LayoutGrid, Plus, ArrowLeft, Download } from "lucide-react";
import type { ViewMode } from "@/types";

interface TopbarProps {
    /** Current Gantt chart view mode */
    viewMode: ViewMode;
    /** Callback when view mode changes */
    onViewModeChange: (mode: ViewMode) => void;
    /** Callback when add task button is clicked */
    onAddTask: () => void;
    /** Callback when back button is clicked */
    onBack?: () => void;
    /** Callback when export button is clicked */
    onExport?: () => void;
}

export function Topbar({
    viewMode,
    onViewModeChange,
    onAddTask,
    onBack,
    onExport,
}: TopbarProps) {
    return (
        <header className="h-16 border-b bg-background px-6 flex items-center justify-between sticky top-0 z-50">
            {/* App */}
            <div className="flex items-center gap-3">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onBack}
                    className="h-10 w-10"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-primary-foreground">
                    <Calendar className="w-6 h-6" />
                </div>
                <div>
                    <h1 className="text-lg font-semibold tracking-tight">
                        SyncPath
                    </h1>
                    <p className="text-xs text-muted-foreground">
                        Project Management
                    </p>
                </div>
            </div>

            {/* View Mode Controls */}
            <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
                    <Button
                        variant={viewMode === "day" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => onViewModeChange("day")}
                        className="h-8 px-3"
                    >
                        Day
                    </Button>
                    <Button
                        variant={viewMode === "week" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => onViewModeChange("week")}
                        className="h-8 px-3"
                    >
                        Week
                    </Button>
                    <Button
                        variant={viewMode === "month" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => onViewModeChange("month")}
                        className="h-8 px-3"
                    >
                        Month
                    </Button>
                </div>

                {/* Primary Actions */}
                <div className="ml-4 flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onExport}
                        className="h-9"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Export
                    </Button>
                    <Button variant="outline" size="sm" className="h-9">
                        <LayoutGrid className="w-4 h-4 mr-2" />
                        View Options
                    </Button>
                    <Button size="sm" onClick={onAddTask} className="h-9">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Task
                    </Button>
                </div>
            </div>
        </header>
    );
}
