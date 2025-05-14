import * as SignalR from "@microsoft/signalr";
import { useCallback, useEffect, useState } from "react";
import { useSWRConfig } from "swr";
import { LotMeasurementDto, LotMeasurementEvent } from "./api/types";

export const useOnMeasurement = (lotId: string) => {
  const [measurements, setMeasurements] = useState<LotMeasurementEvent[]>([]);
  const { mutate } = useSWRConfig();

  const handleOnMeasurement = useCallback(
    (m: LotMeasurementEvent) => {
      if (import.meta.env.DEV) {
        console.log(m);
      }

      mutate(["ParkingLotMeasurement/GetLatest", m.lotId], {
        timestamp: m.timestamp,
        availableSpaces: m.availableSpaces,
      } satisfies LotMeasurementDto);

      if (lotId == m.lotId) {
        setMeasurements((prev) => [...prev, m]);
      }
    },
    [lotId, mutate]
  );

  useEffect(() => {
    const connection = new SignalR.HubConnectionBuilder()
      .withUrl(
        `${import.meta.env.VITE_API_URL.substring(0, import.meta.env.VITE_API_URL.lastIndexOf("/api"))}/measurementsHub`,
        {
          withCredentials: false,
        }
      )
      .build();

    connection.on("OnMeasurement", handleOnMeasurement);
    connection.start().catch((e) => console.error(e));

    return () => {
      connection.stop();
    };
  }, [lotId, handleOnMeasurement]);

  const reset = () => {
    setMeasurements([]);
  };

  return { measurements, reset };
};
