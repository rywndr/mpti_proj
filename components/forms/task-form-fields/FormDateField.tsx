import {
    FormControl,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { ControllerRenderProps, FieldValues, Path } from "react-hook-form";

interface FormDateFieldProps<TFieldValues extends FieldValues> {
    field: ControllerRenderProps<TFieldValues, Path<TFieldValues>>;
    label: string;
    disabled?: boolean;
}

export function FormDateField<TFieldValues extends FieldValues>({
    field,
    label,
    disabled,
}: FormDateFieldProps<TFieldValues>) {
    const formatDateForInput = (date: Date | undefined): string => {
        if (!date || !(date instanceof Date)) return "";
        return date.toISOString().split("T")[0];
    };

    const handleDateChange = (value: string) => {
        const date = value ? new Date(value) : new Date();
        field.onChange(date);
    };

    return (
        <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
                <Input
                    type="date"
                    value={formatDateForInput(field.value as Date)}
                    onChange={(e) => handleDateChange(e.target.value)}
                    disabled={disabled}
                />
            </FormControl>
            <FormMessage />
        </FormItem>
    );
}
