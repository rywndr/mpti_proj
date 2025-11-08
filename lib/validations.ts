import { z } from "zod";

/**
 * Task link validation schema for dependencies
 */
export const taskLinkSchema = z.object({
    target: z.number(),
    type: z.enum(["FS", "FF", "SS", "SF"]),
});

/**
 * Project validation schema
 */
export const projectSchema = z
    .object({
        name: z
            .string()
            .min(1, "Project name is required")
            .max(100, "Project name must be less than 100 characters"),
        description: z
            .string()
            .max(500, "Description must be less than 500 characters")
            .optional(),
        startDate: z.date({
            message: "Start date is required",
        }),
        endDate: z.date({
            message: "End date is required",
        }),
    })
    .refine((data) => data.endDate >= data.startDate, {
        message: "End date must be after or equal to start date",
        path: ["endDate"],
    });

export type ProjectFormData = z.infer<typeof projectSchema>;

/**
 * Task validation schema
 */
export const taskSchema = z
    .object({
        text: z
            .string()
            .min(1, "Task name is required")
            .max(100, "Task name must be less than 100 characters"),
        description: z
            .string()
            .max(1000, "Description must be less than 1000 characters")
            .optional(),
        start: z.date({
            message: "Start date is required",
        }),
        end: z.date({
            message: "End date is required",
        }),
        status: z.enum(["pending", "in-progress", "completed", "blocked"]),
        priority: z.enum(["low", "medium", "high", "critical"]),
        assignee: z
            .string()
            .max(100, "Assignee name must be less than 100 characters")
            .optional(),
        parent: z.number().optional(),
        type: z.enum(["task", "group", "milestone"]),
        cost: z.number().min(0, "Cost must be a positive number").optional(),
        percent: z
            .number()
            .min(0, "Progress must be at least 0%")
            .max(1, "Progress cannot exceed 100%"),
        links: z.array(taskLinkSchema).optional(),
    })
    .refine((data) => data.end >= data.start, {
        message: "End date must be after or equal to start date",
        path: ["end"],
    });

export type TaskFormData = z.infer<typeof taskSchema>;
