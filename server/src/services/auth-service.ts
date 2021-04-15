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
   * @param email
   * @param googleId
   */
  async setGoogleId(email: string, googleId: string | null) {
    let queryResult = await this.pool.query<{ google_id: string | null | undefined }>("update app.users set private_metadata = jsonb_set(private_metadata::jsonb, '{google_id}', $1, true) where email=$2 returning private_metadata->'google_id' as google_id",
      [
        googleId,
        email
      ]);

    if (queryResult.rowCount < 1)
      throw new HttpError(StatusCodes.NOT_FOUND, "The user couldn't be found.");

    return !!(queryResult.rows[0].google_id);
  }
}
