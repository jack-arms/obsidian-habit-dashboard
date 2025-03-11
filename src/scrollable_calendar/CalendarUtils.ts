export type WeekInfo = {
  days: Date[];
  isLastWeek: boolean;
};

export function getCalendarRow(date: Date): WeekInfo | WeekInfo[] {
  const startOfWeek = new Date(date.valueOf());
  startOfWeek.setDate(startOfWeek.getDate() - (startOfWeek.getDay() - 1));
  const endOfWeek = new Date(startOfWeek.valueOf());
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  if (startOfWeek.getMonth() !== endOfWeek.getMonth()) {
    const week1 = [startOfWeek];
    const week2 = [];
    let crossedMonth = false;
    for (let i = 1; i < 7; i++) {
      let date = new Date(startOfWeek.valueOf());
      date.setDate(startOfWeek.getDate() + i);
      crossedMonth = date.getMonth() === endOfWeek.getMonth();

      if (!crossedMonth) {
        week1.push(date);
      } else {
        week2.push(date);
      }
    }
    return [
      { days: week1, isLastWeek: true },
      { days: week2, isLastWeek: false },
    ];
  } else {
    const week = [startOfWeek];
    for (let i = 1; i < 7; i++) {
      let date = new Date(startOfWeek.valueOf());
      date.setDate(startOfWeek.getDate() + i);
      week.push(date);
    }
    let nextDay = new Date(endOfWeek.getDate());
    nextDay.setDate(endOfWeek.getDate() + 1);

    return {
      days: week,
      isLastWeek: nextDay.getMonth() !== endOfWeek.getMonth(),
    };
  }
}

export function getWeekRowsByMonth(
  weeks: Array<WeekInfo | WeekInfo[]>
): Map<string, Array<WeekInfo | WeekInfo[]>> {
  const weekRowsByMonth = new Map<string, Array<WeekInfo | WeekInfo[]>>();
  weeks.forEach((week) => {
    let startOfMonth = new Date(
      Array.isArray(week) ? week[0].days[0] : week.days[0]
    );
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
