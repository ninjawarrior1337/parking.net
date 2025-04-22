import { createFileRoute } from "@tanstack/react-router";
import { LotCard } from "../components/LotCard";
// import { getKy } from "../lib/api";

export const Route = createFileRoute("/")({
  component: RouteComponent,
  loader: async () => {
    // const ky = getKy()

    return [
      {lotId: "B3", spacesCount: 3021}
    ]
    // return await ky.get("ParkingLotInfo/GetAllLots").json<{
    //   lotId: string,
    //   spacesCount: number
    // }[]>()
  }
});


function RouteComponent() {
  const data = Route.useLoaderData()
  return (
    <div>
      <div className="grid lg:grid-cols-2 w-full p-8 gap-8">
        {
          data.map(l => (
            <LotCard key={l.lotId} lotId={l.lotId} spacesCount={l.spacesCount}></LotCard>
          ))
        }
      </div>
    </div>
  );
}
