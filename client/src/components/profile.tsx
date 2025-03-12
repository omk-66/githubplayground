// import { useState } from "react";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    // DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    // DropdownMenuSub,
    // DropdownMenuSubContent,
    // DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AvatarFallback, AvatarImage, Avatar } from "./ui/avatar";
import { signOut, useSession } from "../../lib/auth-client";
import { useRouter } from "@tanstack/react-router";


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
}

const Profile = ({ githubUser }: ProfileProps) => {
    const { data } = useSession();
    const router = useRouter();
    const handlesignout = async () => {
        try {
            await signOut({
                fetchOptions: {
                    onSuccess: () => {
                        router.navigate({ to: "/" })
                    },
                },
            });
        } catch (error) {
            console.error("Sign-in failed:", error);
            // Handle error gracefully, e.g., display a message to the user
        }
    };
    return (
        <nav className="shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">
                                    <Avatar>
                                        <AvatarImage src={githubUser?.avatar_url} alt={githubUser?.login} />
                                        <AvatarFallback>
                                            {githubUser ? githubUser.login.charAt(0).toUpperCase() : "U"}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    <DropdownMenuItem>
                                        Name
                                        <DropdownMenuShortcut>{data?.user.name}</DropdownMenuShortcut>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        Followers
                                        <DropdownMenuShortcut>{githubUser?.followers}</DropdownMenuShortcut>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        Followings
                                        <DropdownMenuShortcut>{githubUser?.following}</DropdownMenuShortcut>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        Public Repos
                                        <DropdownMenuShortcut>{githubUser?.public_repos}</DropdownMenuShortcut>
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <div>
                                        <div>
                                            <Avatar>
                                                <AvatarImage src={githubUser?.avatar_url} alt={githubUser?.login} />
                                                <AvatarFallback>
                                                    {githubUser ? githubUser.login.charAt(0).toUpperCase() : "U"}
                                                </AvatarFallback>
                                            </Avatar>
                                        </div>
                                        <div>
                                            {data?.user.email}
                                        </div>
                                    </div>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <Button variant={"destructive"} className="w-full" onClick={handlesignout}>Log out</Button>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Profile;

