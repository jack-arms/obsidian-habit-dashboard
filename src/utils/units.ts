export const HabitProgressUnits = {
  m: {
    category: "time",
    toBase: 1,
  },
  h: {
    category: "time",
    toBase: 60,
  },
  ft: {
    category: "distance",
    toBase: 1,
  },
  mi: {
    category: "distance",
    toBase: 5280,
  },
} as const;

export type HabitProgressUnit = keyof typeof HabitProgressUnits;
export type HabitProgressUnitCategory =
  (typeof HabitProgressUnits)[keyof typeof HabitProgressUnits]["category"];

export function convertUnit<
  From extends HabitProgressUnit,
  To extends HabitProgressUnit
>(value: number, from: From, to: To): number | null {
  const fromMeta = HabitProgressUnits[from];
  const toMeta = HabitProgressUnits[to];

  if (fromMeta.category !== toMeta.category) {
    return null;
    // throw new Error(
    //   `Cannot convert from ${from} (${fromMeta.category}) to ${to} (${toMeta.category})`
    // );
  }

  const valueInBase = value * fromMeta.toBase;
  return valueInBase / toMeta.toBase;
}
