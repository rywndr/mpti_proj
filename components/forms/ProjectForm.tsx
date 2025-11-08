import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { projectSchema, type ProjectFormData } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Project } from "@/store/useAppStore";

interface ProjectFormProps {
    project?: Project;
    onSubmit: (data: ProjectFormData) => void;
    onCancel: () => void;
    isSubmitting?: boolean;
}

export function ProjectForm({
    project,
    onSubmit,
    onCancel,
    isSubmitting,
}: ProjectFormProps) {
    const defaultEndDate = useMemo(() => {
        const date = new Date();
        date.setDate(date.getDate() + 30);
        return date;
    }, []);

    const form = useForm<ProjectFormData>({
        resolver: zodResolver(projectSchema),
        defaultValues: {
            name: project?.name || "",
            description: project?.description || "",
            startDate: project?.startDate || new Date(),
            endDate: project?.endDate || defaultEndDate,
        },
    });

    const handleSubmit = (data: ProjectFormData) => {
        onSubmit(data);
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-6"
            >
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Project Name *</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter project name"
                                    {...field}
                                    disabled={isSubmitting}
                                />
                            </FormControl>
                            <FormDescription>
                                A clear, descriptive name for your project
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Enter project description"
                                    className="resize-none"
                                    rows={4}
                                    {...field}
                                    disabled={isSubmitting}
                                />
                            </FormControl>
                            <FormDescription>
                                Provide a brief overview of the project goals
                                and scope
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="startDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Start Date *</FormLabel>
                                <FormControl>
                                    <Input
                                        type="date"
                                        {...field}
                                        value={
                                            field.value instanceof Date
                                                ? field.value
                                                      .toISOString()
                                                      .split("T")[0]
                                                : ""
                                        }
                                        onChange={(e) => {
                                            const date = e.target.value
                                                ? new Date(e.target.value)
                                                : new Date();
                                            field.onChange(date);
                                        }}
                                        disabled={isSubmitting}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="endDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>End Date *</FormLabel>
                                <FormControl>
                                    <Input
                                        type="date"
                                        {...field}
                                        value={
                                            field.value instanceof Date
                                                ? field.value
                                                      .toISOString()
                                                      .split("T")[0]
                                                : ""
                                        }
                                        onChange={(e) => {
                                            const date = e.target.value
                                                ? new Date(e.target.value)
                                                : new Date();
                                            field.onChange(date);
                                        }}
                                        disabled={isSubmitting}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting
                            ? "Saving..."
                            : project
                              ? "Update Project"
                              : "Create Project"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
