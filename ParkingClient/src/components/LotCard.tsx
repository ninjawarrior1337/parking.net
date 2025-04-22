import { Link } from "@tanstack/react-router";
import useSWR from "swr";
import { getKy } from "../lib/api";

export function LotCard({
  lotId,
  spacesCount,
  availableCount
}: {
  lotId: string;
  spacesCount: number;
  availableCount?: number;
}) {
  const { data, isLoading, error } = useSWR(
    availableCount ? null : ["ParkingLotMeasurement/GetLatest", lotId],
    async (k) => {
      const ky = getKy();
      return await ky
        .get(k[0], { searchParams: { lotId: k[1] } })
        .json<{ timestamp: string; availableSpaces: number }>();
    }
  );

  return (
    <Link
      to="/lot/$lotId"
      params={{ lotId }}
      search={{historyLength: 30}}
      className="w-full h-full shadow-xl p-2 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 cursor-pointer"
    >
      <div className="flex flex-col h-full justify-items-center items-center bg-white rounded-lg py-4">
        <h1 className="text-5xl font-black">{lotId}</h1>
        <div className="h-1 bg-red-500 w-9/12 my-2"></div>
        <div className="text-green-500 text-xl flex items-center space-x-2">
          {error || (!availableCount && !data?.timestamp) ? (
            <span className="text-center text-red-500">???</span>
          ) : isLoading ? (
            <span className="animate-pulse rounded bg-green-500/30 w-16 h-6 inline-block"></span>
          ) : (
            <span className="text-center">{data?.availableSpaces || availableCount}</span>
          )}
          <span className="text-center">
            spaces available out of {spacesCount}
          </span>
        </div>
      </div>
    </Link>
  );
}
