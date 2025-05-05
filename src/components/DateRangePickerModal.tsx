import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"; // Import Dialog components

interface DateRangePickerModalProps {
  date: DateRange | undefined;
  setDate: (date: DateRange | undefined) => void;
  trigger: React.ReactNode; // The button or element that triggers the picker
}

export function DateRangePickerModal({
  date,
  setDate,
  trigger,
}: DateRangePickerModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="p-8 min-w-fit max-h-[90vh] rounded-lg border bg-casino-deep-blue/90 backdrop-blur-lg modal-container overflow-y-auto text-white">
        <Calendar
          initialFocus
          mode="range"
          defaultMonth={date?.from}
          selected={date}
          onSelect={setDate}
          numberOfMonths={2}
          className="text-white [&>div>table>tbody>tr>td>button]:text-white [&>div>table>tbody>tr>td>button:hover]:bg-casino-gold [&>div>table>tbody>tr>td>button:hover]:text-casino-deep-blue [&>div>div>button]:text-white [&>div>div>button:hover]:bg-casino-gold [&>div>div>button:hover]:text-casino-deep-blue [&>div>table>tbody>tr>td>button[aria-selected=true]]:bg-casino-gold [&>div>table>tbody>tr>td>button[aria-selected=true]]:text-casino-deep-blue"
        />
      </DialogContent>
    </Dialog>
  );
}
