import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    // DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useState } from "react";
import { playgroundFormSchema, PlaygroundFormValues } from "@/type/playground.type";

// Define the Zod schema
// export const playgroundFormSchema = z.object({
//     playgroundName: z
//         .string()
//         .min(2, { message: "Playground name must be at least 2 characters long." })
//         .max(50, { message: "Playground name cannot exceed 50 characters." })
//         .refine((value) => value.trim().length > 0, {
//             message: "Playground name cannot be empty or contain only whitespace.",
//         }),

//     playgroundDescription: z
//         .string()
//         .min(10, { message: "Description must be at least 10 characters long." })
//         .max(200, { message: "Description cannot exceed 200 characters." })
//         .refine((value) => value.trim().length > 0, {
//             message: "Description cannot be empty or contain only whitespace.",
//         }),

//     visibility: z.enum(["public", "private"]).default("public"),

//     tags: z
//         .array(z.string().min(1).max(20))
//         .max(5, { message: "You can add up to 5 tags." })
//         .optional(),

//     isFeatured: z.boolean().default(false),
// });

// export type PlaygroundFormValues = z.infer<typeof playgroundFormSchema>;

export default function PlaygroundForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const form = useForm<PlaygroundFormValues>({
        resolver: zodResolver(playgroundFormSchema),
        defaultValues: {
            playgroundName: "",
            playgroundDescription: "",
            visibility: "public",
            tags: [],
            isFeatured: false,
        },
    });

    const onSubmit = async (values: PlaygroundFormValues) => {
        setIsSubmitting(true);
        try {
            const response = await fetch('http://localhost:3000/api/addPlayground', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Required for better-auth cookies
                body: JSON.stringify(values)
            });

            // Handle HTTP errors
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                if (response.status === 401) {
                    // Handle unauthorized (redirect to login)
                    window.location.href = '/auth/login';
                    return;
                }
                throw new Error(errorData.message || 'Request failed');
            }

            // Handle success
            const data = await response.json();
            toast.success(data.message || 'Playground created!');
            form.reset();

        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Creation failed');
            console.error('Submission error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };
    return (
        <div>
            <Form {...form}>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="cursor-pointer">Create Playground</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Create Playground</DialogTitle>
                            <DialogDescription>
                                Create a new playground by providing a name and description.
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            {/* Playground Name */}
                            <FormField
                                control={form.control}
                                name="playgroundName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Playground Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="My Playground"
                                                {...field}
                                                disabled={isSubmitting}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Choose a name for your playground.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Playground Description */}
                            <FormField
                                control={form.control}
                                name="playgroundDescription"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Describe your playground..."
                                                {...field}
                                                disabled={isSubmitting}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Provide a detailed description of your playground.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Visibility */}
                            <FormField
                                control={form.control}
                                name="visibility"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Visibility</FormLabel>
                                        <FormControl>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                                disabled={isSubmitting}
                                            >
                                                <SelectTrigger className="w-[180px]">
                                                    <SelectValue placeholder="Select visibility" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>Visibility</SelectLabel>
                                                        <SelectItem value="public">Public</SelectItem>
                                                        <SelectItem value="private">Private</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormDescription>
                                            Set the visibility of your playground.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Tags */}
                            <FormField
                                control={form.control}
                                name="tags"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tags</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="react, typescript, nextjs"
                                                disabled={isSubmitting}
                                                onChange={(e) => {
                                                    const tags = e.target.value
                                                        .split(",")
                                                        .map((tag) => tag.trim())
                                                        .filter(Boolean);
                                                    field.onChange(tags);
                                                }}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Add up to 5 tags to categorize your playground.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Is Featured */}
                            <FormField
                                control={form.control}
                                name="isFeatured"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                disabled={isSubmitting}
                                            />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel>Featured</FormLabel>
                                            <FormDescription>
                                                Mark this playground as featured.
                                            </FormDescription>
                                        </div>
                                    </FormItem>
                                )}
                            />

                            <DialogFooter className="sm:justify-start">
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center">
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Creating...
                                        </span>
                                    ) : "Create Playground"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </Form>
        </div>
    );
}