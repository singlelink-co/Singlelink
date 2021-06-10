import {Pool} from "pg";
import {DatabaseManager} from "../data/database-manager";
import {Service} from "./service";

/**
 * A DatabaseService requires a DatabaseManager in order to function.
 * It should perform actions based on requests provided by the server,
 * and has access to the database.
 */
export abstract class DatabaseService implements Service {
  pool: Pool;

  protected constructor(databaseManager: DatabaseManager) {
    this.pool = databaseManager.pool;
  }
}
