"use client";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import type { Task } from "@/types";
import type { TaskFormData } from "@/lib/validations";
import { useTaskFormLogic } from "./hooks/useTaskFormLogic";
import {
    BasicInfoSection,
    TypeParentSection,
    DateRangeSection,
    StatusPrioritySection,
    AssigneeCostSection,
    ProgressField,
    DependenciesSection,
} from "./task-form-fields";

interface TaskFormProps {
    task?: Task;
    parentId?: number;
    tasks: Task[];
    onSubmit: (data: TaskFormData) => void;
    onCancel: () => void;
    isSubmitting?: boolean;
}

export function TaskForm({
    task,
    parentId,
    tasks,
    onSubmit,
    onCancel,
    isSubmitting,
}: TaskFormProps) {
    const {
        form,
        fieldArray,
        isGroupWithChildren,
        potentialParents,
        potentialDependencies,
        taskType,
        isMilestone,
        getTaskNumber,
        handleDurationChange,
    } = useTaskFormLogic({ task, parentId, tasks });

    const handleSubmit = (data: TaskFormData) => {
        onSubmit(data);
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-6"
            >
                <BasicInfoSection
                    control={form.control}
                    isSubmitting={isSubmitting}
                />

                <TypeParentSection
                    control={form.control}
                    isSubmitting={isSubmitting}
                    isGroupWithChildren={isGroupWithChildren}
                    parentId={parentId}
                    potentialParents={potentialParents}
                />

                <DateRangeSection
                    control={form.control}
                    isSubmitting={isSubmitting}
                    onDurationChange={handleDurationChange}
                />

                <StatusPrioritySection
                    control={form.control}
                    isSubmitting={isSubmitting}
                />

                <AssigneeCostSection
                    control={form.control}
                    isSubmitting={isSubmitting}
                    taskType={taskType}
                    isMilestone={isMilestone}
                />

                <ProgressField
                    control={form.control}
                    isSubmitting={isSubmitting}
                    isMilestone={isMilestone}
                />

                <DependenciesSection
                    control={form.control}
                    fieldArray={fieldArray}
                    isSubmitting={isSubmitting}
                    potentialDependencies={potentialDependencies}
                    getTaskNumber={getTaskNumber}
                />

                {/* Form Actions */}
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
                            : task
                              ? "Update Task"
                              : "Create Task"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
