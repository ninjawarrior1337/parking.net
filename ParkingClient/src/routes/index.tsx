import { createFileRoute } from "@tanstack/react-router";
import { Suspense, use } from "react";
import { LotCard } from "../components/LotCard";
import { getKy } from "../lib/api";
import { LotDto } from "../lib/api/types";

export const Route = createFileRoute("/")({
  component: RouteComponent,
  staleTime: Infinity,
  shouldReload: false,
  loader: async ({ abortController }) => {
    const ky = getKy();

    return {
      lots: ky
        .get("ParkingLotInfo/GetAllLots", { signal: abortController.signal })
        .json<LotDto[]>(),
    };
  },
});

const LotsCardSetComponent = ({
  lotsPromise,
}: {
  lotsPromise: Promise<LotDto[]>;
}) => {
  const lots = use(lotsPromise);

  return lots.map((l) => (
    <LotCard
      autoRefresh
      key={l.lotId}
      lotName={l.lotName}
      lotId={l.lotId}
      spacesCount={l.spacesCount}
    ></LotCard>
  ));
};

function RouteComponent() {
  const { lots } = Route.useLoaderData();

  return (
    <div>
      <div className="grid lg:grid-cols-2 w-full p-8 gap-8">
        <Suspense
          fallback={
            <>
              <div className="w-full h-32 rounded-xl bg-gradient-to-r bg-red-400/30 animate-pulse"></div>
              <div className="w-full h-32 rounded-xl bg-gradient-to-r bg-red-400/30 animate-pulse"></div>
              <div className="w-full h-32 rounded-xl bg-gradient-to-r bg-red-400/30 animate-pulse"></div>
            </>
          }
        >
          <LotsCardSetComponent lotsPromise={lots} />
        </Suspense>
      </div>
    </div>
  );
}
