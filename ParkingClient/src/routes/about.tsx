import { createFileRoute, redirect } from "@tanstack/react-router";
import { getDefaultStore } from "jotai";
import { isAuthenticatedAtom } from "../lib/auth/tokenStore";

export const Route = createFileRoute("/about")({
  component: RouteComponent,
  beforeLoad() {
    const store = getDefaultStore()
    if(!store.get(isAuthenticatedAtom)) {
      throw redirect({to: "/login"})
    }
  }
});

function RouteComponent() {
  return <div>Hello "/about"!</div>;
}
