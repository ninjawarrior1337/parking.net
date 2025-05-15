import { createLink } from "@tanstack/react-router";
import { motion, useMotionValue, useTransform } from "motion/react";
import useSWR from "swr";
import { getKy } from "../lib/api";
import { LotMeasurementDto } from "../lib/api/types";

const MotionLink = createLink(motion.a);

export function LotCard({
  lotId,
  lotName,
  spacesCount,
  availableCount,
  autoRefresh,
}: {
  lotId: string;
  lotName: string;
  spacesCount: number;
  availableCount?: number;
  autoRefresh?: boolean;
}) {
  const { data, isLoading, error } = useSWR(
    autoRefresh ? ["ParkingLotMeasurement/GetLatest", lotId] : null,
    async (k) => {
      const ky = getKy();

      return await ky
        .get(k[0], { searchParams: { lotId: k[1] }, throwHttpErrors: true })
        .json<LotMeasurementDto>();
    }
  );

  const trueSpacesAvailable = availableCount
    ? availableCount
    : data?.availableSpaces;
  const fillPercentage = (trueSpacesAvailable ?? 0) / spacesCount;

  const fillPercentageMotionValue = useMotionValue(0);
  fillPercentageMotionValue.set(fillPercentage * 100);

  const textColor = useTransform(
    fillPercentageMotionValue,
    [0, 100],
    ["#fb2c36", "#00c951"]
  );

  return (
    <MotionLink
      preload="intent"
      to="/lot/$lotId"
      params={{ lotId }}
      search={{ type: "hours", hours: 6 }}
      // layoutId={`LotCard-${lotId}`}
    >
      <div className="w-full h-full shadow-xl p-2 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 cursor-pointer z-50">
        <div className="flex flex-col h-full justify-items-center items-center bg-white rounded-lg py-4">
          <h1 className="text-5xl font-black">{lotName}</h1>
          <div className="h-1 bg-red-500 w-9/12 my-2"></div>
          <motion.div
            className="text-xl flex items-center space-x-2"
            style={{ color: textColor }}
          >
            {error || (!trueSpacesAvailable && !isLoading && autoRefresh) ? (
              <span className="text-center text-red-500">???</span>
            ) : (isLoading || (!autoRefresh && !availableCount)) ? (
              <span className="animate-pulse rounded bg-red-500/30 w-16 h-6 inline-block"></span>
            ) : (
              <span className="text-center">{trueSpacesAvailable}</span>
            )}
            <span className="text-center">
              spaces available out of {spacesCount}
            </span>
          </motion.div>
        </div>
      </div>
    </MotionLink>
  );
}
