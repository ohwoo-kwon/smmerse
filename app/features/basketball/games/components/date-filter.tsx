import { DateTime } from "luxon";
import { useSearchParams } from "react-router";

import { cn } from "~/core/lib/utils";

export default function DateFilter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const today = DateTime.now().startOf("day");
  const currentDate = searchParams.get("date")
    ? DateTime.fromFormat(searchParams.get("date")!, "yyyy-MM-dd")
    : "";

  const dates = [today];
  for (let i = 1; i < 14; i++) {
    dates.push(today.plus({ days: i }));
  }

  return (
    <div className="flex gap-1 overflow-x-auto text-sm">
      {dates.map((date) => (
        <div
          key={date.toISO()}
          className={cn(
            "hover:bg-accent flex min-w-10 cursor-pointer flex-col items-center rounded-lg border py-1",
            date.weekday === 6
              ? "border-blue-500 text-blue-500"
              : date.weekday === 7 || date.isWeekend
                ? "border-red-500 text-red-500"
                : "",
            currentDate.toString() === date.toString()
              ? "bg-primary text-primary-foreground border-primary-foreground hover:bg-primary"
              : "",
          )}
          onClick={() => {
            if (currentDate.toString() === date.toString())
              searchParams.delete("date");
            else searchParams.set("date", date.toISODate());
            setSearchParams(searchParams);
          }}
        >
          <span>{date.day}</span>
          <span>{date.weekdayShort}</span>
        </div>
      ))}
    </div>
  );
}
