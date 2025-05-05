
const daysSelection = [30, 60, 90, 365] as const;
type DaysSelectable = (typeof daysSelection)[number];

type Props = {
  daySelected: DaysSelectable | number;
  onSelect: (d: Props["daySelected"]) => void;
};

export default function HistoryDaysSelector({ daySelected, onSelect }: Props) {
  return (
    <div className="w-full h-48 bg-blue-400/30 rounded-xl flex basis-full flex-col justify-around">
      <h3 className="text-center text-4xl font-bold pt-4 text-blue-600">
        Days of History
      </h3>
      <div className="flex items-center h-full justify-around p-8">
        {daysSelection.map((d) => (
          <button
            className={`text-blue-600 font-bold text-3xl ${daySelected === d ? "bg-blue-300/90" : "bg-blue-300/30"} p-4 rounded-full cursor-pointer`}
            onClick={() => onSelect(d)}
          >
            {d}
          </button>
        ))}
      </div>
    </div>
  );
}
