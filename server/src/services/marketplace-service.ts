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
    let queryResult = await this.pool.query<DbAddon>("select * from marketplace.addons where id=$1 and (user_id=$2 or global=true)", [id, userId]);

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
   * Finds an addon. Doesn't require a userId and doesn't check for global or ownership.
   *
   * @param id The addon id.
   */
  async findAddon(id: string): Promise<Addon> {
    let queryResult = await this.pool.query<DbAddon>("select * from marketplace.addons where id=$1", [id]);

    if (queryResult.rowCount < 1)
      throw new HttpError(StatusCodes.NOT_FOUND, "The addon couldn't be found.");

    return DbTypeConverter.toAddon(queryResult.rows[0]);
  }

  /**
   * Creates an addon.
   */
  async createAddon(addon: Partial<Addon>): Promise<Addon> {
    //language=PostgreSQL
    let queryStr = `insert into marketplace.addons(user_id, resource_id, type, description, author, tags, price,
                                                   payment_frequency, version, last_updated)
                    values ($1, $2, $3, $4, $5, $6, $7, $8, $9, current_timestamp)
                    returning *`;

    let queryResult = await this.pool.query<DbAddon>(queryStr,
      [
        addon.userId,
        addon.resourceId,
        addon.type,
        addon.description,
        addon.author,
        addon.tags,
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
  async updateAddon(addon: Pick<Addon, 'id'> & Partial<Addon>): Promise<Addon> {
    //language=PostgreSQL
    let queryStr = `update marketplace.addons
                    set resource_id=coalesce($2, resource_id),
                        type=coalesce($3, type),
                        description=$4,
                        author=$5,
                        tags=$6,
                        featured_sorting=coalesce($7, featured_sorting),
                        price=$8,
                        payment_frequency=$9,
                        global=coalesce($10, global),
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
    let queryResult = await this.pool.query("delete from marketplace.addons where id=$1 returning id;", [id]);

    if (queryResult.rowCount < 1)
      throw new HttpError(StatusCodes.NOT_FOUND, "The addon couldn't be found.");

    return id;
  }

  /**
   * Installs an addon on a user's profile.
   */
  async installAddon(profile: Profile, addonId: string) {
    let queryResult = await this.pool.query<DbAddonInstall>("insert into marketplace.installs (profile_id, addon_id) values ($1, $2) returning id;",
      [
        profile.id,
        addonId
      ]);

    if (queryResult.rowCount < 1)
      throw new HttpError(StatusCodes.NOT_FOUND, "The addon or userid couldn't be found.");

    // install process
    let addon = await this.findAddon(addonId);
    await this.installAddonToProfile(profile, addon);

    return addonId;
  }

  /**
   * Uninstalls an addon on a user's profile.
   */
  async uninstallAddon(profile: Profile, addonId: string) {
    let queryResult = await this.pool.query<DbAddonInstall>("delete from marketplace.installs where profile_id=$1 and addon_id=$2 returning id;",
      [
        profile.id,
        addonId
      ]);

    if (queryResult.rowCount < 1)
      throw new HttpError(StatusCodes.NOT_FOUND, "The addon or userid couldn't be found.");

    // uninstall process
    let addon = await this.findAddon(addonId);
    await this.removeAddonFromProfile(profile, addon);

    return addonId;
  }

  /**
   * Gets all of a profile's installed addons
   *
   * @param profileId
   */
  async getInstalledAddons(profileId: string): Promise<AddonInstall[]> {
    let queryResult = await this.pool.query<DbAddonInstall>("select * from marketplace.installs where profile_id=$1",
      [
        profileId
      ]);

    if (queryResult.rowCount < 1)
      throw new HttpError(StatusCodes.NOT_FOUND, "The addon or userid couldn't be found.");

    return queryResult.rows.map(x => DbTypeConverter.toAddonInstall(x));
  }

  private async installAddonToProfile(profile: Profile, addon: Addon) {
    switch (addon.type) {
      case "theme":
        await this.pool.query<DbProfile>("update app.profiles set theme_id=$1 where id=$2", [addon.resourceId, profile.id]);
        break;
      case "preset":
      case "plugin":
      //TODO add support for presets and plugins
    }
  }

  private async removeAddonFromProfile(profile: Profile, addon: Addon) {
    switch (addon.type) {
      case "theme":
        await this.pool.query<DbProfile>("update app.profiles set theme_id=$1 where id=$2", [null, profile.id]);
        break;
      case "preset":
      case "plugin":
      //TODO add support for presets and plugins
    }
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

    await this.pool.query("update app.users set metadata=jsonb_set(metadata, '{favorites}', $2, true) where id=$1 returning metadata->'favorites' as favorites", [
      userId,
      JSON.stringify(favorites)
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
    let queryResult = await this.pool.query<{ favorites: number[] }>("select metadata->'favorites' as favorites from app.users where id=$1 and metadata->'favorites' is not null", [userId]);

    if (queryResult.rowCount < 1)
      return [];

    return queryResult.rows[0].favorites;
  }
}
