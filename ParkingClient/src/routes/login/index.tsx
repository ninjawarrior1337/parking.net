import { createFileRoute } from "@tanstack/react-router";
import { login } from "../../lib/auth/tokenStore";
import { useState } from "react";

export const Route = createFileRoute("/login/")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = Route.useNavigate()
  const [error, setError] = useState("")
  const handleSubmit = async (formData: FormData) => {
    const username = formData.get("username") as string
    const password = formData.get("password") as string

    try {
      await login({
        username,
        password
      })
    } catch(e) {
      if(e instanceof Error) {
        setError(e.message)
        return
      }
    }
    
    navigate({to: "/"})
  }

  return (
    <div className="grid place-items-center min-h-full h-full min-w-full">
      <div className="w-72 p-6 shadow-2xl rounded-xl">
        <h2 className="text-3xl font-bold text-center mb-4">Login</h2>
        <form action={handleSubmit} className="flex flex-col space-y-4 items-center *:*:w-full">
          <div className="flex flex-col w-full">
            <label htmlFor="username" className="text-xl font-semibold pb-2">Username</label>
            <input
              name="username"
              type="username"
              placeholder="Username"
              required
              className="p-2 bg-neutral-100 rounded"
            ></input>
          </div>

          <div className="flex flex-col w-full">
            <label className="text-xl font-semibold pb-2" htmlFor="password">Password</label>
            <input
              name="password"
              type="password"
              placeholder="Password"
              required
              className="p-2 bg-neutral-100 rounded"
            ></input>
          </div>
          {error && <div className="bg-red-500/20 p-2 rounded-lg break-words text-center">{error}</div>}
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
