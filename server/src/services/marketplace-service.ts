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
   * @param userId
   * @param id The addon's id.
   */
  async getAddon(userId: string, id: string) {
    let queryResult = await this.pool.query<DbAddon>("select * from marketplace.addons where id=$1 and (user_id=$2 or global=true)", [userId, id]);

    if (queryResult.rowCount < 1)
      throw new HttpError(StatusCodes.NOT_FOUND, "The addon couldn't be found.");

    return DbTypeConverter.toAddon(queryResult.rows[0]);
  }

  /**
   * Gets multiple addons by id.
   *
   * @param userId The user id requesting the addons. They must either own the addons or it must be global to list them.
   * @param ids The addon's ids.
   */
  async getAddons(userId: string, ids: string[]): Promise<Addon[]> {
    let queryResult = await this.pool.query<DbAddon>("select * from marketplace.addons where id = any($1) and (user_id=$2 or global=true)", [ids, userId]);

    if (queryResult.rowCount < 1)
      return [];

    return queryResult.rows.map(x => DbTypeConverter.toAddon(x));
  }

  /**
   * Creates an addon.
   */
  async createAddon(addon: Partial<Addon>): Promise<Addon> {
    //language=PostgreSQL
    let queryStr = `insert into marketplace.addons(user_id, resource_id, type, description, author, tags,
                                                   featured_sorting, price,
                                                   payment_frequency, version, last_updated)
                    values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, current_timestamp)
                    returning *`;

    let queryResult = await this.pool.query<DbAddon>(queryStr,
      [
        addon.userId,
        addon.resourceId,
        addon.type,
        addon.description,
        addon.author,
        addon.tags,
        addon.featuredSorting,
        addon.price,
        addon.paymentFrequency,
        addon.version,
      ]);

    if (queryResult.rowCount < 1)
      throw new HttpError(StatusCodes.CONFLICT, "The addon couldn't be added.");

    return DbTypeConverter.toAddon(queryResult.rows[0]);
  }

  /**
   * Updates an addon.
   */
  async updateAddon(addon: Pick<Addon, 'id' | 'type'> & Partial<Addon>): Promise<Addon> {
    //language=PostgreSQL
    let queryStr = `update marketplace.addons
                    set resource_id=$2,
                        type=$3,
                        description=$4,
                        author=$5,
                        tags=$6,
                        featured_sorting=$7,
                        price=$8,
                        payment_frequency=$9,
                        global=$10,
                        version=$11,
                        last_updated=current_timestamp
                    where id = $1
                    returning *`;

    let queryResult = await this.pool.query<DbAddon>(queryStr,
      [
        addon.id,
        addon.resourceId,
        addon.type,
        addon.description,
        addon.author,
        addon.tags,
        addon.featuredSorting,
        addon.price,
        addon.paymentFrequency,
        addon.global,
        addon.version,
      ]);

    if (queryResult.rowCount < 1)
      throw new HttpError(StatusCodes.CONFLICT, "The addon couldn't be added.");

    return DbTypeConverter.toAddon(queryResult.rows[0]);
  }

  /**
   * Deletes an addon.
   *s
   * @return the id of the deleted object
   */
  async deleteAddon(id: string): Promise<string> {
    let queryResult = await this.pool.query("delete from marketplace.addons where id=$1 returning id;");

    if (queryResult.rowCount < 1)
      throw new HttpError(StatusCodes.NOT_FOUND, "The addon couldn't be found.");

    return id;
  }

  /**
   * Installs an addon on a user's profile.
   */
  async installAddon(id: string) {

  }

  /**
   * Uninstalls an addon on a user's profile.
   */
  async uninstallAddon(id: string) {

  }

  /**
   * Toggles whether an addon is favorited or not for a particular user
   *
   * @return Returns whether it was favorited or not. true = favorited, false = unfavorited
   */
  async userToggleFavoriteAddon(userId: string, addonId: string): Promise<boolean> {
    let favorites = await this.userListFavoriteAddons(userId);
    let searchElement = Number.parseInt(addonId);
    let favorited: boolean;

    if (favorites.includes(searchElement)) {
      favorites.splice(favorites.indexOf(searchElement), 1);
      favorited = false;
    } else {
      favorites.push(searchElement);
      favorited = true;
    }

    let queryResult = await this.pool.query("update app.users set metadata=jsonb_set(metadata, '{favorites}', $2) where id=$1 returning metadata->'favorites' as favorites", [
      userId,
      favorites
    ]);

    return favorited;
  }

  /**
   * Gets a user's favorite addon ids.
   *
   * @param userId
   *
   * @return A list of ids of the user's favorite addons
   */
  async userListFavoriteAddons(userId: string): Promise<number[]> {
    let queryResult = await this.pool.query<{ favorites: number[] }>("select metadata->'favorites' from app.users where id=$1", [userId]);

    if (queryResult.rowCount < 1)
      return [];

    return queryResult.rows[0].favorites;
  }

}
