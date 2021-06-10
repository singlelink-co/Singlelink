"use strict";
/*
  This is a script that manages admins in Singlelink.
  Environment vars:
  POSTGRESQL - Postgresql Connection String

  The commands are:
  admins                - list all the admins
  admin add <email>     - Add an admin with the given email
  admin remove <email>  - Remove an admin with the given email

  NPM variants:
  npm run list-admins                   - list all the admins
  npm run add-admin add <email>        - Add an admin with the given email
  npm run remove-admin remove <email>  - Remove an admin with the given email
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
var user_service_1 = require("../src/services/user-service");
var database_manager_1 = require("../src/data/database-manager");
var fs = require("fs");
var SinglelinkManager = /** @class */ (function () {
    function SinglelinkManager() {
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
        this.databaseManager = new database_manager_1.DatabaseManager();
        this.databaseManager.pool = this.pool;
        this.userService = new user_service_1.UserService(this.databaseManager);
    }
    SinglelinkManager.prototype.parseInput = function () {
        return __awaiter(this, void 0, void 0, function () {
            var args, command, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        args = process.argv;
                        args.splice(0, 2);
                        command = args[0];
                        _a = command;
                        switch (_a) {
                            case "admin": return [3 /*break*/, 1];
                            case "admins": return [3 /*break*/, 8];
                        }
                        return [3 /*break*/, 10];
                    case 1:
                        if (args.length < 3) {
                            console.log("You need to provide the email of the user.");
                        }
                        if (!(args[1].toLowerCase() === "add")) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.addAdmin(args[2])];
                    case 2:
                        _b.sent();
                        return [3 /*break*/, 7];
                    case 3:
                        if (!(args[1].toLowerCase() == "remove")) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.removeAdmin(args[2])];
                    case 4:
                        _b.sent();
                        return [3 /*break*/, 7];
                    case 5:
                        if (!(args[1].toLowerCase() == "gdpr-package")) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.downloadDataPackage(args[2])];
                    case 6:
                        _b.sent();
                        _b.label = 7;
                    case 7: return [3 /*break*/, 10];
                    case 8: return [4 /*yield*/, this.listAdmins()];
                    case 9:
                        _b.sent();
                        return [3 /*break*/, 10];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    SinglelinkManager.prototype.addAdmin = function (email) {
        return __awaiter(this, void 0, void 0, function () {
            var userQuery;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.pool.query("select id from app.users where email=$1", [email])];
                    case 1:
                        userQuery = _a.sent();
                        if (userQuery.rowCount < 1) {
                            console.log("The email wasn't found in the system.");
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.pool.query("insert into app.perm_groups(user_id, group_name) values ($1, 'admin')", [userQuery.rows[0].id])];
                    case 2:
                        _a.sent();
                        console.log("Added admin with email: " + email);
                        return [2 /*return*/];
                }
            });
        });
    };
    SinglelinkManager.prototype.removeAdmin = function (email) {
        return __awaiter(this, void 0, void 0, function () {
            var userQuery, permQuery;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.pool.query("select id from app.users where email=$1", [email])];
                    case 1:
                        userQuery = _a.sent();
                        if (userQuery.rowCount < 1) {
                            console.log("The email wasn't found in the system.");
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.pool.query("delete from app.perm_groups where user_id=$1", [userQuery.rows[0].id])];
                    case 2:
                        permQuery = _a.sent();
                        if (permQuery.rowCount < 1) {
                            console.log("The user with the given email wasn't an admin.");
                            return [2 /*return*/];
                        }
                        console.log("Removed admin with email: " + email);
                        return [2 /*return*/];
                }
            });
        });
    };
    SinglelinkManager.prototype.listAdmins = function () {
        return __awaiter(this, void 0, void 0, function () {
            var permQuery, _i, _a, row, user;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.pool.query("select * from app.perm_groups where group_name='admin'")];
                    case 1:
                        permQuery = _b.sent();
                        if (permQuery.rowCount < 1) {
                            console.log("There are no admins. Create one with `admin add <email>`");
                        }
                        _i = 0, _a = permQuery.rows;
                        _b.label = 2;
                    case 2:
                        if (!(_i < _a.length)) return [3 /*break*/, 5];
                        row = _a[_i];
                        return [4 /*yield*/, this.pool.query("select email from app.users where id=$1", [row.user_id])];
                    case 3:
                        user = _b.sent();
                        if (user.rowCount > 0) {
                            console.log(user.rows[0].email + " Group: " + row.group_name + " Perms: " + user.rows[0].permissions);
                        }
                        _b.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    SinglelinkManager.prototype.downloadDataPackage = function (email) {
        return __awaiter(this, void 0, void 0, function () {
            var user, data, filename;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userService.getUserByEmail(email)];
                    case 1:
                        user = _a.sent();
                        return [4 /*yield*/, this.userService.generateDataPackage(user)];
                    case 2:
                        data = _a.sent();
                        filename = user.id + '-data-package.json';
                        fs.writeFileSync(filename, data);
                        return [2 /*return*/];
                }
            });
        });
    };
    return SinglelinkManager;
}());
function start() {
    return __awaiter(this, void 0, void 0, function () {
        var manager;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    manager = new SinglelinkManager();
                    return [4 /*yield*/, manager.parseInput()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
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
