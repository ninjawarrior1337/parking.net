import { createFileRoute, useRouter } from "@tanstack/react-router";
import { HTTPError } from "ky";
import { useActionState } from "react";
import { login } from "../lib/auth/tokenStore";

export const Route = createFileRoute("/login")({
  component: RouteComponent,
});

type ActionState = {
  success: boolean;
  message: string;
  payload: FormData;
};

function RouteComponent() {
  const router = useRouter();
  const navigate = Route.useNavigate();

  const loginAction = async (
    _: ActionState,
    formData: FormData
  ): Promise<ActionState> => {
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    try {
      await login({
        username,
        password,
      });
    } catch (e) {
      if (e instanceof HTTPError) {
        if (e.response.status === 401) {
          return {
            success: false,
            message: "Incorrect username or password",
            payload: formData,
          };
        }
      }

      return { success: false, message: "", payload: formData };
    }

    if (router.history.canGoBack()) {
      router.history.back();
    } else {
      navigate({ to: "/" });
    }

    return { success: true, message: "Logged in", payload: formData };
  };

  const [actionState, action, isPending] = useActionState(loginAction, {
    message: "",
    success: false,
    payload: new FormData(),
  });

  return (
    <div className="grid place-items-center min-h-full h-full min-w-full">
      <div className="w-72 p-6 shadow-2xl rounded-xl animate-in zoom-in duration-200">
        <h2 className="text-3xl font-bold text-center mb-4">Login</h2>
        <form
          action={action}
          className="flex flex-col space-y-4 items-center *:*:w-full"
        >
          <div className="flex flex-col w-full">
            <label htmlFor="username" className="text-xl font-semibold pb-2">
              Username
            </label>
            <input
              name="username"
              type="username"
              placeholder="Username"
              defaultValue={
                (actionState.payload.get("username") as string) || ""
              }
              required
              className="p-2 bg-neutral-100 rounded"
            ></input>
          </div>

          <div className="flex flex-col w-full">
            <label className="text-xl font-semibold pb-2" htmlFor="password">
              Password
            </label>
            <input
              name="password"
              type="password"
              placeholder="Password"
              required
              className="p-2 bg-neutral-100 rounded"
            ></input>
          </div>
          {actionState.message && (
            <div
              className={`${actionState.success ? "bg-green-500/20" : "bg-red-500/20"} p-2 rounded-lg break-words text-center`}
            >
              {actionState.message}
            </div>
          )}
          <button
            disabled={isPending}
            className={`text-white bg-red-700 p-2 rounded-sm cursor-pointer disabled:bg-red-700/30`}
            type="submit"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
