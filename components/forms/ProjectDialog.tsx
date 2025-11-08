import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ProjectForm } from "./ProjectForm";
import { useAppStore, type Project } from "@/store/useAppStore";
import type { ProjectFormData } from "@/lib/validations";
import { toast } from "sonner";

interface ProjectDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    project?: Project;
    onSuccess?: (project: Project) => void;
}

export function ProjectDialog({
    open,
    onOpenChange,
    project,
    onSuccess,
}: ProjectDialogProps) {
    const addProject = useAppStore((state) => state.addProject);
    const updateProject = useAppStore((state) => state.updateProject);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (data: ProjectFormData) => {
        setIsSubmitting(true);
        try {
            if (project) {
                // Update existing project
                updateProject(project.id, data);
                toast.success("Project updated successfully");
                onSuccess?.(project);
            } else {
                // Create new project
                const newProject = addProject(data);
                toast.success("Project created successfully");
                onSuccess?.(newProject);
            }
            onOpenChange(false);
        } catch (error) {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>
                        {project ? "Edit Project" : "Create New Project"}
                    </DialogTitle>
                    <DialogDescription>
                        {project
                            ? "Update the project details below."
                            : "Fill in the details to create a new project."}
                    </DialogDescription>
                </DialogHeader>
                <ProjectForm
                    project={project}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                    isSubmitting={isSubmitting}
                />
            </DialogContent>
        </Dialog>
    );
}
