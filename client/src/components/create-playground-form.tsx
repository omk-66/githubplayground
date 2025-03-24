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
} from "@/components/ui/select"
import { z } from "zod";
import {
    Dialog,
    DialogClose,
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

// Define the Zod schema
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

    isFeatured: z.boolean().default(false), // Optional: Add if needed
});

// Infer the type of the schema for use in your form
export type PlaygroundFormValues = z.infer<typeof playgroundFormSchema>;

export default function PlaygroundForm() {
    // Initialize the form
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

    // Define a submit handler
    function onSubmit(values: PlaygroundFormValues) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log("Form values submitted:", values);
    }

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
                                            <Input placeholder="My Playground" {...field} />
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
                                            {/* <select
                                                {...field}
                                                className="w-full p-2 border rounded"
                                            >
                                                <option value="public">Public</option>
                                                <option value="private">Private</option>
                                            </select> */}
                                            <Select {...field}>
                                                <SelectTrigger className="w-[180px]">
                                                    <SelectValue placeholder="Select a type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>Fruits</SelectLabel>
                                                        <SelectItem value="apple">Public</SelectItem>
                                                        <SelectItem value="banana">Private</SelectItem>
                                                        {/* <SelectItem value="blueberry">Blueberry</SelectItem>
                                                        <SelectItem value="grapes">Grapes</SelectItem>
                                                        <SelectItem value="pineapple">Pineapple</SelectItem> */}
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
                                                placeholder="Add tags (comma-separated)"
                                                {...field}
                                                onChange={(e) => {
                                                    const tags = e.target.value
                                                        .split(",")
                                                        .map((tag) => tag.trim());
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

                            {/* Is Featured (Optional) */}
                            <FormField
                                control={form.control}
                                name="isFeatured"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Featured</FormLabel>
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Mark this playground as featured.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <DialogFooter className="sm:justify-start">
                                {form.formState.isValid ? (
                                    <DialogClose>
                                        <Button type="submit" variant="secondary">
                                            Save Playground
                                        </Button>
                                    </DialogClose>
                                ) : (
                                    <Button type="submit" variant="secondary">
                                        Save Playground
                                    </Button>
                                )}
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </Form>
        </div>
    );
}