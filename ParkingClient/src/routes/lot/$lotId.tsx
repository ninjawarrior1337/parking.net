import { createFileRoute } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import { useMemo } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import useSWRImmutable from "swr/immutable";
import { LotCard } from "../../components/LotCard";
import { getKy } from "../../lib/api";
import { LotDto, LotMeasurementDto } from "../../lib/api/types";
import { isAdminAtom } from "../../lib/auth/tokenStore";
import { useOnMeasurement } from "../../lib/useOnMeasurement";

export const Route = createFileRoute("/lot/$lotId")({
  component: RouteComponent,
  validateSearch: (search) => {
    return {
      historyLength: Number(search?.historyLength ?? 30),
    };
  },
  loader: async ({ params, abortController }) => {
    const ky = getKy();

    return {
      lotInfo: await ky
        .get("ParkingLotInfo/GetLotById", {
          searchParams: { lotId: params.lotId },
          signal: abortController.signal,
        })
        .json<LotDto>(),
    };
  },
});

function RouteComponent() {
  const params = Route.useParams();
  const search = Route.useSearch();
  const data = Route.useLoaderData();
  const isAdmin = useAtomValue(isAdminAtom);

  const streamedMeasurements = useOnMeasurement(params.lotId)

  const { data: historicalData } = useSWRImmutable(
    ["ParkingLotMeasurement/GetPastDays", params.lotId, search.historyLength],
    async (k) => {
      const ky = getKy();
      const res = await ky
        .get(k[0], { searchParams: { lotId: k[1], days: k[2] } })
        .json<{ measurements: LotMeasurementDto[]; lotId: string }>();
      return {
        ...res,
        measurements: res.measurements.map((m) => ({
          ...m,
          timestamp: new Date(m.timestamp),
        })),
      };
    }
  );

  const latestMeasurement = useMemo(() => {
    return [
      ...historicalData?.measurements || [],
      ...streamedMeasurements
    ].at(-1)
  }, [historicalData?.measurements, streamedMeasurements])

  const handleAddMeasurement = async (formData: FormData) => {
    const availableSpaces = parseInt(formData.get("availableSpaces") as string);

    const ky = getKy();
    await ky.post("ParkingLotMeasurement/AddMeasurement", {
      json: {
        lotId: params.lotId,
        availableSpaces,
      },
    });
  };

  return (
    <div className="grid grid-cols-12 w-full p-8 gap-8">
      <div className="col-span-4 flex flex-col self-start space-y-8">
        <LotCard
          lotId={params.lotId}
          availableCount={latestMeasurement?.availableSpaces}
          spacesCount={data.lotInfo.spacesCount}
        ></LotCard>
        {isAdmin && (
          <form
            action={handleAddMeasurement}
            className="shadow border-8 rounded-xl p-4 flex flex-col items-center overflow-hidden"
          >
            <h3 className="text-center font-bold text-xl">
              Manually Add Measurement
            </h3>
            <div className="flex flex-col py-4">
              <label className="font-semibold">Available Spaces</label>
              <input
                type="number"
                step={1}
                name="availableSpaces"
                required
                className="p-2 bg-neutral-100 rounded"
                defaultValue={0}
              />
            </div>
            <button
              className="bg-red-500 p-2 px-3 rounded-xl font-bold text-white"
              type="submit"
            >
              Add
            </button>
          </form>
        )}
      </div>
      <div className="col-span-8 h-64">
        <ResponsiveContainer>
          <LineChart
            height={400}
            data={historicalData?.measurements}
            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            className="z-0"
          >
            <XAxis tickFormatter={(v: Date) => v.toLocaleString()} dataKey="timestamp" />
            <Tooltip />
            <CartesianGrid stroke="#f5f5f5" />
            <Line
              type="monotone"
              dataKey="availableSpaces"
              stroke="#e4007f"
              yAxisId={0}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
