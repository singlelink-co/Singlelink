"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.UserService = void 0;
var bcrypt = require("bcrypt");
var config_1 = require("../config/config");
var jwt = require("jsonwebtoken");
var aws_sdk_1 = require("aws-sdk");
var database_service_1 = require("./database-service");
var db_type_converter_1 = require("../utils/db-type-converter");
var http_error_1 = require("../utils/http-error");
var http_status_codes_1 = require("http-status-codes");
var string_utils_1 = require("../utils/string-utils");
var crypto_1 = require("crypto");
var auth_1 = require("../utils/auth");
var url_1 = require("url");
var security_utils_1 = require("../utils/security-utils");
/**
 * This service takes care of transactional tasks for Accounts.
 */
var UserService = /** @class */ (function (_super) {
    __extends(UserService, _super);
    function UserService(databaseManager) {
        return _super.call(this, databaseManager) || this;
    }
    /**
     * Gets a user by the account Id.
     *
     * @param userId
     */
    UserService.prototype.getUser = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var queryResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.pool.query("select id, email_hash, full_name, active_profile_id, inventory, metadata, created_on from app.users where id=$1", [userId])];
                    case 1:
                        queryResult = _a.sent();
                        if (queryResult.rowCount < 1)
                            throw new http_error_1.HttpError(http_status_codes_1.StatusCodes.NOT_FOUND, "The user couldn't be found.");
                        return [2 /*return*/, db_type_converter_1.DbTypeConverter.toUser(queryResult.rows[0])];
                }
            });
        });
    };
    /**
     * Gets a user by their email.
     *
     * @param email
     */
    UserService.prototype.getUserByEmail = function (email) {
        return __awaiter(this, void 0, void 0, function () {
            var queryResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.pool.query("select id, email_hash, full_name, active_profile_id, inventory, metadata, created_on from app.users where email=$1", [email])];
                    case 1:
                        queryResult = _a.sent();
                        if (queryResult.rowCount < 1)
                            throw new http_error_1.HttpError(http_status_codes_1.StatusCodes.NOT_FOUND, "The user couldn't be found.");
                        return [2 /*return*/, db_type_converter_1.DbTypeConverter.toUser(queryResult.rows[0])];
                }
            });
        });
    };
    /**
     * Gets a user by their google id.
     *
     * @param googleId
     */
    UserService.prototype.getUserByGoogleId = function (googleId) {
        return __awaiter(this, void 0, void 0, function () {
            var queryResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.pool.query("select id, email_hash, full_name, active_profile_id, inventory, metadata, created_on from app.users where private_metadata->>'googleId'=$1", [googleId])];
                    case 1:
                        queryResult = _a.sent();
                        if (queryResult.rowCount < 1)
                            throw new http_error_1.HttpError(http_status_codes_1.StatusCodes.NOT_FOUND, "The user couldn't be found.");
                        return [2 /*return*/, db_type_converter_1.DbTypeConverter.toUser(queryResult.rows[0])];
                }
            });
        });
    };
    /**
     * Gets a sensitive user by the account Id.
     *
     * @param userId
     */
    UserService.prototype.getSensitiveUser = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var queryResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.pool.query("select id, email, email_hash, full_name, active_profile_id, inventory, metadata, created_on, private_metadata from app.users where id=$1", [userId])];
                    case 1:
                        queryResult = _a.sent();
                        if (queryResult.rowCount < 1)
                            throw new http_error_1.HttpError(http_status_codes_1.StatusCodes.NOT_FOUND, "The user couldn't be found.");
                        return [2 /*return*/, db_type_converter_1.DbTypeConverter.toSensitiveUser(queryResult.rows[0])];
                }
            });
        });
    };
    /**
     * Gets a user by their email.
     *
     * @param email
     */
    UserService.prototype.getSensitiveUserByEmail = function (email) {
        return __awaiter(this, void 0, void 0, function () {
            var queryResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.pool.query("select id, email, email_hash, full_name, active_profile_id, inventory, metadata, created_on, private_metadata from app.users where email=$1", [email])];
                    case 1:
                        queryResult = _a.sent();
                        if (queryResult.rowCount < 1)
                            throw new http_error_1.HttpError(http_status_codes_1.StatusCodes.NOT_FOUND, "The user couldn't be found.");
                        return [2 /*return*/, db_type_converter_1.DbTypeConverter.toSensitiveUser(queryResult.rows[0])];
                }
            });
        });
    };
    /**
     * Gets a user by their google id.
     *
     * @param googleId
     */
    UserService.prototype.getSensitiveUserByGoogleId = function (googleId) {
        return __awaiter(this, void 0, void 0, function () {
            var queryResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.pool.query("select id, email, email_hash, full_name, active_profile_id, inventory, metadata, created_on, private_metadata from app.users where private_metadata->>'googleId'=$1", [googleId])];
                    case 1:
                        queryResult = _a.sent();
                        if (queryResult.rowCount < 1)
                            throw new http_error_1.HttpError(http_status_codes_1.StatusCodes.NOT_FOUND, "The user couldn't be found.");
                        return [2 /*return*/, db_type_converter_1.DbTypeConverter.toSensitiveUser(queryResult.rows[0])];
                }
            });
        });
    };
    /**
     * Gets a sensitive user by the account Id.
     *
     * @param userId
     */
    UserService.prototype.getSensitiveUserWithPassword = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var queryResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.pool.query("select * from app.users where id=$1", [userId])];
                    case 1:
                        queryResult = _a.sent();
                        if (queryResult.rowCount < 1)
                            throw new http_error_1.HttpError(http_status_codes_1.StatusCodes.NOT_FOUND, "The user couldn't be found.");
                        return [2 /*return*/, db_type_converter_1.DbTypeConverter.toSensitiveUserWithPassword(queryResult.rows[0])];
                }
            });
        });
    };
    /**
     * Gets a user by their email.
     *
     * @param email
     */
    UserService.prototype.getSensitiveUserWithPasswordByEmail = function (email) {
        return __awaiter(this, void 0, void 0, function () {
            var queryResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.pool.query("select * from app.users where email=$1", [email])];
                    case 1:
                        queryResult = _a.sent();
                        if (queryResult.rowCount < 1)
                            throw new http_error_1.HttpError(http_status_codes_1.StatusCodes.NOT_FOUND, "The user couldn't be found.");
                        return [2 /*return*/, db_type_converter_1.DbTypeConverter.toSensitiveUserWithPassword(queryResult.rows[0])];
                }
            });
        });
    };
    /**
     * Gets a user by their google id.
     *
     * @param googleId
     */
    UserService.prototype.getSensitiveUserWithPasswordByGoogleId = function (googleId) {
        return __awaiter(this, void 0, void 0, function () {
            var queryResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.pool.query("select * from app.users where private_metadata->>'googleId'=$1", [googleId])];
                    case 1:
                        queryResult = _a.sent();
                        if (queryResult.rowCount < 1)
                            throw new http_error_1.HttpError(http_status_codes_1.StatusCodes.NOT_FOUND, "The user couldn't be found.");
                        return [2 /*return*/, db_type_converter_1.DbTypeConverter.toSensitiveUserWithPassword(queryResult.rows[0])];
                }
            });
        });
    };
    /**
     * Changes a userId's password requiring only a password reset token.
     *
     * @param token
     * @param password
     */
    UserService.prototype.setPasswordWithToken = function (token, password) {
        return __awaiter(this, void 0, void 0, function () {
            var decoded, hashedPassword, queryResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        decoded = jwt.verify(token, config_1.config.secret, {
                            maxAge: "15m"
                        });
                        if (!decoded.userId) {
                            return [2 /*return*/, false];
                        }
                        if ((decoded === null || decoded === void 0 ? void 0 : decoded.type) !== "password_reset") {
                            return [2 /*return*/, false];
                        }
                        return [4 /*yield*/, bcrypt.hash(password, 10)];
                    case 1:
                        hashedPassword = _a.sent();
                        return [4 /*yield*/, this.pool.query("update app.users set pass_hash=$2 where id=$1", [decoded.userId, hashedPassword])];
                    case 2:
                        queryResult = _a.sent();
                        if (queryResult.rowCount < 1)
                            throw new http_error_1.HttpError(http_status_codes_1.StatusCodes.NOT_FOUND, "The user couldn't be found.");
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Sends a password reset email.
     * @param email
     */
    UserService.prototype.sendPasswordResetEmail = function (email) {
        return __awaiter(this, void 0, void 0, function () {
            var user, token, urlString, params, parsedMessage, parsedSubject, emailParams, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getUserByEmail(email)];
                    case 1:
                        user = _a.sent();
                        token = jwt.sign({
                            userId: user.id,
                            type: "passwordReset"
                        }, config_1.config.secret, { expiresIn: '15m' });
                        urlString = config_1.config.editorDomain + "/forgot-password/change?";
                        params = new url_1.URLSearchParams({ token: token });
                        urlString += params.toString();
                        parsedMessage = string_utils_1.StringUtils.parseTemplate(config_1.config.messages.passwordResetEmail.message, { url: urlString });
                        parsedSubject = string_utils_1.StringUtils.parseTemplate(config_1.config.messages.passwordResetEmail.subject, { url: urlString });
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        emailParams = {
                            Destination: {
                                ToAddresses: [
                                    email,
                                ]
                            },
                            Message: {
                                Body: {
                                    Text: {
                                        Charset: config_1.config.messages.passwordResetEmail.messageCharset,
                                        Data: parsedMessage
                                    }
                                },
                                Subject: {
                                    Charset: config_1.config.messages.passwordResetEmail.subjectCharset,
                                    Data: parsedSubject
                                }
                            },
                            Source: config_1.config.aws.senderEmailAddress
                        };
                        return [4 /*yield*/, new aws_sdk_1.default.SES().sendEmail(emailParams).promise()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, user];
                    case 4:
                        e_1 = _a.sent();
                        console.error(e_1);
                        throw new http_error_1.HttpError(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "Failed to send email because of an internal server error: " + e_1.toString());
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Logs in a user and returns LoginResultData.
     *
     * @param email
     * @param password
     */
    UserService.prototype.loginWithEmail = function (email, password) {
        return __awaiter(this, void 0, void 0, function () {
            var user, profileQuery, activeProfile, valid, token;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getSensitiveUserWithPasswordByEmail(email)];
                    case 1:
                        user = _a.sent();
                        return [4 /*yield*/, this.pool.query("select * from app.profiles where user_id=$1", [user.id])];
                    case 2:
                        profileQuery = _a.sent();
                        if (profileQuery.rowCount > 0) {
                            activeProfile = db_type_converter_1.DbTypeConverter.toProfile(profileQuery.rows[0]);
                        }
                        return [4 /*yield*/, bcrypt.compare(password, user.passHash)];
                    case 3:
                        valid = _a.sent();
                        if (!valid) {
                            throw new http_error_1.HttpError(http_status_codes_1.StatusCodes.UNAUTHORIZED, "The password was incorrect.");
                        }
                        token = jwt.sign({ userId: user.id, type: "auth" }, config_1.config.secret, { expiresIn: '168h' });
                        return [2 /*return*/, {
                                user: {
                                    id: user.id,
                                    email: user.email
                                },
                                activeProfile: activeProfile,
                                token: token
                            }];
                }
            });
        });
    };
    /**
     * Logs in a user with Google OAuth and returns LoginResultData.
     *
     * @param userId
     * @param googleId
     */
    UserService.prototype.loginWithGoogle = function (userId, googleId) {
        return __awaiter(this, void 0, void 0, function () {
            var user, profileQuery, activeProfile, token;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, auth_1.Auth.checkGoogleAuthId(this, userId, googleId)];
                    case 1:
                        if (!(_a.sent())) {
                            throw new http_error_1.HttpError(http_status_codes_1.StatusCodes.UNAUTHORIZED, "Invalid google authentication!");
                        }
                        return [4 /*yield*/, this.getSensitiveUserWithPassword(userId)];
                    case 2:
                        user = _a.sent();
                        return [4 /*yield*/, this.pool.query("select * from app.profiles where user_id=$1", [user.id])];
                    case 3:
                        profileQuery = _a.sent();
                        if (profileQuery.rowCount > 0) {
                            activeProfile = db_type_converter_1.DbTypeConverter.toProfile(profileQuery.rows[0]);
                        }
                        token = jwt.sign({ userId: user.id, type: "auth" }, config_1.config.secret, { expiresIn: '168h' });
                        return [2 /*return*/, {
                                user: {
                                    id: user.id,
                                    email: user.email
                                },
                                activeProfile: activeProfile,
                                token: token
                            }];
                }
            });
        });
    };
    /**
     * Creates a one-time use request token that is used to retrieve an access token.
     *
     * @param user
     * @param googleId
     */
    UserService.prototype.createAccessTokenRequest = function (user, googleId) {
        return __awaiter(this, void 0, void 0, function () {
            var payload;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, auth_1.Auth.checkGoogleAuthId(this, user.id, googleId)];
                    case 1:
                        if (!(_a.sent())) {
                            throw new http_error_1.HttpError(http_status_codes_1.StatusCodes.UNAUTHORIZED, "Invalid google authentication!");
                        }
                        payload = {
                            userId: user.id,
                            type: "access_request",
                            service: "Google",
                            serviceUserId: googleId
                        };
                        return [2 /*return*/, jwt.sign(payload, config_1.config.secret, { expiresIn: '2m' })];
                }
            });
        });
    };
    /**
     * Creates a new user.
     *
     * @param email
     * @param password
     * @param name
     */
    UserService.prototype.createUserWithEmail = function (email, password, name) {
        return __awaiter(this, void 0, void 0, function () {
            var passHash, userInsertQuery, dbSensitiveUser;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, bcrypt.hash(password, 10)];
                    case 1:
                        passHash = _a.sent();
                        // Force lowercase
                        email = email.toLowerCase();
                        return [4 /*yield*/, this.pool.query("insert into app.users(email, email_hash, pass_hash, full_name) values ($1, $2, $3, $4) on conflict do nothing returning *", [
                                email,
                                crypto_1.default.createHash("md5").update(email).digest("hex"),
                                passHash,
                                name
                            ])];
                    case 2:
                        userInsertQuery = _a.sent();
                        if (userInsertQuery.rowCount < 1) {
                            throw new http_error_1.HttpError(http_status_codes_1.StatusCodes.CONFLICT, "The user already exists.");
                        }
                        dbSensitiveUser = userInsertQuery.rows[0];
                        return [2 /*return*/, db_type_converter_1.DbTypeConverter.toSensitiveUser(dbSensitiveUser)];
                }
            });
        });
    };
    /**
     * Creates a new user with a Google account.
     * The password field is set to a random value.
     *
     * @param email
     * @param googleId
     * @param name
     */
    UserService.prototype.createUserWithGoogle = function (email, googleId, name) {
        return __awaiter(this, void 0, void 0, function () {
            var passHash, userInsertQuery, enableGoogleSignInQueryResult, dbSensitiveUser;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, bcrypt.hash(security_utils_1.SecurityUtils.generateRandomPassword(), 10)];
                    case 1:
                        passHash = _a.sent();
                        // Force lowercase
                        email = email.toLowerCase();
                        return [4 /*yield*/, this.pool.query("insert into app.users(email, email_hash, pass_hash, full_name) values ($1, $2, $3, $4) on conflict do nothing returning *", [
                                email,
                                crypto_1.default.createHash("md5").update(email).digest("hex"),
                                passHash,
                                name
                            ])];
                    case 2:
                        userInsertQuery = _a.sent();
                        if (userInsertQuery.rowCount < 1) {
                            throw new http_error_1.HttpError(http_status_codes_1.StatusCodes.CONFLICT, "The user already exists.");
                        }
                        return [4 /*yield*/, this.pool.query("update app.users set private_metadata = jsonb_set(private_metadata::jsonb, '{googleId}', $1, true) where email=$2 returning private_metadata->>'googleId' as google_id", [
                                JSON.stringify(googleId),
                                email
                            ])];
                    case 3:
                        enableGoogleSignInQueryResult = _a.sent();
                        if (enableGoogleSignInQueryResult.rowCount < 1)
                            throw new http_error_1.HttpError(http_status_codes_1.StatusCodes.NOT_FOUND, "The user couldn't be found.");
                        dbSensitiveUser = userInsertQuery.rows[0];
                        return [2 /*return*/, db_type_converter_1.DbTypeConverter.toSensitiveUser(dbSensitiveUser)];
                }
            });
        });
    };
    //TODO Implement user update
    /**
     *
     */
    UserService.prototype.updateUser = function (userId, user) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    UserService.prototype.deleteUser = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var queryResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.pool.query("delete from app.users where id=$1 returning id, email_hash, full_name, active_profile_id, inventory, metadata, created_on", [userId])];
                    case 1:
                        queryResult = _a.sent();
                        if (queryResult.rowCount < 1) {
                            throw new http_error_1.HttpError(http_status_codes_1.StatusCodes.CONFLICT, "The user doesn't exist.");
                        }
                        return [2 /*return*/, db_type_converter_1.DbTypeConverter.toUser(queryResult.rows[0])];
                }
            });
        });
    };
    //TODO Implement data package download
    /**
     * Allows a user to download a data package containing all their collected personal information within SL's databases,
     * excluding password hashes. This is intended to be GDPR compliant.
     */
    UserService.prototype.generateDataPackage = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            var json, _a, profilesQuery, themesQuery, profileIds, linkQuery, addonQuery, installsQuery;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        json = {};
                        _a = json;
                        return [4 /*yield*/, this.getSensitiveUser(user.id)];
                    case 1:
                        _a.user = _b.sent();
                        return [4 /*yield*/, this.pool.query("select * from app.profiles where user_id=$1", [user.id])];
                    case 2:
                        profilesQuery = _b.sent();
                        return [4 /*yield*/, this.pool.query("select * from app.themes where user_id=$1", [user.id])];
                    case 3:
                        themesQuery = _b.sent();
                        json.profiles = profilesQuery.rows.map(function (x) { return db_type_converter_1.DbTypeConverter.toProfile(x); });
                        json.themes = themesQuery.rows.map(function (x) { return db_type_converter_1.DbTypeConverter.toTheme(x); });
                        profileIds = json.profiles.map(function (x) { return x.id; });
                        return [4 /*yield*/, this.pool.query("select * from app.links where profile_id=any($1)", [profileIds])];
                    case 4:
                        linkQuery = _b.sent();
                        json.links = linkQuery.rows.map(function (x) { return db_type_converter_1.DbTypeConverter.toLink(x); });
                        return [4 /*yield*/, this.pool.query("select * from marketplace.addons where user_id=$1", [user.id])];
                    case 5:
                        addonQuery = _b.sent();
                        json.addons = addonQuery.rows.map(function (x) { return db_type_converter_1.DbTypeConverter.toAddon(x); });
                        return [4 /*yield*/, this.pool.query("select * from marketplace.installs where profile_id=any($1)", [profileIds])];
                    case 6:
                        installsQuery = _b.sent();
                        json.addonInstalls = installsQuery.rows.map(function (x) { return db_type_converter_1.DbTypeConverter.toAddonInstall(x); });
                        return [2 /*return*/, JSON.stringify(json, undefined, 2)];
                }
            });
        });
    };
    /**
     * Sets the active profile for a user. Does not check for ownership.
     *
     * @param userId
     * @param profileId
     */
    UserService.prototype.setActiveProfile = function (userId, profileId) {
        return __awaiter(this, void 0, void 0, function () {
            var profileResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.pool.query("update app.users set active_profile_id=$1 where id=$2 returning *", [profileId, userId])];
                    case 1:
                        profileResult = _a.sent();
                        if (profileResult.rowCount < 1) {
                            throw new http_error_1.HttpError(http_status_codes_1.StatusCodes.NOT_FOUND, "The user or profile could not be found.");
                        }
                        return [2 /*return*/, db_type_converter_1.DbTypeConverter.toProfile(profileResult.rows[0])];
                }
            });
        });
    };
    /**
     * Edits email notification settings for users.
     *
     * @param userId
     * @param emailNotifications
     */
    UserService.prototype.setEmailNotifications = function (userId, emailNotifications) {
        return __awaiter(this, void 0, void 0, function () {
            var profileQuery;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.pool.query("update app.users\n                                                               set private_metadata = jsonb_set(private_metadata::jsonb, '{emailNotifications}', $1, true)\n                                                               where id = $2\n                                                               returning *;", [emailNotifications, userId])];
                    case 1:
                        profileQuery = _a.sent();
                        if (profileQuery.rowCount < 1) {
                            throw new http_error_1.HttpError(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "Unable to update the profile because of an internal error.");
                        }
                        return [2 /*return*/, db_type_converter_1.DbTypeConverter.toSensitiveUser(profileQuery.rows[0])];
                }
            });
        });
    };
    return UserService;
}(database_service_1.DatabaseService));
exports.UserService = UserService;
