// import UserNavbar from "@/components/sections/navbar/user-navbar";
// import { AppSidebar } from "@/components/app-sidebar";
// import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/user/_layout")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="container mx-auto w-[80%]">
      {/* <UserNavbar /> */}
      <Outlet />

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
