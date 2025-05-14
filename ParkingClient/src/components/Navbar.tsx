import { Link, useRouter } from "@tanstack/react-router";
import { useAtomValue, useSetAtom } from "jotai";
import { isAuthenticatedAtom, tokenAtom } from "../lib/auth/tokenStore";

const LogoutButton = () => {
  const setTokenValue = useSetAtom(tokenAtom);
  const router = useRouter();
  const handleClick = () => {
    setTokenValue(null);
    router.history.push("/login");
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

export default function Navbar() {
  const isAuthenticated = useAtomValue(isAuthenticatedAtom);

  return (
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
        <LogoutButton />
      )}
    </nav>
  );
}
