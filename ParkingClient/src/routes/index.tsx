import { Await, createFileRoute, Link } from "@tanstack/react-router";

const loadDggggg = async () => {
  const getVals = async () => {
    const res = await fetch("http://localhost:5013/dgggggg");

    await new Promise((res) => setTimeout(res, 1000));

    return (await res.json()) as [
      {
        val: number;
      },
    ];
  };

  return {
    vals: getVals(),
  };
};

export const Route = createFileRoute("/")({
  component: RouteComponent,
  loader: loadDggggg,
});

function RouteComponent() {
  const data = Route.useLoaderData();

  return (
    <div>
      Hello "/"! <Link to="/about">Tesst</Link>
      <Await promise={data.vals} fallback={<div>Loading...</div>}>
        {(data) => (
          data.map((v) => <span key={v.val}>{v.val}</span>)
        )}
      </Await>
    </div>
  );
}
