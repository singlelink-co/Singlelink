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
exports.Auth = void 0;
var jsonwebtoken_1 = require("jsonwebtoken");
var config_1 = require("../config/config");
var reply_utils_1 = require("./reply-utils");
var http_status_codes_1 = require("http-status-codes");
var db_type_converter_1 = require("./db-type-converter");
/**
 * A convenience class for Fastify Handler options regarding authentication.
 */
var Auth = /** @class */ (function () {
    function Auth() {
    }
    /**
     * Initialize Auth.
     * @param pool
     */
    Auth.initialize = function (pool) {
        this.pool = pool;
    };
    /**
     * Checks for authentication before allowing a request to pass through.
     *
     * @param request
     * @param reply
     * @param done
     */
    Auth.validateAuth = function (request, reply, done) {
        var body = request.body;
        var token = body === null || body === void 0 ? void 0 : body.token;
        if (!token) {
            reply.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).send(reply_utils_1.ReplyUtils.error("Token was missing."));
            return;
        }
        jsonwebtoken_1.default.verify(token, config_1.config.secret, function (err, decoded) {
            return __awaiter(this, void 0, void 0, function () {
                var dAuthToken;
                return __generator(this, function (_a) {
                    if (err) {
                        reply.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).send(reply_utils_1.ReplyUtils.error("Error while validating token.", err));
                        return [2 /*return*/];
                    }
                    if (!decoded) {
                        reply.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).send(reply_utils_1.ReplyUtils.error("Unable to verify user, invalid token."));
                        return [2 /*return*/];
                    }
                    dAuthToken = decoded;
                    if (!(dAuthToken === null || dAuthToken === void 0 ? void 0 : dAuthToken.userId)) {
                        reply.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).send(reply_utils_1.ReplyUtils.error("Unable to verify user, invalid token."));
                        return [2 /*return*/];
                    }
                    if ((dAuthToken === null || dAuthToken === void 0 ? void 0 : dAuthToken.type) !== "auth") {
                        reply.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).send(reply_utils_1.ReplyUtils.error("Invalid token type."));
                        return [2 /*return*/];
                    }
                    done();
                    return [2 /*return*/];
                });
            });
        });
    };
    /**
     * Checks for authentication before allowing a request to pass through.
     * Also adds user and profile data to the FastifyRequest to be passed to the handlers.
     *
     * @param request
     * @param reply
     * @param done
     */
    Auth.validateAuthWithData = function (request, reply, done) {
        var body = request.body;
        var token = body === null || body === void 0 ? void 0 : body.token;
        if (!token) {
            reply.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).send(reply_utils_1.ReplyUtils.error("Token was missing."));
            return;
        }
        // Throw away passed in data (important!)
        // Otherwise someone could fake a valid token.
        body.authUser = undefined;
        body.authProfile = undefined;
        jsonwebtoken_1.default.verify(token, config_1.config.secret, function (err, decoded) {
            return __awaiter(this, void 0, void 0, function () {
                var dAuthToken, accountQuery, user, authRequest, profileQuery, profile, searchProfileQuery, profile, err_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (err) {
                                reply.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).send(reply_utils_1.ReplyUtils.error("Error while validating token.", err));
                                return [2 /*return*/];
                            }
                            if (!decoded) {
                                reply.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).send(reply_utils_1.ReplyUtils.error("Unable to verify user, invalid token."));
                                return [2 /*return*/];
                            }
                            dAuthToken = decoded;
                            if (!(dAuthToken === null || dAuthToken === void 0 ? void 0 : dAuthToken.userId)) {
                                reply.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).send(reply_utils_1.ReplyUtils.error("Unable to verify user, invalid token."));
                                return [2 /*return*/];
                            }
                            if ((dAuthToken === null || dAuthToken === void 0 ? void 0 : dAuthToken.type) !== "auth") {
                                reply.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).send(reply_utils_1.ReplyUtils.error("Invalid token type."));
                                return [2 /*return*/];
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 7, , 8]);
                            return [4 /*yield*/, Auth.pool.query("select * from app.users where id=$1", [
                                    dAuthToken.userId
                                ])];
                        case 2:
                            accountQuery = _a.sent();
                            if (accountQuery.rowCount < 1) {
                                reply.status(http_status_codes_1.StatusCodes.NOT_FOUND).send(reply_utils_1.ReplyUtils.error("Unable to find account with this token."));
                                return [2 /*return*/];
                            }
                            user = accountQuery.rows[0];
                            authRequest = request;
                            authRequest.body.authUser = db_type_converter_1.DbTypeConverter.toUser(user);
                            return [4 /*yield*/, Auth.pool.query("select * from app.profiles where id=$1", [
                                    user.active_profile_id
                                ])];
                        case 3:
                            profileQuery = _a.sent();
                            if (!(profileQuery.rowCount > 0)) return [3 /*break*/, 4];
                            profile = profileQuery.rows[0];
                            authRequest.body.authProfile = db_type_converter_1.DbTypeConverter.toProfile(profile);
                            return [3 /*break*/, 6];
                        case 4: return [4 /*yield*/, Auth.pool.query("select * from app.profiles where user_id=$1", [
                                user.id
                            ])];
                        case 5:
                            searchProfileQuery = _a.sent();
                            // Set the active profile to the first one we see
                            if (searchProfileQuery.rowCount > 0) {
                                profile = searchProfileQuery.rows[0];
                                authRequest.body.authProfile = db_type_converter_1.DbTypeConverter.toProfile(profile);
                            }
                            _a.label = 6;
                        case 6:
                            // Finally, after we've found all the data we need, we've attached it to the request and return it.
                            done();
                            return [2 /*return*/];
                        case 7:
                            err_1 = _a.sent();
                            if (err_1) {
                                reply.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send(reply_utils_1.ReplyUtils.error("Error while authenticating request.", err_1));
                                return [2 /*return*/];
                            }
                            return [3 /*break*/, 8];
                        case 8:
                            reply.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send(reply_utils_1.ReplyUtils.error("An unexpected error occurred."));
                            return [2 /*return*/];
                    }
                });
            });
        });
    };
    /**
     * Checks for authentication before allowing a request to pass through.
     * Also adds user and profile data to the FastifyRequest to be passed to the handlers.
     *
     * @param request
     * @param reply
     * @param done
     */
    Auth.validateSensitiveAuthWithData = function (request, reply, done) {
        var body = request.body;
        var token = body === null || body === void 0 ? void 0 : body.token;
        if (!token) {
            reply.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).send(reply_utils_1.ReplyUtils.error("Token was missing."));
            return;
        }
        // Throw away passed in data (important!)
        // Otherwise someone could fake a valid token.
        body.authUser = undefined;
        body.authProfile = undefined;
        jsonwebtoken_1.default.verify(token, config_1.config.secret, function (err, decoded) {
            return __awaiter(this, void 0, void 0, function () {
                var dAuthToken, accountQuery, user, authRequest, profileQuery, profile, searchProfileQuery, profile, err_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (err) {
                                reply.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).send(reply_utils_1.ReplyUtils.error("Error while validating token.", err));
                                return [2 /*return*/];
                            }
                            if (!decoded) {
                                reply.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).send(reply_utils_1.ReplyUtils.error("Unable to verify user, invalid token."));
                                return [2 /*return*/];
                            }
                            dAuthToken = decoded;
                            if (!(dAuthToken === null || dAuthToken === void 0 ? void 0 : dAuthToken.userId)) {
                                reply.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).send(reply_utils_1.ReplyUtils.error("Unable to verify user, invalid token."));
                                return [2 /*return*/];
                            }
                            if ((dAuthToken === null || dAuthToken === void 0 ? void 0 : dAuthToken.type) !== "auth") {
                                reply.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).send(reply_utils_1.ReplyUtils.error("Invalid token type."));
                                return [2 /*return*/];
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 7, , 8]);
                            return [4 /*yield*/, Auth.pool.query("select * from app.users where id=$1", [
                                    dAuthToken.userId
                                ])];
                        case 2:
                            accountQuery = _a.sent();
                            if (accountQuery.rowCount < 1) {
                                reply.status(http_status_codes_1.StatusCodes.NOT_FOUND).send(reply_utils_1.ReplyUtils.error("Unable to find account with this token."));
                                return [2 /*return*/];
                            }
                            user = accountQuery.rows[0];
                            authRequest = request;
                            authRequest.body.authUser = db_type_converter_1.DbTypeConverter.toSensitiveUser(user);
                            return [4 /*yield*/, Auth.pool.query("select * from app.profiles where id=$1", [
                                    user.active_profile_id
                                ])];
                        case 3:
                            profileQuery = _a.sent();
                            if (!(profileQuery.rowCount > 0)) return [3 /*break*/, 4];
                            profile = profileQuery.rows[0];
                            authRequest.body.authProfile = db_type_converter_1.DbTypeConverter.toSensitiveProfile(profile);
                            return [3 /*break*/, 6];
                        case 4: return [4 /*yield*/, Auth.pool.query("select * from app.profiles where user_id=$1", [
                                user.id
                            ])];
                        case 5:
                            searchProfileQuery = _a.sent();
                            // Set the active profile to the first one we see
                            if (searchProfileQuery.rowCount > 0) {
                                profile = searchProfileQuery.rows[0];
                                authRequest.body.authProfile = db_type_converter_1.DbTypeConverter.toSensitiveProfile(profile);
                            }
                            _a.label = 6;
                        case 6:
                            // Finally, after we've found all the data we need, we've attached it to the request and return it.
                            done();
                            return [2 /*return*/];
                        case 7:
                            err_2 = _a.sent();
                            if (err_2) {
                                reply.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send(reply_utils_1.ReplyUtils.error("Error while authenticating request.", err_2));
                                return [2 /*return*/];
                            }
                            return [3 /*break*/, 8];
                        case 8:
                            reply.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send(reply_utils_1.ReplyUtils.error("An unexpected error occurred."));
                            return [2 /*return*/];
                    }
                });
            });
        });
    };
    /**
     * Checks for admin privileges and authentication before allowing a request to pass through.
     * Also adds user and profile data to the FastifyRequest to be passed to the handlers.
     *
     * @param request
     * @param reply
     * @param done
     */
    Auth.validateAdminWithData = function (request, reply, done) {
        var body = request.body;
        var token = body === null || body === void 0 ? void 0 : body.token;
        if (!token) {
            reply.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).send(reply_utils_1.ReplyUtils.error("Token was missing."));
            return;
        }
        // Throw away passed in data (important!)
        // Otherwise someone could fake a valid token.
        body.authUser = undefined;
        body.authProfile = undefined;
        jsonwebtoken_1.default.verify(token, config_1.config.secret, function (err, decoded) {
            return __awaiter(this, void 0, void 0, function () {
                var dAuthToken, accountQuery, user, authRequest, profileQuery, profile, searchProfileQuery, profile, permQuery, permGroup, err_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (err) {
                                reply.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).send(reply_utils_1.ReplyUtils.error("Error while validating token.", err));
                                return [2 /*return*/];
                            }
                            if (!decoded) {
                                reply.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).send(reply_utils_1.ReplyUtils.error("Unable to verify user, invalid token."));
                                return [2 /*return*/];
                            }
                            dAuthToken = decoded;
                            if (!(dAuthToken === null || dAuthToken === void 0 ? void 0 : dAuthToken.userId)) {
                                reply.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).send(reply_utils_1.ReplyUtils.error("Unable to verify user, invalid token."));
                                return [2 /*return*/];
                            }
                            if ((dAuthToken === null || dAuthToken === void 0 ? void 0 : dAuthToken.type) !== "auth") {
                                reply.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).send(reply_utils_1.ReplyUtils.error("Invalid token type."));
                                return [2 /*return*/];
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 8, , 9]);
                            return [4 /*yield*/, Auth.pool.query("select * from app.users where id=$1", [
                                    dAuthToken.userId
                                ])];
                        case 2:
                            accountQuery = _a.sent();
                            if (accountQuery.rowCount < 1) {
                                reply.status(http_status_codes_1.StatusCodes.NOT_FOUND).send(reply_utils_1.ReplyUtils.error("Unable to find account with this token."));
                                return [2 /*return*/];
                            }
                            user = accountQuery.rows[0];
                            authRequest = request;
                            authRequest.body.authUser = db_type_converter_1.DbTypeConverter.toUser(user);
                            return [4 /*yield*/, Auth.pool.query("select * from app.profiles where id=$1", [
                                    user.active_profile_id
                                ])];
                        case 3:
                            profileQuery = _a.sent();
                            if (!(profileQuery.rowCount > 0)) return [3 /*break*/, 4];
                            profile = profileQuery.rows[0];
                            authRequest.body.authProfile = db_type_converter_1.DbTypeConverter.toProfile(profile);
                            return [3 /*break*/, 6];
                        case 4: return [4 /*yield*/, Auth.pool.query("select * from app.profiles where user_id=$1", [
                                user.id
                            ])];
                        case 5:
                            searchProfileQuery = _a.sent();
                            // Set the active profile to the first one we see
                            if (searchProfileQuery.rowCount > 0) {
                                profile = searchProfileQuery.rows[0];
                                authRequest.body.authProfile = db_type_converter_1.DbTypeConverter.toProfile(profile);
                            }
                            _a.label = 6;
                        case 6: return [4 /*yield*/, Auth.pool.query("select * from app.perm_groups where user_id=$1", [
                                user.id
                            ])];
                        case 7:
                            permQuery = _a.sent();
                            if (permQuery.rowCount > 0) {
                                permGroup = permQuery.rows[0];
                                authRequest.body.permGroup = db_type_converter_1.DbTypeConverter.toPermGroup(permGroup);
                                if (authRequest.body.permGroup.groupName !== "admin") {
                                    reply.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).send(reply_utils_1.ReplyUtils.error("This user doesn't have the correct permissions."));
                                    return [2 /*return*/];
                                }
                            }
                            else {
                                reply.status(http_status_codes_1.StatusCodes.NOT_FOUND).send(reply_utils_1.ReplyUtils.error("This user doesn't have any permissions."));
                                return [2 /*return*/];
                            }
                            // Finally, after we've found all the data we need, we've attached it to the request and return it.
                            done();
                            return [2 /*return*/];
                        case 8:
                            err_3 = _a.sent();
                            if (err_3) {
                                reply.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send(reply_utils_1.ReplyUtils.error("Error while authenticating request.", err_3));
                                return [2 /*return*/];
                            }
                            return [3 /*break*/, 9];
                        case 9:
                            reply.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send(reply_utils_1.ReplyUtils.error("An unexpected error occurred."));
                            return [2 /*return*/];
                    }
                });
            });
        });
    };
    Auth.checkGoogleAuthId = function (service, userId, googleId) {
        return __awaiter(this, void 0, void 0, function () {
            var queryResult, googleEnabledQuery;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.pool.query("select 1 from app.users where id=$1", [userId])];
                    case 1:
                        queryResult = _a.sent();
                        if (queryResult.rowCount < 1)
                            return [2 /*return*/, false];
                        return [4 /*yield*/, this.pool.query("select 1 from app.users where id=$1 and private_metadata->>'googleId'=$2", [userId, googleId])];
                    case 2:
                        googleEnabledQuery = _a.sent();
                        return [2 /*return*/, googleEnabledQuery.rowCount >= 1];
                }
            });
        });
    };
    /**
     * Validates ownership of the requested resource.
     */
    Auth.checkLinkOwnership = function (service, linkId, profile) {
        return __awaiter(this, void 0, void 0, function () {
            var pool, queryResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        pool = service.pool;
                        return [4 /*yield*/, pool.query("select count(*) from app.links where id=$1 and profile_id=$2", [linkId, profile.id])];
                    case 1:
                        queryResult = _a.sent();
                        return [2 /*return*/, queryResult.rows[0].count > 0];
                }
            });
        });
    };
    /**
     * Validates ownership of the requested resource.
     */
    Auth.checkThemeOwnership = function (service, themeId, user, includeGlobal) {
        return __awaiter(this, void 0, void 0, function () {
            var pool, queryResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        pool = service.pool;
                        if (!includeGlobal) return [3 /*break*/, 2];
                        return [4 /*yield*/, pool.query("select count(*) from app.themes where id=$1 and (user_id=$2 or global=true)", [themeId, user.id])];
                    case 1:
                        queryResult = _a.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, pool.query("select count(*) from app.themes where id=$1 and (user_id=$2)", [themeId, user.id])];
                    case 3:
                        queryResult = _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/, queryResult.rows[0].count > 0];
                }
            });
        });
    };
    /**
     * Validates ownership of an addon.
     * @param service
     * @param addonId
     * @param user
     */
    Auth.checkAddonOwnership = function (service, addonId, user) {
        return __awaiter(this, void 0, void 0, function () {
            var pool, queryResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        pool = service.pool;
                        return [4 /*yield*/, pool.query("select count(*) from marketplace.addons where id=$1 and (user_id=$2)", [addonId, user.id])];
                    case 1:
                        queryResult = _a.sent();
                        return [2 /*return*/, queryResult.rows[0].count > 0];
                }
            });
        });
    };
    /**
     * Validates ownership of an addon.
     * @param service
     * @param addonId
     * @param user
     */
    Auth.checkAddonPermission = function (service, addonId, user) {
        return __awaiter(this, void 0, void 0, function () {
            var pool, queryResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        pool = service.pool;
                        return [4 /*yield*/, pool.query("select count(*) from marketplace.addons where id=$1 and (user_id=$2 or global=true)", [addonId, user.id])];
                    case 1:
                        queryResult = _a.sent();
                        return [2 /*return*/, queryResult.rows[0].count > 0];
                }
            });
        });
    };
    /**
     * Authenticate only, do not pass in an AuthenticatedRequest. This has better performance
     * since the server does not need to communicate with the database.
     */
    Auth.ValidateOnly = {
        preHandler: Auth.validateAuth,
    };
    /**
     * Authenticate and pass in an AuthenticatedRequest instead of just validating. Useful when
     * you need user and profile data.
     */
    Auth.ValidateWithData = {
        preHandler: Auth.validateAuthWithData,
    };
    /**
     * Authenticate and pass in an AuthenticatedRequest instead of just validating. Useful when
     * you need user and profile data.
     */
    Auth.ValidateSensitiveWithData = {
        preHandler: Auth.validateSensitiveAuthWithData,
    };
    /**
     * Authenticate Admin privileges and pass in an Admin request.
     */
    Auth.ValidateAdminWithData = {
        preHandler: Auth.validateAdminWithData,
    };
    return Auth;
}());
exports.Auth = Auth;
