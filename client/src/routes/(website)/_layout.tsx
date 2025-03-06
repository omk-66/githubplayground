

import Navbar from "@/components/navbar";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/(website)/_layout")({
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
