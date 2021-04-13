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

  // TODO implement/test properly later, toggle google for account
  async toggleGoogleForAccount(email: string, enable: boolean) {
    let queryResult = await this.pool.query<{ google_enabled: boolean }>("update app.users set private_metadata = jsonb_set(private_metadata::jsonb, '{google_enabled}', $1, true) where email=$2 returning private_metadata->'google_enabled' as google_enabled",
      [
        enable,
        email
      ]);

    if (queryResult.rowCount < 1)
      throw new HttpError(StatusCodes.NOT_FOUND, "The user couldn't be found.");

    return queryResult.rows[0].google_enabled;
  }
}
