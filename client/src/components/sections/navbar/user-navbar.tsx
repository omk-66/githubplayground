import Navigation from "../../ui/navigation";
import { Button } from "../../ui/button";
import {
    Navbar as NavbarComponent,
    NavbarLeft,
    NavbarRight,
} from "../../ui/navbar";
import { Sheet, SheetContent, SheetTrigger } from "../../ui/sheet";
import { Menu } from "lucide-react";
import LaunchUI from "../../logos/launch-ui";
import Profile from "@/components/profile";
import { useGithubUserStore } from "@/store/githubUser.store";
import { useEffect } from "react";
import { useSession } from "../../../../lib/auth-client";

export default function UserNavbar() {
    const { data } = useSession();
    const { fetchGithubUser, githubUser, error } = useGithubUserStore();
    useEffect(() => {
        if (data?.user?.name) {
            fetchGithubUser(data.user.name);
        }
    }, [data, fetchGithubUser]);
    return (
        <header className="sticky top-0 z-50 -mb-4 px-4 pb bg-background ">
            {error && (
                <div className="text-red-500 text-sm">
                    Failed to load user data
                </div>
            )}
            <div className="fade-bottom absolute left-0 h-24 w-full bg-background/15 backdrop-blur-lg"></div>
            <div className="relative mx-auto max-w-container">
                <NavbarComponent>
                    <NavbarLeft>
                        <a
                            href="/"
                            className="flex items-center gap-2 text-xl font-bold"
                        >
                            <LaunchUI />
                            Launch UI
                        </a>
                        <Navigation />
                    </NavbarLeft>
                    <NavbarRight>
                        {/* <Button>
                            <a href="/auth/login" className="hidden text-sm md:block">
                                Sign in
                            </a>
                        </Button>
                        <Button variant="default" asChild>
                            <a href="/">Get Started</a>
                        </Button> */}
                        <div className="border border-red-700">
                            <Profile githubUser={githubUser} />
                        </div>
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="shrink-0 md:hidden"
                                >
                                    <Menu className="h-5 w-5" />
                                    <span className="sr-only">Toggle navigation menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right">
                                <nav className="grid gap-6 text-lg font-medium">
                                    <a
                                        href="/"
                                        className="flex items-center gap-2 text-xl font-bold"
                                    >
                                        <span>Launch UI</span>
                                    </a>
                                    <a
                                        href="/"
                                        className="text-muted-foreground hover:text-foreground"
                                    >
                                        Getting Started
                                    </a>
                                    <a
                                        href="/"
                                        className="text-muted-foreground hover:text-foreground"
                                    >
                                        Components
                                    </a>
                                    <a
                                        href="/"
                                        className="text-muted-foreground hover:text-foreground"
                                    >
                                        Documentation
                                    </a>
                                </nav>
                            </SheetContent>
                        </Sheet>
                    </NavbarRight>
                </NavbarComponent>
            </div>
        </header>
    );
}
