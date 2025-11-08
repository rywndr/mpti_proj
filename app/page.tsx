"use client";

import { useRouter } from "next/navigation";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Calendar,
    Users,
    Plus,
    TrendingUp,
    Clock,
    FolderKanban,
} from "lucide-react";
import { formatDate } from "@/lib/formatters";
import { getStatusBadgeVariant } from "@/lib/taskHelpers";

/**
 * Sample projects data
 */
const projects = [
    {
        id: "1",
        name: "WorkScheduler Application",
        description: "Modern project management and work scheduling platform",
        status: "in-progress",
        progress: 45,
        taskCount: 23,
        teamSize: 8,
        startDate: new Date("2024-01-15"),
        endDate: new Date("2024-06-30"),
    },
    {
        id: "2",
        name: "E-Commerce Platform",
        description: "Next-generation online shopping experience",
        status: "planning",
        progress: 15,
        taskCount: 42,
        teamSize: 12,
        startDate: new Date("2024-02-01"),
        endDate: new Date("2024-08-15"),
    },
    {
        id: "3",
        name: "Mobile App Redesign",
        description: "Complete UI/UX overhaul for mobile applications",
        status: "in-progress",
        progress: 68,
        taskCount: 18,
        teamSize: 5,
        startDate: new Date("2023-11-01"),
        endDate: new Date("2024-03-31"),
    },
];

/**
 * Homepage component
 */
export default function Home() {
    const router = useRouter();

    /**
     * Navigate to project details page
     */
    const handleProjectClick = (projectId: string) => {
        router.push(`/projects/${projectId}`);
    };

    /**
     * Handle create new project
     */
    const handleCreateProject = () => {
        // TODO: Implement create project modal
        alert("Create new project - To be implemented");
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b bg-background sticky top-0 z-50">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-primary-foreground">
                                <Calendar className="w-6 h-6" />
                            </div>
                            <div>
                                <h1 className="text-xl font-semibold tracking-tight">
                                    WorkScheduler
                                </h1>
                                <p className="text-sm text-muted-foreground">
                                    Project Management Platform
                                </p>
                            </div>
                        </div>
                        <Button onClick={handleCreateProject}>
                            <Plus className="w-4 h-4 mr-2" />
                            New Project
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-6 py-8">
                {/* Page Title */}
                <div className="mb-8">
                    <h2 className="text-3xl font-bold tracking-tight mb-2">
                        Projects
                    </h2>
                    <p className="text-muted-foreground">
                        Select a project to view timeline and manage tasks
                    </p>
                </div>

                {/* Projects Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <Card
                            key={project.id}
                            className="cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02]"
                            onClick={() => handleProjectClick(project.id)}
                        >
                            <CardHeader>
                                <div className="flex items-start justify-between gap-2 mb-2">
                                    <div className="flex items-center gap-2">
                                        <FolderKanban className="w-5 h-5 text-primary" />
                                        <Badge
                                            variant={getStatusBadgeVariant(
                                                project.status,
                                            )}
                                        >
                                            {project.status
                                                .split("-")
                                                .map(
                                                    (word) =>
                                                        word
                                                            .charAt(0)
                                                            .toUpperCase() +
                                                        word.slice(1),
                                                )
                                                .join(" ")}
                                        </Badge>
                                    </div>
                                </div>
                                <CardTitle className="text-xl">
                                    {project.name}
                                </CardTitle>
                                <CardDescription>
                                    {project.description}
                                </CardDescription>
                            </CardHeader>

                            <CardContent>
                                <div className="space-y-4">
                                    {/* Progress */}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-1.5 text-muted-foreground">
                                                <TrendingUp className="w-3.5 h-3.5" />
                                                <span>Progress</span>
                                            </div>
                                            <span className="font-semibold">
                                                {project.progress}%
                                            </span>
                                        </div>
                                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-primary transition-all"
                                                style={{
                                                    width: `${project.progress}%`,
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* Metadata */}
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Clock className="w-3.5 h-3.5" />
                                            <span>
                                                {formatDate(project.startDate)}{" "}
                                                - {formatDate(project.endDate)}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Calendar className="w-3.5 h-3.5" />
                                            <span>
                                                {project.taskCount} tasks
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-muted-foreground col-span-2">
                                            <Users className="w-3.5 h-3.5" />
                                            <span>
                                                {project.teamSize} team members
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {/* Add New Project Card */}
                    <Card
                        className="cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] border-dashed"
                        onClick={handleCreateProject}
                    >
                        <CardContent className="flex flex-col items-center justify-center h-full min-h-[280px] text-center p-6">
                            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                                <Plus className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <h3 className="font-semibold text-lg mb-2">
                                Create New Project
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Start a new project and organize your work
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
