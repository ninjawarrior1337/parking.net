import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import * as SignalR from "@microsoft/signalr";

export const Route = createFileRoute("/about")({
  component: RouteComponent,
});

function RouteComponent() {
  useEffect(() => {
    const connection = new SignalR.HubConnectionBuilder()
      .withUrl("http://localhost:5013/measurementsHub", {
        withCredentials: false,
      })
      .build();

    connection.on("OnMeasurement", (data) => console.log(data));
    connection.start().catch((e) => console.error(e));

    return () => {
      connection.stop();
    };
  }, []);
  return <div>Hello "/about"!</div>;
}
