"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { exportGanttAsPNG, exportProjectAsPDF } from "@/lib/exportUtils";
import type { Task } from "@/types";
import type { ExportFormat } from "@/components/export/ExportDialog";

interface UseExportOptions {
    projectName: string;
    tasks: Task[];
    ganttElementId?: string;
}

/**
 * Custom hook for managing Gantt chart export functionality
 */
export function useExport({
    projectName,
    tasks,
    ganttElementId = "gantt-chart",
}: UseExportOptions) {
    const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);

    const openExportDialog = useCallback(() => {
        setIsExportDialogOpen(true);
    }, []);

    const closeExportDialog = useCallback(() => {
        setIsExportDialogOpen(false);
    }, []);

    /**
     * Get Gantt chart container element
     */
    const getGanttElement = useCallback((): HTMLElement | null => {
        const element = document.getElementById(ganttElementId);
        if (!element) {
            console.error(
                `Gantt chart element with id "${ganttElementId}" not found`,
            );
            return null;
        }
        return element;
    }, [ganttElementId]);

    /**
     * Handle export operation
     */
    const handleExport = useCallback(
        async (format: ExportFormat): Promise<void> => {
            const ganttElement = getGanttElement();
            if (!ganttElement) {
                toast.error("Gantt chart not found. Please try again.");
                throw new Error("Gantt element not found");
            }

            try {
                toast.loading("Preparing export...", { id: "export" });

                if (format === "png") {
                    await exportGanttAsPNG(ganttElement, projectName);
                    toast.success("Gantt chart exported as PNG", {
                        id: "export",
                    });
                } else if (format === "pdf") {
                    await exportProjectAsPDF(ganttElement, tasks, projectName);
                    toast.success("Project exported as PDF", { id: "export" });
                } else {
                    throw new Error(`Unsupported export format: ${format}`);
                }
            } catch (error) {
                const errorMessage =
                    error instanceof Error
                        ? error.message
                        : "Unknown error occurred";
                console.error("Export failed:", errorMessage, error);
                toast.error("Export failed. Please try again.", {
                    id: "export",
                });
                throw error;
            }
        },
        [getGanttElement, projectName, tasks],
    );

    return {
        isExportDialogOpen,
        openExportDialog,
        closeExportDialog,
        handleExport,
    };
}
