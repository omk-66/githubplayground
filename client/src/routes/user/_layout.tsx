import UserNavbar from "@/components/sections/navbar/user-navbar";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/user/_layout")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="container mx-auto w-[80%]">
      <UserNavbar />
      <Outlet />
    </div>
  );
}
