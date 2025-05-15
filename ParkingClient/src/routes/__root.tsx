import { HeadContent, Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import * as React from "react";
import Navbar from "../components/Navbar";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <React.Fragment>
      <HeadContent />
      <Navbar />
      <div className="h-[calc(100vh-80px)]">
        <Outlet />
      </div>
      <TanStackRouterDevtools></TanStackRouterDevtools>
    </React.Fragment>
  );
}
