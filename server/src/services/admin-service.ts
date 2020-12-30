import {DatabaseManager} from "../data/database-manager";
import {DatabaseService} from "./database-service";
import {DbTypeConverter} from "../utils/db-type-converter";

/**
 * This service takes care of transactional tasks for Analytics.
 */
export class AdminService extends DatabaseService {

  constructor(databaseManager: DatabaseManager) {
    super(databaseManager);
  }

  /**
   * Returns analytics data from the database.
   *
   * Returns all data as -1 if the database was unable to be queried.
   */
  async getPermGroup(userId: string): Promise<PermissionGroup> {
    let queryResult = await this.pool.query<DbPermissionGroup>("select * from analytics.global_stats");

    let dbPermissionGroup = queryResult.rows[0];

    if (queryResult.rowCount <= 0) {
      return {
        id: '',
        userId: '',
        groupName: ''
      };
    }

    return DbTypeConverter.toPermGroup(dbPermissionGroup);
  }
}
