import * as React from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export type CalendarProps = {
  selectedDates: Date[];
  absentDates: Date[];
  onMonthChange?: (date: Date) => void;
  onClickFn?: (date: Date) => void;
};

function CustomCalendar({
  selectedDates,
  absentDates,
  onMonthChange,
  onClickFn,
  ...props
}: CalendarProps) {
  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === "month") {
      const isSelected = selectedDates.some(
        (d) =>
          d.getFullYear() === date.getFullYear() &&
          d.getMonth() === date.getMonth() &&
          d.getDate() === date.getDate()
      );
      if (isSelected) {
        return "present-day rounded-full";
      }
      const isAbsent = absentDates.some(
        (d) =>
          d.getFullYear() === date.getFullYear() &&
          d.getMonth() === date.getMonth() &&
          d.getDate() === date.getDate()
      );
      if (isAbsent) {
        return "absent-day rounded-full";
      }
    }
    return null;
  };

  const handleActiveStartDateChange = ({ activeStartDate }: { activeStartDate: Date | null }) => {
    if (onMonthChange && activeStartDate) {
      onMonthChange(activeStartDate);
    }
  };

  return (
    <Calendar
      tileClassName={tileClassName}
      onActiveStartDateChange={handleActiveStartDateChange}
      onClickDay={(date) => onClickFn?.(date)}
      {...props}
    />
  );
}

export { CustomCalendar as Calendar };