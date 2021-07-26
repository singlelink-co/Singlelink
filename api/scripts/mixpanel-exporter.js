"use strict";
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
var fs = require("fs");
var pg_1 = require("pg");
var MixpanelExporter = /** @class */ (function () {
    function MixpanelExporter() {
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
    MixpanelExporter.prototype.exportAll = function () {
        return __awaiter(this, void 0, void 0, function () {
            var profileIds, profileData, _i, profileIds_1, profileId, queryResult, dbProfile;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        profileIds = process.argv;
                        if (profileIds.length <= 2) {
                            console.log("No arguments found. Please provide all profile ids in a list.");
                            return [2 /*return*/, null];
                        }
                        profileIds.splice(0, 2);
                        profileData = [];
                        _i = 0, profileIds_1 = profileIds;
                        _a.label = 1;
                    case 1:
                        if (!(_i < profileIds_1.length)) return [3 /*break*/, 4];
                        profileId = profileIds_1[_i];
                        return [4 /*yield*/, this.pool.query("select * from app.profiles where id=$1 order by id", [profileId])];
                    case 2:
                        queryResult = _a.sent();
                        if (queryResult.rowCount <= 0)
                            return [3 /*break*/, 3];
                        dbProfile = queryResult.rows[0];
                        profileData.push({
                            id: dbProfile.id,
                            handle: dbProfile.handle,
                            createdOn: new Date(dbProfile.created_on).toISOString()
                        });
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4:
                        console.log("Queried " + profileIds.length + " profiles, found " + profileData.length + " profiles.");
                        return [2 /*return*/, profileData];
                }
            });
        });
    };
    return MixpanelExporter;
}());
function start() {
    return __awaiter(this, void 0, void 0, function () {
        var filename, manager, jsonData, jsonString, err_1, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Setting up...");
                    filename = "stats/sl-mixpanel-data-" + Date.now() + ".json";
                    manager = new MixpanelExporter();
                    console.log("Exporting...");
                    return [4 /*yield*/, manager.exportAll()];
                case 1:
                    jsonData = _a.sent();
                    if (!jsonData) {
                        console.log("JSON data was unable to be created.");
                        return [2 /*return*/];
                    }
                    jsonString = JSON.stringify(jsonData, undefined, 2);
                    console.log("Done collecting! \nWriting...");
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, fs.promises.mkdir('stats')];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    err_1 = _a.sent();
                    return [3 /*break*/, 5];
                case 5:
                    _a.trys.push([5, 7, , 8]);
                    return [4 /*yield*/, fs.promises.writeFile(filename, jsonString)];
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
