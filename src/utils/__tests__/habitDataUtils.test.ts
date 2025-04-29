import { getConsolidatedUnitsForCategory } from "../habitDataUtils";

describe("getConsolidatedUnitsForCategory", () => {
  test("time", () => {
    expect(getConsolidatedUnitsForCategory("time", 0)).toEqual({});
    expect(getConsolidatedUnitsForCategory("time", 40)).toEqual({ m: 40 });
    expect(getConsolidatedUnitsForCategory("time", 60)).toEqual({ h: 1 });
    expect(getConsolidatedUnitsForCategory("time", 100)).toEqual({
      h: 1,
      m: 40,
    });
  });
});
