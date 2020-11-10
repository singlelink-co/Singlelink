import {Pool} from "pg";
import {DatabaseManager} from "../data/database-manager";

/**
 * A BaseService is an agent that can perform any arbitrary task between controllers (and other components).
 * It should perform actions based on requests provided by the server.
 */
export abstract class BaseService {
}

/**
 * A DatabaseService requires a DatabaseManager in order to function.
 * It should perform actions based on requests provided by the server,
 * and has access to the database.
 */
export abstract class DatabaseService extends BaseService {
  pool: Pool;

  protected constructor(databaseManager: DatabaseManager) {
    super();
    this.pool = databaseManager.pool;
  }
}
