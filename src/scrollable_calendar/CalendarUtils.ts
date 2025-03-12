export type DateCellInfo = {
  date: Date;
  isLastWeek: boolean;
  isLastDayOfMonth: boolean;
};

export function getCalendarRow(date: Date): DateCellInfo[] {
  const startOfWeek = new Date(date.valueOf());
  startOfWeek.setDate(startOfWeek.getDate() - (startOfWeek.getDay() - 1));
  const endOfWeek = new Date(startOfWeek.valueOf());
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  const week: DateCellInfo[] = [];
  for (let i = 0; i < 7; i++) {
    let date = new Date(startOfWeek.valueOf());
    date.setDate(startOfWeek.getDate() + i);

    let dateNextWeek = new Date(date.valueOf());
    dateNextWeek.setDate(date.getDate() + 7);

    let dateTomorrow = new Date(date.valueOf());
    dateTomorrow.setDate(date.getDate() + 1);
    week.push({
      date,
      isLastWeek: date.getMonth() !== dateNextWeek.getMonth(),
      isLastDayOfMonth: date.getMonth() !== dateTomorrow.getMonth(),
    });
  }
  return week;
}

export function getWeekRowsByMonth(
  weeks: Array<DateCellInfo[]>
): Map<string, Array<DateCellInfo[]>> {
  const weekRowsByMonth = new Map<string, Array<DateCellInfo>[]>();
  weeks.forEach((week) => {
    let startOfMonth = new Date(week[0].date);
    startOfMonth.setDate(1);
    let date = startOfMonth.toDateString();
    if (weekRowsByMonth.has(date)) {
      weekRowsByMonth.get(date)?.push(week);
    } else {
      weekRowsByMonth.set(date, [week]);
    }
  });
  return weekRowsByMonth;
}
