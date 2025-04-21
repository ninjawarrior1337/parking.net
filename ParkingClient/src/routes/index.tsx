import { createFileRoute } from "@tanstack/react-router";
import { LotCard } from "../components/LotCard";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});


function RouteComponent() {
  return (
    <div>
      <div className="grid lg:grid-cols-2 w-full p-8 gap-8">
        <LotCard lotId="B3" availableSpaces={2130}></LotCard>
        <LotCard lotId="B5" availableSpaces={1283}></LotCard>
        <LotCard lotId="G3" availableSpaces={1324}></LotCard>
        <LotCard lotId="G6" availableSpaces={994}></LotCard>
      </div>
    </div>
  );
}
