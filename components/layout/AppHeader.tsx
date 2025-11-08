"use client";

import { Button } from "@/components/ui/button";
import { Calendar, Plus, ArrowLeft, Download } from "lucide-react";
import type { ReactNode } from "react";
import type { ViewMode } from "@/types";

interface AppHeaderProps {
    title?: string;
    subtitle?: string;
    /** Optional back button */
    onBack?: () => void;
    /** View mode controls (optional) */
    viewMode?: ViewMode;
    onViewModeChange?: (mode: ViewMode) => void;
    /** Action buttons (optional) */
    actions?: ReactNode;
}

export function AppHeader({
    title = "SyncPath",
    subtitle = "Project Management Platform",
    onBack,
    viewMode,
    onViewModeChange,
    actions,
}: AppHeaderProps) {
    return (
        <header className="h-16 border-b bg-background px-6 flex items-center justify-between sticky top-0 z-50">
            <div className="flex items-center gap-3">
                {onBack && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onBack}
                        className="h-10 w-10"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                )}

                {/* Icon */}
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-primary-foreground">
                    <Calendar className="w-6 h-6" />
                </div>

                <div>
                    <h1 className="text-lg font-semibold tracking-tight">
                        {title}
                    </h1>
                    <p className="text-xs text-muted-foreground">{subtitle}</p>
                </div>
            </div>

            {/*View Mode Controls & Actions */}
            <div className="flex items-center gap-2">
                {/* View Mode Toggle (optional - for project page) */}
                {viewMode && onViewModeChange && (
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
                )}

                {/* Action Buttons */}
                {actions && <div className="ml-4">{actions}</div>}
            </div>
        </header>
    );
}

interface AppHeaderActionsProps {
    onExport?: () => void;
    onAddTask?: () => void;
    children?: ReactNode;
}

/**
 * Helper component for common action buttons
 * Can be used with AppHeader's actions prop
 */
export function AppHeaderActions({
    onExport,
    onAddTask,
    children,
}: AppHeaderActionsProps) {
    return (
        <div className="flex items-center gap-2">
            {children}
            {onExport && (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onExport}
                    className="h-9"
                >
                    <Download className="w-4 h-4 mr-2" />
                    Export
                </Button>
            )}
            {onAddTask && (
                <Button size="sm" onClick={onAddTask} className="h-9">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Task
                </Button>
            )}
        </div>
    );
}
