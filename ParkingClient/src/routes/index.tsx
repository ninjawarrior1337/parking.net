import { Await, createFileRoute } from "@tanstack/react-router";
import { LotCard } from "../components/LotCard";
import { getKy } from "../lib/api";

export const Route = createFileRoute("/")({
  component: RouteComponent,
  loader: async () => {
    const ky = getKy();

    return {
      lots: ky.get("ParkingLotInfo/GetAllLots").json<
        {
          lotId: string;
          spacesCount: number;
        }[]
      >(),
    };
  },
});

function RouteComponent() {
  const {lots} = Route.useLoaderData();
  return (
    <div>
      <div className="grid lg:grid-cols-2 w-full p-8 gap-8">
        <Await promise={lots} fallback={
          <>
            <div className="w-full h-32 rounded-xl bg-gradient-to-r bg-red-400/30 animate-pulse"></div>
            <div className="w-full h-32 rounded-xl bg-gradient-to-r bg-red-400/30 animate-pulse"></div>
            <div className="w-full h-32 rounded-xl bg-gradient-to-r bg-red-400/30 animate-pulse"></div>
            <div className="w-full h-32 rounded-xl bg-gradient-to-r bg-red-400/30 animate-pulse"></div>
          </>
        }>
          {
            data => data.map((l) => (
              <LotCard
                key={l.lotId}
                lotId={l.lotId}
                spacesCount={l.spacesCount}
              ></LotCard>
            ))
          }
        </Await>
      </div>
    </div>
  );
}
