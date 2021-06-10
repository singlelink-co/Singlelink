"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var query_utils_1 = require("../src/utils/query-utils");
test("test values function", function () {
    expect(query_utils_1.QueryUtils.values(5, 1)).toBe("($1,$2,$3,$4,$5)");
    expect(query_utils_1.QueryUtils.values(3, 3)).toBe("($1,$2,$3), ($4,$5,$6), ($7,$8,$9)");
});
