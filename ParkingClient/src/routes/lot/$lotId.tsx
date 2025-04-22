import { createFileRoute } from "@tanstack/react-router";
import { LotCard } from "../../components/LotCard";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";

export const Route = createFileRoute("/lot/$lotId")({
  component: RouteComponent,
});

function RouteComponent() {
  const params = Route.useParams();
  return (
    <div className="grid grid-cols-12 w-full p-8 gap-8">
      <div className="col-span-4 flex flex-col self-start space-y-8">
        <LotCard lotId={params.lotId} spacesCount={3912}></LotCard>
        <form className="shadow border-8 rounded-xl p-4 flex flex-col items-center overflow-hidden">
          <h3 className="text-center font-bold text-xl">Manually Add Measurement</h3>
          <div className="flex flex-col py-4">
            <label className="font-semibold">Available Spaces</label>
            <input type="number" className="p-2 bg-neutral-100 rounded" defaultValue={0}/>
          </div>
          <button className="bg-red-500 p-2 px-3 rounded-xl font-bold" type="submit">Add</button>
        </form>
      </div>
      <div className="col-span-8 h-64">
        <ResponsiveContainer>
        <LineChart
          height={400}
          data={[
            {name: "hello", pv: 5, uv: 10},
            {name: "hello", pv: 5, uv: 10},
            {name: "hello", pv: 10, uv: 10},
            {name: "hello", pv: 19, uv: 10},
          ]}
          margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
        >
          <XAxis dataKey="name" />
          <Tooltip />
          <CartesianGrid stroke="#f5f5f5" />
          <Line type="monotone" dataKey="uv" stroke="#3399ff" strokeWidth={3} yAxisId={0} />
          <Line type="monotone" dataKey="pv" stroke="#e4007f" yAxisId={1} />
        </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
