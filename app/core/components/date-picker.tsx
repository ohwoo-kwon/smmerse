import { Calendar as CalendarIcon } from "lucide-react";
import { DateTime } from "luxon";

import { Button } from "~/core/components/ui/button";
import { Calendar } from "~/core/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/core/components/ui/popover";

export function DatePicker({
  date,
  setDate,
}: {
  date: string;
  setDate: (date: string) => void;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild id="date" className="text-sm md:text-base">
        <Button
          variant="outline"
          data-empty={!date}
          className="data-[empty=true]:text-muted-foreground w-full justify-start text-left"
        >
          <CalendarIcon />
          {date ? date : <span>날짜를 입력하세요.</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={DateTime.fromFormat(date, "yyyy-MM-dd").toJSDate()}
          onSelect={(date) => {
            const formattedDate = date
              ? DateTime.fromJSDate(date).toFormat("yyyy-MM-dd")
              : "";
            setDate(formattedDate);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
