import {DatabaseManager} from "../data/database-manager";
import {DatabaseService} from "./database-service";
import {HttpError} from "../utils/http-error";
import {StatusCodes} from "http-status-codes";

/**
 * This service takes care of transactional tasks for Analytics.
 */
export class AuthService extends DatabaseService {

  constructor(databaseManager: DatabaseManager) {
    super(databaseManager);
  }

  /**
   * Sets the Google Id for an account.
   * Set null to disable.
   *
   * @param userId
   * @param googleId
   */
  async setGoogleId(userId: string, googleId: string | null) {
    let queryResult = await this.pool.query<{ googleId: string | null | undefined }>("update app.users set private_metadata = jsonb_set(private_metadata::jsonb, '{googleId}', $1, true) where id=$2 returning private_metadata->>'googleId' as googleId",
      [
        JSON.stringify(googleId),
        userId
      ]);

    if (queryResult.rowCount < 1)
      throw new HttpError(StatusCodes.NOT_FOUND, "The user couldn't be found.");

    return !!(queryResult.rows[0].googleId);
  }
}
