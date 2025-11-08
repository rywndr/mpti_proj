"use client";

import { FormField } from "@/components/ui/form";
import type { Control } from "react-hook-form";
import type { TaskFormData } from "@/lib/validations";
import { FormDateField } from "./FormDateField";

interface DateRangeSectionProps {
    control: Control<TaskFormData>;
    isSubmitting?: boolean;
}

export function DateRangeSection({
    control,
    isSubmitting,
}: DateRangeSectionProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>
    );
}
