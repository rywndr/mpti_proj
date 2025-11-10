import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ProjectForm } from "./ProjectForm";
import {
    useCreateProject,
    useUpdateProject,
    type Project,
} from "@/hooks/useProjects";
import type { ProjectFormData } from "@/lib/validations";

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
    const createProject = useCreateProject();
    const updateProject = useUpdateProject();

    const handleSubmit = async (data: ProjectFormData) => {
        try {
            if (project) {
                // Update existing project
                const updatedProject = await updateProject.mutateAsync({
                    id: project.id,
                    data,
                });
                onSuccess?.(updatedProject);
            } else {
                // Create new project
                const newProject = await createProject.mutateAsync(data);
                onSuccess?.(newProject);
            }
            onOpenChange(false);
        } catch (error) {
            console.error("Project operation failed:", error);
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
                    isSubmitting={
                        createProject.isPending || updateProject.isPending
                    }
                />
            </DialogContent>
        </Dialog>
    );
}
