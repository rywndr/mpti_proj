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
import { Button } from "@/components/ui/button";
import { X, Plus } from "lucide-react";
import type { Control, UseFieldArrayReturn } from "react-hook-form";
import type { TaskFormData } from "@/lib/validations";
import type { Task } from "@/types";

interface DependenciesSectionProps {
    control: Control<TaskFormData>;
    fieldArray: UseFieldArrayReturn<TaskFormData, "links", "id">;
    isSubmitting?: boolean;
    potentialDependencies: Task[];
    getTaskNumber: (taskId: number) => string;
}

export function DependenciesSection({
    control,
    fieldArray,
    isSubmitting,
    potentialDependencies,
    getTaskNumber,
}: DependenciesSectionProps) {
    const { fields, append, remove } = fieldArray;

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <FormLabel>Task Dependencies</FormLabel>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({ target: 0, type: "FS" })}
                    disabled={isSubmitting}
                >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Dependency
                </Button>
            </div>

            {fields.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                    No dependencies added yet
                </p>
            ) : (
                <div className="space-y-2">
                    {fields.map((field, index) => (
                        <div
                            key={field.id}
                            className="flex items-center gap-2 p-3 border rounded-lg"
                        >
                            {/* Target Task Select */}
                            <FormField
                                control={control}
                                name={`links.${index}.target`}
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <Select
                                            onValueChange={(value) =>
                                                field.onChange(parseInt(value, 10))
                                            }
                                            defaultValue={field.value?.toString() ?? ""}
                                            disabled={isSubmitting}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select task" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {potentialDependencies.map((depTask) => (
                                                    <SelectItem
                                                        key={depTask.id}
                                                        value={depTask.id.toString()}
                                                    >
                                                        {getTaskNumber(depTask.id)}{" "}
                                                        {depTask.text}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Link Type Select */}
                            <FormField
                                control={control}
                                name={`links.${index}.type`}
                                render={({ field }) => (
                                    <FormItem className="w-32">
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            disabled={isSubmitting}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="FS">
                                                    Finish-Start
                                                </SelectItem>
                                                <SelectItem value="FF">
                                                    Finish-Finish
                                                </SelectItem>
                                                <SelectItem value="SS">
                                                    Start-Start
                                                </SelectItem>
                                                <SelectItem value="SF">
                                                    Start-Finish
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Remove Button */}
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => remove(index)}
                                disabled={isSubmitting}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            )}

            <FormDescription>
                Define which tasks must be completed before this task can start
            </FormDescription>
        </div>
    );
}
