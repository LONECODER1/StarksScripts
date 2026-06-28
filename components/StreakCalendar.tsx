"use client";

import { useMemo, useState } from "react";
import { Calendar } from "@/components/ui/calendar";

function buildMockSolvedDates(): Date[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dates: Date[] = [];

  for (let offset = 0; offset < 45; offset += 1) {
    if (offset % 2 === 0 || offset % 7 === 0) {
      const date = new Date(today);
      date.setDate(today.getDate() - offset);
      dates.push(date);
    }
  }

  return dates;
}

export default function StreakCalendar() {
  const [month, setMonth] = useState(() => new Date());
  const solvedDates = useMemo(() => buildMockSolvedDates(), []);

  return (
    <Calendar
      mode="single"
      month={month}
      onMonthChange={setMonth}
      selected={new Date()}
      modifiers={{ solved: solvedDates }}
      modifiersClassNames={{
        solved:
          "[&>button]:bg-green-500/20 [&>button]:text-green-500 [&>button]:hover:bg-green-500/30 [&>button]:hover:text-green-600",
      }}
      className="w-full"
    />
  );
}
