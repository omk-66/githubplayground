"use client";

import { useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AvatarFallback, AvatarImage, Avatar } from "./ui/avatar";
import { signOut, useSession } from "../../lib/auth-client";
import { useRouter } from "@tanstack/react-router";
import { Skeleton } from "./ui/skeleton";
import { toast } from "sonner";

interface GitHubUser {
    login: string;
    avatar_url: string;
    public_repos: number;
    followers: number;
    following: number;
    created_at: string;
}

interface ProfileProps {
    githubUser: GitHubUser | null;
    isLoading?: boolean;
    error?: string | null;
}

const Profile = ({ githubUser, isLoading = false, error = null }: ProfileProps) => {
    const { data } = useSession();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    const handleSignOut = async () => {
        const toastId = toast.loading("Signing out...");
        try {
            await signOut({
                fetchOptions: {
                    onSuccess: () => {
                        toast.success("Signed out successfully", {
                            id: toastId,
                            description: "You have been logged out",
                        });
                        router.navigate({ to: "/" });
                        setIsOpen(false); // Close dropdown after sign out
                    },
                },
            });
        } catch (error) {
            console.error("Sign-out failed:", error);
            toast.error("Sign out failed", {
                id: toastId,
                description: "Please try again",
            });
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center space-x-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-[100px]" />
                </div>
            </div>
        );
    }

    if (error) {
        toast.error("Error loading profile data");
        return (
            <div className="text-red-500 text-sm p-2 border border-red-200 rounded">
                Error loading profile
            </div>
        );
    }

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <button
                    className="rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsOpen(!isOpen);
                    }}
                >
                    <Avatar className="h-10 w-10 cursor-pointer hover:ring-2 hover:ring-primary transition-all">
                        <AvatarImage
                            src={githubUser?.avatar_url}
                            alt={githubUser?.login || "User avatar"}
                        />
                        <AvatarFallback>
                            {githubUser
                                ? githubUser.login.charAt(0).toUpperCase()
                                : data?.user.name?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                    </Avatar>
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                className="w-56 z-[100] bg-background shadow-lg rounded-md border border-border"
                align="end"
                sideOffset={8}
                onInteractOutside={(e) => {
                    // Prevent closing when clicking on the trigger
                    const target = e.target as HTMLElement;
                    if (target.closest('[data-radix-dropdown-menu-trigger]')) {
                        e.preventDefault();
                    }
                }}
            >
                <DropdownMenuLabel className="px-4 py-2 font-medium text-foreground">
                    My Account
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border" />

                <DropdownMenuGroup className="px-2 py-1">
                    <DropdownMenuItem className="flex justify-between items-center px-2 py-1.5 rounded text-sm hover:bg-accent">
                        <span>Name</span>
                        <span className="font-medium">
                            {data?.user.name || "N/A"}
                        </span>
                    </DropdownMenuItem>

                    {githubUser && (
                        <>
                            <DropdownMenuItem className="flex justify-between items-center px-2 py-1.5 rounded text-sm hover:bg-accent">
                                <span>Followers</span>
                                <span className="font-medium">
                                    {githubUser.followers.toLocaleString()}
                                </span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex justify-between items-center px-2 py-1.5 rounded text-sm hover:bg-accent">
                                <span>Following</span>
                                <span className="font-medium">
                                    {githubUser.following.toLocaleString()}
                                </span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex justify-between items-center px-2 py-1.5 rounded text-sm hover:bg-accent">
                                <span>Public Repos</span>
                                <span className="font-medium">
                                    {githubUser.public_repos.toLocaleString()}
                                </span>
                            </DropdownMenuItem>
                        </>
                    )}
                </DropdownMenuGroup>

                <DropdownMenuSeparator className="bg-border" />

                <DropdownMenuItem className="flex items-center gap-3 px-2 py-2 rounded text-sm hover:bg-accent">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={githubUser?.avatar_url} />
                        <AvatarFallback>
                            {data?.user.name?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="font-medium">{data?.user.name || "User"}</span>
                        <span className="text-xs text-muted-foreground">
                            {data?.user.email || "No email"}
                        </span>
                    </div>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-border" />

                <DropdownMenuItem asChild>
                    <button
                        onClick={handleSignOut}
                        className="w-full text-left px-2 py-1.5 rounded text-sm text-destructive hover:bg-red-50/50 dark:hover:bg-red-900/20 flex items-center gap-2"
                    >
                        <span>Log out</span>
                    </button>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default Profile;