import Navbar from "@/components/sections/navbar/default";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/user/_layout")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
}
