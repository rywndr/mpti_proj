"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Loader2, Calendar, CheckCircle2, Users } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAppStore, type Project } from "@/store/useAppStore";
import { useProjectStats } from "@/hooks/useProjectStats";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { NewProjectCard } from "@/components/projects/NewProjectCard";
import { AppHeader } from "@/components/layout/AppHeader";
import { ProjectDialog } from "@/components/forms/ProjectDialog";
import { DeleteConfirmDialog } from "@/components/forms/DeleteConfirmDialog";
import { useSession } from "@/lib/auth-client";

export default function HomePage() {
    const router = useRouter();
    const { data: session, isPending } = useSession();
    const projects = useAppStore((state) => state.projects);
    const tasksMap = useAppStore((state) => state.tasksMap);
    const deleteProject = useAppStore((state) => state.deleteProject);

    const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | undefined>();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deletingProject, setDeletingProject] = useState<
        Project | undefined
    >();

    // Calculate project statistics (memoized)
    const projectStats = useProjectStats(projects, tasksMap);

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
        setEditingProject(undefined);
        setIsProjectDialogOpen(true);
    };

    /**
     * Handle edit project
     */
    const handleEditProject = (e: React.MouseEvent, project: Project) => {
        e.stopPropagation();
        setEditingProject(project);
        setIsProjectDialogOpen(true);
    };

    /**
     * Handle delete project
     */
    const handleDeleteProject = (e: React.MouseEvent, project: Project) => {
        e.stopPropagation();
        setDeletingProject(project);
        setDeleteDialogOpen(true);
    };

    /**
     * Confirm delete project
     */
    const confirmDeleteProject = () => {
        if (deletingProject) {
            deleteProject(deletingProject.id);
            toast.success(
                `Project "${deletingProject.name}" deleted successfully`,
            );
            setDeletingProject(undefined);
        }
    };

    /**
     * Handle successful project creation/edit
     */
    const handleProjectSuccess = (project: Project) => {
        if (!editingProject) {
            // Navigate to newly created project
            router.push(`/projects/${project.id}`);
        }
    };

    // Show loading state while checking auth
    if (isPending) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <AppHeader />

            {/* Main Content */}
            <main className="container mx-auto px-6 py-8">
                {!session?.user ? (
                    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
                        <div className="max-w-4xl w-full">
                            {/* Hero Section */}
                            <div className="text-center mb-12">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6">
                                    <Calendar className="w-8 h-8 text-primary" />
                                </div>
                                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                                    Welcome to SyncPath
                                </h1>
                                <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                                    Your powerful project management platform
                                    for timeline visualization and task
                                    coordination
                                </p>
                                <div className="flex items-center justify-center gap-4">
                                    <Button
                                        onClick={() => router.push("/auth")}
                                        size="lg"
                                        className="h-12 px-8"
                                    >
                                        Get Started
                                    </Button>
                                    <Button
                                        onClick={() => router.push("/auth")}
                                        size="lg"
                                        variant="outline"
                                        className="h-12 px-8"
                                    >
                                        Sign In
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Page Title */}
                        <div className="mb-8 flex items-center justify-between">
                            <div>
                                <h2 className="text-3xl font-bold tracking-tight mb-2">
                                    Projects
                                </h2>
                                <p className="text-muted-foreground">
                                    Select a project to view timeline and manage
                                    tasks
                                </p>
                            </div>
                            <Button onClick={handleCreateProject}>
                                <Plus className="w-4 h-4 mr-2" />
                                New Project
                            </Button>
                        </div>

                        {/* Projects Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {projects.map((project) => {
                                const stats = projectStats[project.id] || {
                                    taskCount: 0,
                                };
                                return (
                                    <ProjectCard
                                        key={project.id}
                                        project={project}
                                        taskCount={stats.taskCount}
                                        onProjectClick={handleProjectClick}
                                        onEdit={handleEditProject}
                                        onDelete={handleDeleteProject}
                                    />
                                );
                            })}

                            {/* Add New Project Card */}
                            <NewProjectCard onClick={handleCreateProject} />
                        </div>

                        {/* Dialogs */}
                        <ProjectDialog
                            open={isProjectDialogOpen}
                            onOpenChange={setIsProjectDialogOpen}
                            project={editingProject}
                            onSuccess={handleProjectSuccess}
                        />

                        <DeleteConfirmDialog
                            open={deleteDialogOpen}
                            onOpenChange={setDeleteDialogOpen}
                            onConfirm={confirmDeleteProject}
                            title="Delete Project"
                            itemName={deletingProject?.name}
                            description={
                                deletingProject
                                    ? `This will permanently delete "${deletingProject.name}" and all its tasks. This action cannot be undone.`
                                    : undefined
                            }
                        />
                    </>
                )}
            </main>
        </div>
    );
}
