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
import { Progress } from "@/components/ui/progress";
import type { Control } from "react-hook-form";
import type { TaskFormData } from "@/lib/validations";

interface ProgressFieldProps {
    control: Control<TaskFormData>;
    isSubmitting?: boolean;
    isMilestone: boolean;
}

export function ProgressField({
    control,
    isSubmitting,
    isMilestone,
}: ProgressFieldProps) {
    if (isMilestone) return null;

    return (
        <FormField
            control={control}
            name="percent"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Progress *</FormLabel>
                    <FormControl>
                        <div className="space-y-2">
                            <Input
                                type="number"
                                min="0"
                                max="100"
                                step="1"
                                placeholder="0"
                                value={
                                    field.value !== undefined
                                        ? Math.round(field.value * 100)
                                        : ""
                                }
                                onChange={(e) => {
                                    const value = e.target.value
                                        ? parseFloat(e.target.value) / 100
                                        : 0;
                                    field.onChange(value);
                                }}
                                disabled={isSubmitting}
                            />
                            <Progress
                                value={Math.round((field.value ?? 0) * 100)}
                                className="h-2"
                            />
                        </div>
                    </FormControl>
                    <FormDescription>
                        Enter a value between 0 and 100
                    </FormDescription>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
