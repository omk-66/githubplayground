import { z } from "zod";

export const playgroundFormSchema = z.object({
    playgroundName: z
        .string()
        .min(2, { message: "Playground name must be at least 2 characters long." })
        .max(50, { message: "Playground name cannot exceed 50 characters." })
        .refine((value) => value.trim().length > 0, {
            message: "Playground name cannot be empty or contain only whitespace.",
        }),

    playgroundDescription: z
        .string()
        .min(10, { message: "Description must be at least 10 characters long." })
        .max(200, { message: "Description cannot exceed 200 characters." })
        .refine((value) => value.trim().length > 0, {
            message: "Description cannot be empty or contain only whitespace.",
        }),

    visibility: z.enum(["public", "private"]).default("public"),

    tags: z
        .array(z.string().min(1).max(20))
        .max(5, { message: "You can add up to 5 tags." })
        .optional(),

    isFeatured: z.boolean().default(false),
});

export type PlaygroundFormValues = z.infer<typeof playgroundFormSchema>;