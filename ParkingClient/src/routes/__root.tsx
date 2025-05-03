import { Link, Outlet, createRootRoute, useRouter } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { useAtomValue, useSetAtom } from "jotai";
import * as React from "react";
import { isAuthenticatedAtom, tokenAtom } from "../lib/auth/tokenStore";

export const Route = createRootRoute({
  component: RootComponent,
});

const LogoutComponent = () => {
  const setTokenValue = useSetAtom(tokenAtom);
  const router = useRouter()
  const handleClick = () => {
    setTokenValue(null);
    router.history.push("/login")
  };
  return (
    <button
      onClick={handleClick}
      className="p-3 bg-white rounded-lg font-bold shadow-2xl cursor-pointer"
    >
      Logout
    </button>
  );
};

function RootComponent() {
  const isAuthenticated = useAtomValue(isAuthenticatedAtom);

  return (
    <React.Fragment>
      <nav className="w-full min-h-12 bg-red-600 flex items-center p-4 rounded-b-xl">
        <Link preload="intent" to="/" className="text-white font-bold text-3xl">
          Parking
        </Link>
        <div className="flex-1"></div>
        {!isAuthenticated ? (
          <Link
            to="/login"
            className="p-3 bg-white rounded-lg font-bold shadow-2xl"
          >
            Login
          </Link>
        ) : (
          <LogoutComponent />
        )}
      </nav>
      <div className="h-[calc(100vh-80px)]">
        <Outlet />
      </div>
      <TanStackRouterDevtools></TanStackRouterDevtools>
    </React.Fragment>
  );
}
