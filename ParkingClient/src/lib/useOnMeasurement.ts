import { useCallback, useEffect, useState } from "react";
import * as SignalR from "@microsoft/signalr";
import { LotMeasurementEvent } from "./api/types";


export const useOnMeasurement = (lotId: string) => {
  const [measurements, setMeasurements] = useState<LotMeasurementEvent[]>([]);

  useEffect(() => {
    console.log(measurements)
  }, [measurements])

  const handleOnMeasurement = useCallback((m: LotMeasurementEvent) => {
    if(lotId == m.lotId) {
        setMeasurements(prev => [...prev, m])
    }
  }, [lotId])

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

  return measurements;
};
