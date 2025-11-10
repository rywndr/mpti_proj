"use client";

import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { Control } from "react-hook-form";
import type { TaskFormData } from "@/lib/validations";
import { FormDateField } from "./FormDateField";

interface DateRangeSectionProps {
    control: Control<TaskFormData>;
    isSubmitting?: boolean;
    onDurationChange: (duration: number) => void;
}

export function DateRangeSection({
    control,
    isSubmitting,
    onDurationChange,
}: DateRangeSectionProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Start Date */}
            <FormField
                control={control}
                name="start"
                render={({ field }) => (
                    <FormDateField
                        field={field}
                        label="Start Date *"
                        disabled={isSubmitting}
                    />
                )}
            />

            {/* End Date */}
            <FormField
                control={control}
                name="end"
                render={({ field }) => (
                    <FormDateField
                        field={field}
                        label="End Date *"
                        disabled={isSubmitting}
                    />
                )}
            />

            {/* Duration */}
            <FormField
                control={control}
                name="duration"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Duration (days)</FormLabel>
                        <FormControl>
                            <Input
                                type="number"
                                min={1}
                                disabled={isSubmitting}
                                {...field}
                                value={field.value || ""}
                                onChange={(e) => {
                                    const value = parseInt(e.target.value);
                                    if (!isNaN(value) && value > 0) {
                                        field.onChange(value);
                                        onDurationChange(value);
                                    }
                                }}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
}
