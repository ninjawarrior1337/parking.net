import { z } from "zod";

const hoursSchema = z.union([
  z.literal(1),
  z.literal(6),
  z.literal(12),
  z.literal(24),
]);
const daysSchema = z.union([
  z.literal(30),
  z.literal(60),
  z.literal(90),
  z.literal(365),
]);

const daysSelection = [30, 60, 90, 365] as const;
const hoursSelection = [1, 6, 12, 24] as const;

export const rangeSelectedSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("days"), days: daysSchema }),
  z.object({ type: z.literal("hours"), hours: hoursSchema }),
]);

type RangeSelection = z.infer<typeof rangeSelectedSchema>;

type Props = {
  rangeSelected: RangeSelection;
  onSelect: (d: Props["rangeSelected"]) => void;
  disabled: boolean
};

export default function HistoryDaysSelector({
  rangeSelected,
  onSelect,
  disabled
}: Props) {
  return (
    <div className="w-full h-48 bg-blue-400/30 rounded-xl flex basis-full flex-col justify-around">
      <h3 className="text-center text-2xl font-bold pt-4 text-blue-600">
        History
      </h3>
      <div className="grid grid-cols-2 gap-4 p-4">
        <div className="grid grid-cols-2 gap-4 h-full rounded-2xl border-x-2 border-blue-400">
          {hoursSelection.map((d) => (
            <button
              disabled={disabled}
              className={`text-blue-600 font-bold text-2xl ${rangeSelected.type === "hours" && rangeSelected.hours === d ? "bg-blue-300/90" : "bg-blue-300/30"} rounded-lg p-4 cursor-pointer`}
              onClick={() =>
                onSelect({
                  type: "hours",
                  hours: d,
                })
              }
            >
              {d}h
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4 h-full rounded-2xl border-x-2 border-blue-400">
          {daysSelection.map((d) => (
            <button
              disabled={disabled}
              className={`text-blue-600 font-bold text-2xl ${rangeSelected.type === "days" && rangeSelected.days === d ? "bg-blue-300/90" : "bg-blue-300/30"} rounded-lg p-4 cursor-pointer disabled:cursor-auto`}
              onClick={() =>
                onSelect({
                  type: "days",
                  days: d,
                })
              }
            >
              {d}d
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
