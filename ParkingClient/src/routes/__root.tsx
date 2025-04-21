import * as React from "react";
import { Link, Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <React.Fragment>
      <nav className="w-full min-h-12 bg-red-600 flex items-center p-4 rounded-b-xl">
        <Link to="/" className="text-white font-bold text-3xl">Parking</Link>
        <div className="flex-1"></div>
        <Link
          to="/login"
          className="p-3 bg-white rounded-lg font-bold shadow-2xl"
        >
          Login
        </Link>
      </nav>
      <div className="h-[calc(100vh-80px)]">
        <Outlet />
      </div>
      <TanStackRouterDevtools></TanStackRouterDevtools>
    </React.Fragment>
  );
}
