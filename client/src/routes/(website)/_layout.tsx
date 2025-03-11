import FooterSection from "@/components/sections/footer/default";
import Navbar from "@/components/sections/navbar/default";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/(website)/_layout")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="container mx-auto w-[80%]">
      <Navbar />
        <Outlet />
      <FooterSection />
    </div>
  );
}
