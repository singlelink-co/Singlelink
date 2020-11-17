import {QueryUtils} from "../src/utils/query-utils";

test("test values function", () => {
  expect(QueryUtils.values(5, 1)).toBe("($1,$2,$3,$4,$5)");
  expect(QueryUtils.values(3, 3)).toBe("($1,$2,$3), ($4,$5,$6), ($7,$8,$9)");
});
