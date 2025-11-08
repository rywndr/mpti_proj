"use client";

import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { Control } from "react-hook-form";
import type { TaskFormData } from "@/lib/validations";

interface AssigneeCostSectionProps {
    control: Control<TaskFormData>;
    isSubmitting?: boolean;
    taskType: "task" | "group" | "milestone";
    isMilestone: boolean;
}

export function AssigneeCostSection({
    control,
    isSubmitting,
    taskType,
    isMilestone,
}: AssigneeCostSectionProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Assignee */}
            <FormField
                control={control}
                name="assignee"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Assignee</FormLabel>
                        <FormControl>
                            <Input
                                placeholder="Enter assignee name"
                                {...field}
                                disabled={isSubmitting}
                            />
                        </FormControl>
                        <FormDescription>
                            Person or team responsible for this task
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {/* Cost */}
            {!isMilestone && (
                <FormField
                    control={control}
                    name="cost"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Cost (IDR)</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    placeholder="0"
                                    value={field.value ?? ""}
                                    onChange={(e) => {
                                        const value = e.target.value
                                            ? parseFloat(e.target.value)
                                            : undefined;
                                        field.onChange(value);
                                    }}
                                    disabled={isSubmitting || taskType === "group"}
                                />
                            </FormControl>
                            <FormDescription>
                                {taskType === "group"
                                    ? "Auto-calculated from child tasks"
                                    : "Estimated cost in Indonesian Rupiah"}
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            )}
        </div>
    );
}
