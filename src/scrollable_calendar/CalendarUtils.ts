import type { moment } from "obsidian";

export type DateCellInfo = {
  date: moment.Moment;
  isLastWeek: boolean;
  isLastDayOfMonth: boolean;
};

export function getCalendarRow(date: moment.Moment): DateCellInfo[] {
  const week: DateCellInfo[] = [];
  for (let i = 0; i < 7; i++) {
    let cellDate = date.clone().startOf("week").isoWeekday(1).add(i, "day");
    let dateNextWeek = cellDate.clone().add(1, "week");
    let dateTomorrow = cellDate.clone().add(1, "day");
    week.push({
      date: cellDate,
      isLastWeek: cellDate.month() !== dateNextWeek.month(),
      isLastDayOfMonth: cellDate.month() !== dateTomorrow.month(),
    });
  }
  return week;
}

export function getWeekRowsByMonth(
  weeks: Array<DateCellInfo[]>
): Map<number, Array<DateCellInfo[]>> {
  const weekRowsByMonth = new Map<number, Array<DateCellInfo>[]>();
  weeks.forEach((week) => {
    let month = week[0].date.month();
    if (weekRowsByMonth.has(month)) {
      weekRowsByMonth.get(month)?.push(week);
    } else {
      weekRowsByMonth.set(month, [week]);
    }
  });
  return weekRowsByMonth;
}
