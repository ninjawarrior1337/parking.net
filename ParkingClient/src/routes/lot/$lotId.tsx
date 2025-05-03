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

function LoadingChartFallback() {
  return (
    <div className="w-full h-full bg-neutral-500/10 animate-pulse rounded-2xl flex flex-col items-center justify-center"></div>
  );
}

function NoDataChartFallback() {
  return (
    <div className="w-full h-full bg-red-400/30 rounded-2xl flex flex-col items-center justify-center p-2 text-center">
      <p className="font-black text-red-800 text-5xl">No Data Found!</p>
      <p className="text-2xl font-semibold">
        Please wait until a measurement is recorded
      </p>
    </div>
  );
}

function RouteComponent() {
  const params = Route.useParams();
  const search = Route.useSearch();
  const data = Route.useLoaderData();
  const isAdmin = useAtomValue(isAdminAtom);

  const streamedMeasurements = useOnMeasurement(params.lotId);

  const { data: historicalData, isLoading } = useSWRImmutable(
    ["ParkingLotMeasurement/GetPastDays", params.lotId, search.historyLength],
    async (k) => {
      const ky = getKy();
      return ky
        .get(k[0], { searchParams: { lotId: k[1], days: k[2] } })
        .json<{ measurements: LotMeasurementDto[]; lotId: string }>()
        .then((res) => ({
          ...res,
          measurements: res.measurements.map((m) => ({
            ...m,
            timestamp: new Date(m.timestamp),
          })),
        }));
    },
    {
      revalidateOnMount: true,
    }
  );

  const mergedMeasurements = useMemo(() => {
    if (historicalData) {
      return [...historicalData.measurements, ...streamedMeasurements];
    }

    return streamedMeasurements;
  }, [historicalData, streamedMeasurements]);

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
    <div className="grid grid-cols-1 lg:grid-cols-12 w-full p-8 gap-8">
      <div className="lg:col-span-8 h-64 lg:order-last">
        {isLoading ? (
          <LoadingChartFallback />
        ) : mergedMeasurements.length === 0 ? (
          <NoDataChartFallback></NoDataChartFallback>
        ) : (
          <ResponsiveContainer>
            <LineChart
              height={400}
              data={mergedMeasurements}
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
              <XAxis
                tickFormatter={(v: Date) => v.toLocaleString()}
                dataKey="timestamp"
              />
              <Tooltip />
              <CartesianGrid stroke="#f5f5f5" />
              <Line
                name="Available Spaces"
                type="monotone"
                dataKey="availableSpaces"
                stroke="#e4007f"
                yAxisId={0}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
      <div className="lg:col-span-4 flex flex-col self-start space-y-8">
        <LotCard
          lotId={params.lotId}
          availableCount={mergedMeasurements.at(-1)?.availableSpaces}
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
              className="bg-red-500 p-2 px-3 rounded-xl font-bold text-white cursor-pointer"
              type="submit"
            >
              Add
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
