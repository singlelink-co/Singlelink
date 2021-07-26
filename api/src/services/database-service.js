"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseService = void 0;
/**
 * A DatabaseService requires a DatabaseManager in order to function.
 * It should perform actions based on requests provided by the server,
 * and has access to the database.
 */
var DatabaseService = /** @class */ (function () {
    function DatabaseService(databaseManager) {
        this.pool = databaseManager.pool;
    }
    return DatabaseService;
}());
exports.DatabaseService = DatabaseService;
