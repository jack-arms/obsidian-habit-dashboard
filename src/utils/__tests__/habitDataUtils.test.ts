import {
  getAggregatedHabitProgress,
  getFrontmatterDataToProgress,
} from "../habitDataUtils";
import { moment } from "obsidian";

describe(getFrontmatterDataToProgress, () => {
  test("misc cases", () => {
    expect(getFrontmatterDataToProgress("15")).toEqual({
      value: 15,
      unit: null,
    });
    expect(getFrontmatterDataToProgress("15h")).toEqual({
      value: 15,
      unit: "h",
    });
    expect(getFrontmatterDataToProgress("h")).toBeNull();
  });
});

describe(getAggregatedHabitProgress, () => {
  const data = {
    "2025-04-30": {
      date: "2025-04-30",
      noteHref: "2025-04-30.md",
      value: 1,
      unit: "h",
    },
    "2025-04-29": {
      date: "2025-04-29",
      noteHref: "2025-04-29.md",
      value: 20,
      unit: "m",
    },
    "2025-04-28": {
      date: "2025-04-28",
      noteHref: "2025-04-28.md",
      value: 8,
      unit: "mi",
    },
    "2025-04-27": {
      date: "2025-04-27",
      noteHref: "2025-04-27.md",
      value: 4,
      unit: null,
    },
    "2025-04-26": {
      date: "2025-04-26",
      noteHref: "2025-04-26.md",
      value: null,
      unit: null,
    },
  };
  test("all data", () => {
    expect(getAggregatedHabitProgress(data)).toEqual({
      times: 5,
      minutes: 80,
      progress: {
        mi: 8,
      },
      untypedProgress: 4,
    });
  });

  test("data in range", () => {
    expect(getAggregatedHabitProgress(data, moment("2025-04-28"))).toEqual({
      times: 3,
      minutes: 80,
      progress: {
        mi: 8,
      },
      untypedProgress: 0,
    });
  });
});
