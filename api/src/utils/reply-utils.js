"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReplyUtils = void 0;
var ReplyUtils = /** @class */ (function () {
    function ReplyUtils() {
    }
    /**
     * Create a JSON error response.
     */
    ReplyUtils.error = function (msg, error) {
        return "{\"error\": \"" + msg + "\"" + (error ? ",\"errorObject\": " + JSON.stringify(error) : "") + "}";
    };
    /**
     * Create a JSON error response.
     */
    ReplyUtils.errorOnly = function (error) {
        return "{\"error\": \"" + error.message + "\"" + (error ? ",\"errorObject\": " + JSON.stringify(error) : "") + "}";
    };
    ReplyUtils.success = function (msg) {
        return "{\"message\": \"" + msg + "\"}";
    };
    return ReplyUtils;
}());
exports.ReplyUtils = ReplyUtils;
