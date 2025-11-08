"use client";

import { useEffect, useRef } from "react";
import type { Task, GanttOptions, ViewMode } from "@/types";
import type { SVGGantt } from "gantt";
import { GanttLegend } from "./GanttLegend";
import { useDragScroll } from "@/hooks/useDragScroll";
import { cn } from "@/lib/utils";

interface GanttChartProps {
    /** Array of tasks to display in the Gantt chart */
    tasks: Task[];
    /** Current view mode (day/week/month) */
    viewMode: ViewMode;
    /** Callback when a task bar is clicked */
    onTaskClick?: (task: Task) => void;
    /** Additional Gantt options */
    options?: Partial<GanttOptions>;
}

export function GanttChart({
    tasks,
    viewMode,
    onTaskClick,
    options = {},
}: GanttChartProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const ganttInstanceRef = useRef<SVGGantt | null>(null);
    const { ref: scrollRef, isDragging } = useDragScroll<HTMLDivElement>({
        horizontal: true,
        vertical: true,
        dragThreshold: 10,
    });

    useEffect(() => {
        // Only run on client-side
        if (typeof window === "undefined" || !containerRef.current) return;

        // Dynamic import of gantt library (client-side only)
        const initGantt = async () => {
            try {
                const { SVGGantt } = await import("gantt");

                // Store ref to current container for cleanup
                const currentContainer = containerRef.current;

                // Clear previous content
                if (currentContainer) {
                    currentContainer.innerHTML = "";
                }

                // Convert tasks to gantt format with ID prefix
                const ganttData = tasks.map((task) => ({
                    id: task.id,
                    parent: task.parent,
                    type: task.type,
                    text: `#${task.id} ${task.text}`,
                    start: task.start,
                    end: task.end,
                    percent: task.percent,
                    links: task.links,
                }));

                // Prepare gantt options
                const ganttOptions: GanttOptions = {
                    viewMode,
                    onClick: (item) => {
                        const task = tasks.find((t) => t.id === item.id);
                        if (task && onTaskClick) {
                            onTaskClick(task);
                        }
                    },
                    offsetY: 60,
                    rowHeight: 40,
                    barHeight: 20,
                    styleOptions: {
                        bgColor: "#ffffff",
                        lineColor: "#e5e7eb",
                        redLineColor: "#ef4444",
                        groupBack: "#60a5fa",
                        groupFront: "#3b82f6",
                        taskBack: "#4ade80",
                        taskFront: "#22c55e",
                        milestone: "#a855f7",
                        warning: "#fbbf24",
                        danger: "#ef4444",
                        link: "#f59e0b",
                        textColor: "#0f172a",
                        lightTextColor: "#64748b",
                        lineWidth: "1px",
                        thickLineWidth: "2px",
                        fontSize: "14px",
                        smallFontSize: "12px",
                        fontFamily:
                            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                        ...options?.styleOptions,
                    },
                    ...options,
                };

                // Create new gantt instance
                if (currentContainer) {
                    ganttInstanceRef.current = new SVGGantt(
                        currentContainer,
                        ganttData,
                        ganttOptions,
                    );
                }
            } catch (error) {
                console.error("Error initializing Gantt chart:", error);
            }
        };

        initGantt();

        // Cleanup on unmount
        return () => {
            ganttInstanceRef.current = null;
        };
    }, [tasks, viewMode, onTaskClick, options]);

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="px-3 py-2.5 border-b bg-background shrink-0">
                <h2 className="text-sm font-semibold tracking-tight">
                    Timeline
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                    Gantt chart visualization
                </p>
            </div>

            {/* Legend */}
            <div className="px-3 pt-3 shrink-0">
                <GanttLegend />
            </div>

            {/* Gantt Container */}
            <div
                ref={scrollRef}
                className={cn(
                    "flex-1 overflow-auto bg-background select-none",
                    isDragging ? "cursor-grabbing" : "cursor-grab",
                )}
            >
                {tasks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-8">
                        <svg
                            className="w-16 h-16 text-muted-foreground/50 mb-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                            />
                        </svg>
                        <p className="text-sm text-muted-foreground">
                            No timeline to display
                        </p>
                        <p className="text-xs text-muted-foreground/75 mt-1">
                            Add tasks to see the Gantt chart
                        </p>
                    </div>
                ) : (
                    <div
                        ref={containerRef}
                        className="w-full h-full min-h-[400px] gantt-wrapper"
                    />
                )}
            </div>
        </div>
    );
}
