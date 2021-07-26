import {DatabaseManager} from "../data/database-manager";
import {DatabaseService} from "./database-service";
import {DbTypeConverter} from "../utils/db-type-converter";
import {HttpError} from "../utils/http-error";
import {StatusCodes} from "http-status-codes";

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
    let queryResult = await this.pool.query<DbPermissionGroup>("select * from app.perm_groups where user_id=$1", [userId]);

    if (queryResult.rowCount < 1) {
      return {
        id: '',
        userId: '',
        groupName: ''
      };
    }

    let dbPermissionGroup = queryResult.rows[0];

    return DbTypeConverter.toPermGroup(dbPermissionGroup);
  }

  /**
   * Bans or unbans a user. Returns a DbBanned Object if banned, null if unbanned.
   *
   * @param userId
   * @param banned
   * @param reason
   */
  async setBanned(userId: string, banned: boolean, reason?: string): Promise<DbBanned | null> {
    if (banned) {
      let queryResult = await this.pool.query<DbBanned>("insert into security.banned(user_id, reason) values ($1, $2) on conflict(user_id) do update set reason=$2",
        [
          userId,
          reason ?? null
        ]);

      if (queryResult.rowCount < 1)
        throw new HttpError(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to insert a banned user due to an internal DB server error.");

      return queryResult.rows[0];
    } else {
      await this.pool.query("delete from security.banned where user_id=$1", [userId]);

      return null;
    }
  }

  /**
   * Returns a list of all banned users.
   */
  async listBanned(): Promise<DbBanned[]> {
    let queryResult = await this.pool.query<DbBanned>("select * from security.banned");

    return queryResult.rows;
  }
}
