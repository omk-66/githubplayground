// import UserNavbar from "@/components/sections/navbar/user-navbar";
// import { AppSidebar } from "@/components/app-sidebar";
// import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
// import UserNavbar from "@/components/sections/navbar/user-navbar";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner"


export const Route = createFileRoute("/user/_layout")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="container mx-auto w-[80%]">
      {/* <UserNavbar /> */}
      <Outlet />
      <Toaster />

      {/* <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger />
        <Outlet />
      </main>
    </SidebarProvider> */}
    </div>
  );
}
