import { daysSelection, HistorySelection, hoursSelection } from "../lib/historySelection";

type Props = {
  rangeSelected: HistorySelection;
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
          {hoursSelection.map((h) => (
            <button
              key={h}
              disabled={disabled}
              className={`text-blue-600 font-bold text-2xl ${rangeSelected.type === "hours" && rangeSelected.hours === h ? "bg-blue-300/90" : "bg-blue-300/30"} rounded-lg p-4 cursor-pointer`}
              onClick={() =>
                onSelect({
                  type: "hours",
                  hours: h,
                })
              }
            >
              {h}h
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4 h-full rounded-2xl border-x-2 border-blue-400">
          {daysSelection.map((d) => (
            <button
              key={d}
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
