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
exports.SecurityUtils = void 0;
var crypto_1 = require("crypto");
var SecurityUtils = /** @class */ (function () {
    function SecurityUtils() {
    }
    /**
     * Initialize Security Utils.
     * @param pool
     */
    SecurityUtils.initialize = function (pool) {
        this.pool = pool;
    };
    /**
     * Generates a random password string. Maximum possible length 32 characters, minimum length 20.
     */
    SecurityUtils.generateRandomPassword = function () {
        return Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
    };
    /**
     * Generates a nonce value with the specified length.
     *
     * @param length
     */
    SecurityUtils.generateNonce = function (length) {
        if (length === void 0) { length = 32; }
        var charset = '0123456789ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvwxyz-._';
        var result = '';
        while (length > 0) {
            var random = crypto_1.default.pseudoRandomBytes(length);
            random.forEach(function (c) {
                if (length == 0) {
                    return;
                }
                if (c < charset.length) {
                    result += charset[c];
                    length--;
                }
            });
        }
        return result;
    };
    /**
     * Checks if a user is banned. If it is, return a DbBanned object. Otherwise, return null.
     * @param userId
     */
    SecurityUtils.isBanned = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var queryResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.pool.query("select * from security.banned where user_id=$1", [userId])];
                    case 1:
                        queryResult = _a.sent();
                        if (queryResult.rowCount < 1)
                            return [2 /*return*/, null];
                        return [2 /*return*/, queryResult.rows[0]];
                }
            });
        });
    };
    /**
     * Records a nonce for tracking.
     * @param nonce
     *
     * @return true if the Nonce was successfully recorded (never used), or false if it's already in the database
     */
    SecurityUtils.recordNonce = function (nonce) {
        return __awaiter(this, void 0, void 0, function () {
            var queryResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.pool.query("insert into security.nonces values ($1)", [nonce])];
                    case 1:
                        queryResult = _a.sent();
                        return [2 /*return*/, queryResult.rowCount >= 1];
                }
            });
        });
    };
    /**
     * Uses up a nonce.
     * @param nonce
     *
     * @return true if the Nonce was successfully expired, otherwise returns false
     */
    SecurityUtils.expireNonce = function (nonce) {
        return __awaiter(this, void 0, void 0, function () {
            var queryResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.pool.query("delete from security.nonces where nonce=$1 returning *", [nonce])];
                    case 1:
                        queryResult = _a.sent();
                        return [2 /*return*/, queryResult.rowCount >= 1];
                }
            });
        });
    };
    /**
     * Validates a nonce by making sure it exists in the DB.
     *
     * @param nonce
     * @return true if the Nonce is valid, false otherwise
     */
    SecurityUtils.validateNonce = function (nonce) {
        return __awaiter(this, void 0, void 0, function () {
            var queryResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.pool.query("select * from security.nonces where nonce=$1 limit 1", [nonce])];
                    case 1:
                        queryResult = _a.sent();
                        return [2 /*return*/, queryResult.rowCount > 0];
                }
            });
        });
    };
    /**
     * Returns true if a token is expired.
     *
     * @param token
     */
    SecurityUtils.isTokenExpired = function (token) {
        return __awaiter(this, void 0, void 0, function () {
            var queryResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.pool.query("select 1 from security.expired_tokens where token=$1", [token])];
                    case 1:
                        queryResult = _a.sent();
                        return [2 /*return*/, queryResult.rowCount > 0];
                }
            });
        });
    };
    /**
     * Expires a token.
     *
     * @param userId
     * @param token
     */
    SecurityUtils.expireToken = function (userId, token) {
        return __awaiter(this, void 0, void 0, function () {
            var queryResult, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.pool.query("insert into security.expired_tokens(user_id, token) values ($1, $2) returning *", [userId, token])];
                    case 1:
                        queryResult = _a.sent();
                        return [2 /*return*/, queryResult.rowCount > 0];
                    case 2:
                        e_1 = _a.sent();
                        if (e_1.code === "23505" /* UNIQUE_VIOLATION */) {
                            return [2 /*return*/, false];
                        }
                        // we can't deal with this error
                        throw e_1;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return SecurityUtils;
}());
exports.SecurityUtils = SecurityUtils;
