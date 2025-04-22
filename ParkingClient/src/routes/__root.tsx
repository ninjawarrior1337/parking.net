import * as React from "react";
import { Link, Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { useAtomValue, useSetAtom } from "jotai";
import { decodedTokenAtom, tokenAtom } from "../lib/auth/tokenStore";
import { useEffect } from "react";

export const Route = createRootRoute({
  component: RootComponent,
});

const LogoutComponent = () => {
  const setTokenValue = useSetAtom(tokenAtom)
  const handleClick = () => {
    setTokenValue(null)
  }
  return (
    <button onClick={handleClick} className="p-3 bg-white rounded-lg font-bold shadow-2xl">
      Logout
    </button>
  )
}

function RootComponent() {
  const token = useAtomValue(tokenAtom)
  const decodedToken = useAtomValue(decodedTokenAtom)

  useEffect(() => {
    console.log(decodedToken)
  }, [decodedToken])

  return (
    <React.Fragment>
      <nav className="w-full min-h-12 bg-red-600 flex items-center p-4 rounded-b-xl">
        <Link to="/" className="text-white font-bold text-3xl">Parking</Link>
        <div className="flex-1"></div>
        {!token ? <Link
          to="/login"
          className="p-3 bg-white rounded-lg font-bold shadow-2xl"
        >
          Login
        </Link> : <LogoutComponent/>}
      </nav>
      <div className="h-[calc(100vh-80px)]">
        <Outlet />
      </div>
      <TanStackRouterDevtools></TanStackRouterDevtools>
    </React.Fragment>
  );
}
