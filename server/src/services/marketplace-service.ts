import {DatabaseService} from "./database-service";
import {DatabaseManager} from "../data/database-manager";
import {DbTypeConverter} from "../utils/db-type-converter";
import {HttpError} from "../utils/http-error";
import {StatusCodes} from "http-status-codes";

export class MarketplaceService extends DatabaseService {

  constructor(databaseManager: DatabaseManager) {
    super(databaseManager);
  }

  // TODO Implement marketplace searching

  /**
   * Lists all addons on the marketplace. This function is paginated by default for performance reasons. Maximum per
   * page is 500.
   *
   * @param userId
   * @param lastItemId The last item of the previous page
   * @param limit The number of addons to show
   */
  async listAddons(userId: string, lastItemId: number = 0, limit: number = 100): Promise<Addon[]> {
    if (limit > 500) {
      limit = 500;
    }

    let queryResult = await this.pool.query<DbAddon>("select * from marketplace.addons where (user_id=$1 or global=true) and id > $2 order by id limit $3",
      [
        userId,
        lastItemId,
        limit
      ]);

    if (queryResult.rowCount < 1)
      return [];

    return queryResult.rows.map(x => {
      return DbTypeConverter.toAddon(x);
    });
  }

  /**
   * Gets an addon.
   *
   * @param id The addon's id.
   */
  async getAddon(id: string) {
    let queryResult = await this.pool.query<DbAddon>("select * from marketplace.addons where id=$1",
      [
        id
      ]);

    if (queryResult.rowCount < 1)
      throw new HttpError(StatusCodes.NOT_FOUND, "The addon couldn't be found.");

    return DbTypeConverter.toAddon(queryResult.rows[0]);
  }

  // TODO Implement marketplace
  /**
   * Creates an addon.
   */
  async createAddon() {

  }

  // TODO Implement marketplace
  /**
   * Updates an addon.
   */
  async updateAddon() {

  }

  // TODO Implement marketplace
  /**
   * Deletes an addon.
   */
  async deleteAddon() {

  }

  // TODO Implement marketplace
  /**
   * Increments the addon download counter
   */
  async incrementAddonDownload() {

  }

  // TODO Implement user addon favoriting (using user metadata)
  /**
   * Toggles whether an addon is favorited or not for a particular user.
   */
  async userSetFavoriteAddon(userId: string, addonId: string) {

  }

}
