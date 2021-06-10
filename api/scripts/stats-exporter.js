"use strict";
/*
  This is a script that exports some statistics for Singlelink.
  Environment vars:
  POSTGRESQL - Postgresql Connection String

  NPM command:
  npm run export-stats  - export stats
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var pg_1 = require("pg");
var fs_1 = require("fs");
var StatsExporter = /** @class */ (function () {
    function StatsExporter() {
        var _a;
        this.pgUrl = (_a = process.env.POSTGRESQL) !== null && _a !== void 0 ? _a : "";
        if (!this.pgUrl) {
            console.error("No POSTGRESQL environment variable was specified!");
            process.exit(0);
            return;
        }
        this.pool = new pg_1.Pool({
            connectionString: this.pgUrl,
            ssl: {
                rejectUnauthorized: false
            }
        });
        this.pool.on("error", function (client) {
            console.error("PG Database error! " + client.name + ", " + client.message + ", " + client.stack);
        });
    }
    StatsExporter.prototype.countProfilesCreated = function (daysMin, daysMax) {
        if (daysMin === void 0) { daysMin = 0; }
        if (daysMax === void 0) { daysMax = 30; }
        return __awaiter(this, void 0, void 0, function () {
            var queryResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.pool.query("select count(*)\n                                               from app.profiles\n                                               where profiles.created_on < current_date - interval '1 day' * $1\n                                                 and profiles.created_on > current_date - interval '1 day' * $2", [
                            daysMin,
                            daysMax
                        ])];
                    case 1:
                        queryResult = _a.sent();
                        return [2 /*return*/, {
                                name: "profiles created (past " + daysMin + " to " + daysMax + " day(s))",
                                range: daysMax - daysMin + " day(s)",
                                count: queryResult.rows[0].count
                            }];
                }
            });
        });
    };
    StatsExporter.prototype.countProfilesWithPageVisits = function (daysMin, daysMax) {
        if (daysMin === void 0) { daysMin = 0; }
        if (daysMax === void 0) { daysMax = 30; }
        return __awaiter(this, void 0, void 0, function () {
            var queryResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.pool.query("select count(*)\n                                               from app.profiles\n                                               where exists(select 1\n                                                            from analytics.visits\n                                                            where type = 'page'\n                                                              and referral_id = app.profiles.user_id\n                                                              and profiles.created_on < current_date - interval '1 day' * $1\n                                                              and profiles.created_on > current_date - interval '1 day' * $2);", [
                            daysMin,
                            daysMax
                        ])];
                    case 1:
                        queryResult = _a.sent();
                        return [2 /*return*/, {
                                name: "profiles with page visits (past " + daysMin + " to " + daysMax + " day(s))",
                                range: daysMax - daysMin + " day(s)",
                                count: queryResult.rows[0].count
                            }];
                }
            });
        });
    };
    StatsExporter.prototype.countProfilesWithLinkVisits = function (daysMin, daysMax) {
        if (daysMin === void 0) { daysMin = 0; }
        if (daysMax === void 0) { daysMax = 30; }
        return __awaiter(this, void 0, void 0, function () {
            var queryResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.pool.query("select count(*)\n                                               from app.links\n                                               where exists(select 1\n                                                            from analytics.visits\n                                                            where type = 'link'\n                                                              and referral_id = app.links.profile_id\n                                                              and links.created_on < current_date - interval '1 day' * $1\n                                                              and links.created_on > current_date - interval '1 day' * $2);", [
                            daysMin,
                            daysMax
                        ])];
                    case 1:
                        queryResult = _a.sent();
                        return [2 /*return*/, {
                                name: "profiles with link clicks (past " + daysMin + " to " + daysMax + " day(s))",
                                range: daysMax - daysMin + " day(s)",
                                count: queryResult.rows[0].count
                            }];
                }
            });
        });
    };
    StatsExporter.prototype.countProfilesWithLinksCreated = function (daysMin, daysMax) {
        if (daysMin === void 0) { daysMin = 0; }
        if (daysMax === void 0) { daysMax = 30; }
        return __awaiter(this, void 0, void 0, function () {
            var queryResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.pool.query("select count(*)\n                                               from app.profiles\n                                               where exists(select 1\n                                                            from app.links\n                                                            where app.profiles.id = app.links.profile_id\n                                                              and links.created_on < current_date - interval '1 day' * $1\n                                                              and links.created_on > current_date - interval '1 day' * $2)", [
                            daysMin,
                            daysMax
                        ])];
                    case 1:
                        queryResult = _a.sent();
                        return [2 /*return*/, {
                                name: "links created (past " + daysMin + " to " + daysMax + " day(s))",
                                range: daysMax - daysMin + " day(s)",
                                count: queryResult.rows[0].count
                            }];
                }
            });
        });
    };
    StatsExporter.prototype.countUsersWithMultipleProfiles = function () {
        return __awaiter(this, void 0, void 0, function () {
            var queryResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.pool.query("select count(*)\n                                               from app.users\n                                               where (select count(*)\n                                                      from app.profiles\n                                                      where app.profiles.user_id = app.users.id) > 1")];
                    case 1:
                        queryResult = _a.sent();
                        return [2 /*return*/, {
                                name: "users with multiple profiles",
                                range: "all",
                                count: queryResult.rows[0].count
                            }];
                }
            });
        });
    };
    StatsExporter.prototype.countUsersCreated = function (daysMin, daysMax) {
        if (daysMin === void 0) { daysMin = 0; }
        if (daysMax === void 0) { daysMax = 30; }
        return __awaiter(this, void 0, void 0, function () {
            var queryResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.pool.query("select count(*)\n                                               from app.users\n                                               where users.created_on < current_date - interval '1 day' * $1\n                                                 and users.created_on > current_date - interval '1 day' * $2;", [
                            daysMin,
                            daysMax
                        ])];
                    case 1:
                        queryResult = _a.sent();
                        return [2 /*return*/, {
                                name: "users created (past " + daysMin + " to " + daysMax + " day(s))",
                                range: daysMax - daysMin + " day(s)",
                                count: queryResult.rows[0].count
                            }];
                }
            });
        });
    };
    StatsExporter.prototype.averagePageVisitsPerProfile = function () {
        return __awaiter(this, void 0, void 0, function () {
            var queryResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.pool.query("select avg((select count(*)\n                                                           from analytics.visits\n                                                           where type = 'page' and referral_id = app.profiles.id))\n                                               from app.profiles")];
                    case 1:
                        queryResult = _a.sent();
                        return [2 /*return*/, {
                                name: "average page visits per profile",
                                range: "all",
                                count: queryResult.rows[0].avg
                            }];
                }
            });
        });
    };
    StatsExporter.prototype.exportAll = function () {
        return __awaiter(this, void 0, void 0, function () {
            var json, _a, _b, _c, _d, daysIncrement, maxDays, i, _e, _f, i, _g, _h, i, _j, _k, i, _l, _m, i, _o, _p, i, _q, _r, i, _s, _t, i, _u, _v, i, _w, _x, i, _y, _z;
            return __generator(this, function (_0) {
                switch (_0.label) {
                    case 0:
                        json = [];
                        _b = (_a = json).push;
                        return [4 /*yield*/, this.countUsersWithMultipleProfiles()];
                    case 1:
                        _b.apply(_a, [_0.sent()]);
                        _d = (_c = json).push;
                        return [4 /*yield*/, this.averagePageVisitsPerProfile()];
                    case 2:
                        _d.apply(_c, [_0.sent()]);
                        daysIncrement = 1;
                        maxDays = 8;
                        i = 0;
                        _0.label = 3;
                    case 3:
                        if (!(i < maxDays)) return [3 /*break*/, 6];
                        _f = (_e = json).push;
                        return [4 /*yield*/, this.countUsersCreated(i, i + daysIncrement)];
                    case 4:
                        _f.apply(_e, [_0.sent()]);
                        _0.label = 5;
                    case 5:
                        i += daysIncrement;
                        return [3 /*break*/, 3];
                    case 6:
                        i = 0;
                        _0.label = 7;
                    case 7:
                        if (!(i < maxDays)) return [3 /*break*/, 10];
                        _h = (_g = json).push;
                        return [4 /*yield*/, this.countProfilesCreated(i, i + daysIncrement)];
                    case 8:
                        _h.apply(_g, [_0.sent()]);
                        _0.label = 9;
                    case 9:
                        i += daysIncrement;
                        return [3 /*break*/, 7];
                    case 10:
                        i = 0;
                        _0.label = 11;
                    case 11:
                        if (!(i < maxDays)) return [3 /*break*/, 14];
                        _k = (_j = json).push;
                        return [4 /*yield*/, this.countProfilesWithPageVisits(i, i + daysIncrement)];
                    case 12:
                        _k.apply(_j, [_0.sent()]);
                        _0.label = 13;
                    case 13:
                        i += daysIncrement;
                        return [3 /*break*/, 11];
                    case 14:
                        i = 0;
                        _0.label = 15;
                    case 15:
                        if (!(i < maxDays)) return [3 /*break*/, 18];
                        _m = (_l = json).push;
                        return [4 /*yield*/, this.countProfilesWithLinkVisits(i, i + daysIncrement)];
                    case 16:
                        _m.apply(_l, [_0.sent()]);
                        _0.label = 17;
                    case 17:
                        i += daysIncrement;
                        return [3 /*break*/, 15];
                    case 18:
                        i = 0;
                        _0.label = 19;
                    case 19:
                        if (!(i < maxDays)) return [3 /*break*/, 22];
                        _p = (_o = json).push;
                        return [4 /*yield*/, this.countProfilesWithLinksCreated(i, i + daysIncrement)];
                    case 20:
                        _p.apply(_o, [_0.sent()]);
                        _0.label = 21;
                    case 21:
                        i += daysIncrement;
                        return [3 /*break*/, 19];
                    case 22:
                        i = 0;
                        _0.label = 23;
                    case 23:
                        if (!(i < maxDays)) return [3 /*break*/, 26];
                        _r = (_q = json).push;
                        return [4 /*yield*/, this.countUsersCreated(0, i + daysIncrement)];
                    case 24:
                        _r.apply(_q, [_0.sent()]);
                        _0.label = 25;
                    case 25:
                        i += daysIncrement;
                        return [3 /*break*/, 23];
                    case 26:
                        i = 0;
                        _0.label = 27;
                    case 27:
                        if (!(i < maxDays)) return [3 /*break*/, 30];
                        _t = (_s = json).push;
                        return [4 /*yield*/, this.countProfilesCreated(0, i + daysIncrement)];
                    case 28:
                        _t.apply(_s, [_0.sent()]);
                        _0.label = 29;
                    case 29:
                        i += daysIncrement;
                        return [3 /*break*/, 27];
                    case 30:
                        i = 0;
                        _0.label = 31;
                    case 31:
                        if (!(i < maxDays)) return [3 /*break*/, 34];
                        _v = (_u = json).push;
                        return [4 /*yield*/, this.countProfilesWithPageVisits(0, i + daysIncrement)];
                    case 32:
                        _v.apply(_u, [_0.sent()]);
                        _0.label = 33;
                    case 33:
                        i += daysIncrement;
                        return [3 /*break*/, 31];
                    case 34:
                        i = 0;
                        _0.label = 35;
                    case 35:
                        if (!(i < maxDays)) return [3 /*break*/, 38];
                        _x = (_w = json).push;
                        return [4 /*yield*/, this.countProfilesWithLinkVisits(0, i + daysIncrement)];
                    case 36:
                        _x.apply(_w, [_0.sent()]);
                        _0.label = 37;
                    case 37:
                        i += daysIncrement;
                        return [3 /*break*/, 35];
                    case 38:
                        i = 0;
                        _0.label = 39;
                    case 39:
                        if (!(i < maxDays)) return [3 /*break*/, 42];
                        _z = (_y = json).push;
                        return [4 /*yield*/, this.countProfilesWithLinksCreated(0, i + daysIncrement)];
                    case 40:
                        _z.apply(_y, [_0.sent()]);
                        _0.label = 41;
                    case 41:
                        i += daysIncrement;
                        return [3 /*break*/, 39];
                    case 42: return [2 /*return*/, json];
                }
            });
        });
    };
    return StatsExporter;
}());
function start() {
    return __awaiter(this, void 0, void 0, function () {
        var filename, manager, jsonData, jsonString, err_1, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Collecting stats...");
                    filename = "stats/sl-stats-" + Date.now() + ".json";
                    manager = new StatsExporter();
                    return [4 /*yield*/, manager.exportAll()];
                case 1:
                    jsonData = _a.sent();
                    jsonString = JSON.stringify(jsonData, undefined, 2);
                    console.log("Done collecting! \nExporting...");
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, fs_1.default.promises.mkdir('stats')];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    err_1 = _a.sent();
                    return [3 /*break*/, 5];
                case 5:
                    _a.trys.push([5, 7, , 8]);
                    return [4 /*yield*/, fs_1.default.promises.writeFile(filename, jsonString)];
                case 6:
                    _a.sent();
                    return [3 /*break*/, 8];
                case 7:
                    err_2 = _a.sent();
                    console.error('Error occurred while exporting data!', err_2);
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    });
}
// Entry point
(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, start()];
            case 1:
                _a.sent();
                process.exit(0);
                return [2 /*return*/];
        }
    });
}); })();
