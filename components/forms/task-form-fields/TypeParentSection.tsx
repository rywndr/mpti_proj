"use client";

import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import type { Control } from "react-hook-form";
import type { TaskFormData } from "@/lib/validations";
import type { Task } from "@/types";

interface TypeParentSectionProps {
    control: Control<TaskFormData>;
    isSubmitting?: boolean;
    isGroupWithChildren: boolean;
    parentId?: number;
    potentialParents: Task[];
}

export function TypeParentSection({
    control,
    isSubmitting,
    isGroupWithChildren,
    parentId,
    potentialParents,
}: TypeParentSectionProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Type */}
            <FormField
                control={control}
                name="type"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Type *</FormLabel>
                        <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            disabled={isSubmitting || isGroupWithChildren}
                        >
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="task">Task</SelectItem>
                                <SelectItem value="group">Group</SelectItem>
                                <SelectItem value="milestone">
                                    Milestone
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        {isGroupWithChildren && (
                            <FormDescription className="text-yellow-600">
                                Cannot change type: This group has child tasks
                            </FormDescription>
                        )}
                        <FormMessage />
                    </FormItem>
                )}
            />

            {/* Parent Group */}
            <FormField
                control={control}
                name="parent"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Parent Group</FormLabel>
                        <Select
                            onValueChange={(value) =>
                                field.onChange(
                                    value === "undefined"
                                        ? undefined
                                        : parseInt(value, 10),
                                )
                            }
                            defaultValue={
                                field.value !== undefined
                                    ? field.value.toString()
                                    : "undefined"
                            }
                            disabled={isSubmitting || parentId !== undefined}
                        >
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="None (top-level)" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="undefined">
                                    None (top-level)
                                </SelectItem>
                                {potentialParents.map((parent) => (
                                    <SelectItem
                                        key={parent.id}
                                        value={parent.id.toString()}
                                    >
                                        {parent.text}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormDescription>
                            Optional: Select a group to nest this task under
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
}
