"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
    FolderKanban,
    MoreVertical,
    Pencil,
    Trash2,
    Calendar,
    ListTodo,
} from "lucide-react";
import { formatDate } from "@/lib/formatters";
import type { Project } from "@/store/useAppStore";

interface ProjectCardProps {
    project: Project;
    taskCount: number;
    onProjectClick: (projectId: string) => void;
    onEdit: (e: React.MouseEvent, project: Project) => void;
    onDelete: (e: React.MouseEvent, project: Project) => void;
}

export function ProjectCard({
    project,
    taskCount,
    onProjectClick,
    onEdit,
    onDelete,
}: ProjectCardProps) {
    return (
        <Card
            className="group cursor-pointer transition-all hover:shadow-md hover:border-primary/50 overflow-hidden"
            onClick={() => onProjectClick(project.id)}
        >
            <CardContent className="p-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="mt-0.5 shrink-0">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                <FolderKanban className="w-5 h-5 text-primary" />
                            </div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-base leading-tight truncate">
                                {project.name}
                            </h3>
                            {project.description && (
                                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                    {project.description}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Actions Menu */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                onClick={(e) => onEdit(e, project)}
                            >
                                <Pencil className="h-4 w-4 mr-2" />
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={(e) => onDelete(e, project)}
                                className="text-destructive focus:text-destructive"
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Metadata */}
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    {/* Date Range */}
                    <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">
                            {formatDate(project.startDate)} -{" "}
                            {formatDate(project.endDate)}
                        </span>
                    </div>

                    {/* Task Count Badge */}
                    <Badge variant="secondary" className="h-5 gap-1 px-2">
                        <ListTodo className="w-3 h-3" />
                        <span className="font-medium">{taskCount}</span>
                    </Badge>
                </div>
            </CardContent>
        </Card>
    );
}
