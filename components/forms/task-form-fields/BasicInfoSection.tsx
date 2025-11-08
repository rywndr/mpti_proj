"use client";

import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Control } from "react-hook-form";
import type { TaskFormData } from "@/lib/validations";

interface BasicInfoSectionProps {
    control: Control<TaskFormData>;
    isSubmitting?: boolean;
}

export function BasicInfoSection({
    control,
    isSubmitting,
}: BasicInfoSectionProps) {
    return (
        <>
            {/* Task Name */}
            <FormField
                control={control}
                name="text"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Task Name *</FormLabel>
                        <FormControl>
                            <Input
                                placeholder="Enter task name"
                                {...field}
                                disabled={isSubmitting}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {/* Description */}
            <FormField
                control={control}
                name="description"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                            <Textarea
                                placeholder="Enter task description"
                                className="resize-none"
                                rows={3}
                                {...field}
                                disabled={isSubmitting}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </>
    );
}
