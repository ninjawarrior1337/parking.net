import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/login/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="grid place-items-center min-h-full h-full min-w-full">
      <div className="w-72 p-6 shadow-2xl rounded-xl">
        <h2 className="text-3xl font-bold text-center mb-4">Login</h2>
        <form className="flex flex-col space-y-4 items-center *:*:w-full">
          <div className="flex flex-col w-full">
            <label htmlFor="username" className="text-xl font-semibold pb-2">Username</label>
            <input
              name="username"
              placeholder="Username"
              className="p-2 bg-neutral-100 rounded"
            ></input>
          </div>

          <div className="flex flex-col w-full">
            <label className="text-xl font-semibold pb-2" htmlFor="password">Password</label>
            <input
              name="password"
              placeholder="Password"
              className="p-2 bg-neutral-100 rounded"
            ></input>
          </div>

          <button
            className="text-white bg-red-700 p-2 rounded-sm"
            type="submit"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
