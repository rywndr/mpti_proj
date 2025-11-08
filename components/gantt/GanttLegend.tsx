"use client";

import { Card } from "@/components/ui/card";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

export function GanttLegend() {
    return (
        <TooltipProvider>
            <Card className="p-3 bg-muted/30 border-muted">
                <div className="flex items-center gap-6 flex-wrap text-xs">
                    <span className="font-semibold text-muted-foreground">
                        Legend:
                    </span>

                    {/* Task Types */}
                    <div className="flex items-center gap-3">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className="flex items-center gap-1.5 cursor-help">
                                    <div className="w-4 h-2.5 rounded-sm bg-linear-to-r from-[#60a5fa] to-[#3b82f6]" />
                                    <span className="text-muted-foreground">
                                        Group
                                    </span>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p className="text-xs">
                                    Parent task containing multiple subtasks
                                </p>
                            </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className="flex items-center gap-1.5 cursor-help">
                                    <div className="w-4 h-2.5 rounded-sm bg-linear-to-r from-[#4ade80] to-[#22c55e]" />
                                    <span className="text-muted-foreground">
                                        Task
                                    </span>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p className="text-xs">
                                    Individual work item with start and end
                                    dates
                                </p>
                            </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className="flex items-center gap-1.5 cursor-help">
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#a855f7]" />
                                    <span className="text-muted-foreground">
                                        Milestone
                                    </span>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p className="text-xs">
                                    Important project checkpoint or deadline
                                </p>
                            </TooltipContent>
                        </Tooltip>
                    </div>

                    {/* Separator */}
                    <div className="h-4 w-px bg-border" />

                    {/* Status Indicators */}
                    <div className="flex items-center gap-3">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className="flex items-center gap-1.5 cursor-help">
                                    <div className="w-3 h-3 rounded-full bg-[#fbbf24]" />
                                    <span className="text-muted-foreground">
                                        Warning
                                    </span>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p className="text-xs">
                                    Tasks approaching deadline or requiring
                                    attention
                                </p>
                            </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className="flex items-center gap-1.5 cursor-help">
                                    <div className="w-3 h-3 rounded-full bg-[#ef4444]" />
                                    <span className="text-muted-foreground">
                                        Danger
                                    </span>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p className="text-xs">
                                    Overdue or blocked tasks
                                </p>
                            </TooltipContent>
                        </Tooltip>
                    </div>

                    {/* Separator */}
                    <div className="h-4 w-px bg-border" />

                    {/* Others */}
                    <div className="flex items-center gap-3">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className="flex items-center gap-1.5 cursor-help">
                                    <div className="w-4 h-0.5 bg-[#ffa011]" />
                                    <span className="text-muted-foreground">
                                        Link
                                    </span>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p className="text-xs">
                                    Dependency arrow showing task relationships
                                </p>
                            </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className="flex items-center gap-1.5 cursor-help">
                                    <div className="w-4 h-0.5 bg-[#f04134]" />
                                    <span className="text-muted-foreground">
                                        Today
                                    </span>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p className="text-xs">
                                    Current date indicator on timeline
                                </p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                </div>
            </Card>
        </TooltipProvider>
    );
}
