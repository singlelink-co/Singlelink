import {DatabaseService} from "./database-service";
import {DatabaseManager} from "../data/database-manager";
import {DbTypeConverter} from "../utils/db-type-converter";
import {HttpError} from "../utils/http-error";
import {StatusCodes} from "http-status-codes";
import {QueryResult} from "pg";

export class MarketplaceService extends DatabaseService {

  constructor(databaseManager: DatabaseManager) {
    super(databaseManager);
  }

  /**
   * Lists all addons on the marketplace. This function is paginated by default for performance reasons. Maximum per
   * page is 500.
   *
   * @param userId
   * @param sorting The sort mode. Defaults to "new". Featured sorting ignores ascending parameter.
   * @param ascending Should the results be ascending (or descending?)
   * @param lastItemId The last item of the previous page
   * @param limit The number of addons to show
   */
  async listAddons(userId: string, sorting: AddonSorting = "new", ascending: boolean | undefined, lastItemId: number = 0, limit: number = 100): Promise<Addon[]> {
    if (limit > 500) {
      limit = 500;
    }

    let queryResult: QueryResult<DbAddon>;
    let queryStr: string;

    switch (sorting) {
      case "featured":
        queryStr = "select * from marketplace.addons where (user_id = $1 or global = true) and ((metadata ? 'deprecated') = false or (metadata -> 'deprecated')::bool = false) and id > $2 order by featured_sorting desc limit $3";
        break;

      case "allTimeInstalls":
        if (ascending === undefined)
          ascending = false;

        if (ascending)
          queryStr = "select * from marketplace.addons where (user_id = $1 or global = true) and ((metadata ? 'deprecated') = false or (metadata -> 'deprecated')::bool = false) and id > $2 order by (select count(*) from analytics.marketplace_installs where addon_id=marketplace.addons.id) limit $3";
        else
          queryStr = "select * from marketplace.addons where (user_id = $1 or global = true) and ((metadata ? 'deprecated') = false or (metadata -> 'deprecated')::bool = false) and id > $2 order by (select count(*) from analytics.marketplace_installs where addon_id=marketplace.addons.id) desc limit $3";
        break;

      case "currentInstalls":
        if (ascending === undefined)
          ascending = false;

        if (ascending)
          queryStr = "select * from marketplace.addons where (user_id = $1 or global = true) and ((metadata ? 'deprecated') = false or (metadata -> 'deprecated')::bool = false) and id > $2 order by (select count(*) from marketplace.installs where addon_id=marketplace.addons.id) limit $3";
        else
          queryStr = "select * from marketplace.addons where (user_id = $1 or global = true) and ((metadata ? 'deprecated') = false or (metadata -> 'deprecated')::bool = false) and id > $2 order by (select count(*) from marketplace.installs where addon_id=marketplace.addons.id) desc limit $3";
        break;

      case "lastUpdated":
        if (ascending === undefined)
          ascending = false;

        if (ascending)
          queryStr = "select * from marketplace.addons where (user_id = $1 or global = true) and ((metadata ? 'deprecated') = false or (metadata -> 'deprecated')::bool = false) and id > $2 order by last_updated limit $3";
        else
          queryStr = "select * from marketplace.addons where (user_id = $1 or global = true) and ((metadata ? 'deprecated') = false or (metadata -> 'deprecated')::bool = false) and id > $2 order by last_updated desc limit $3";
        break;


      // Default cases
      case "new":
      default:
        if (ascending === undefined)
          ascending = false;

        if (ascending)
          queryStr = "select * from marketplace.addons where (user_id = $1 or global = true) and ((metadata ? 'deprecated') = false or (metadata -> 'deprecated')::bool = false) and id > $2 order by id limit $3";
        else
          queryStr = "select * from marketplace.addons where (user_id = $1 or global = true) and ((metadata ? 'deprecated') = false or (metadata -> 'deprecated')::bool = false) and id > $2 order by id desc limit $3";
        break;
    }

    queryResult = await this.pool.query<DbAddon>(queryStr,
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
   * Searches all addons on the marketplace. This function is paginated by default for performance reasons. Maximum per
   * page is 500.
   *
   * @param query The search query
   * @param lastItemId The last item of the previous page
   * @param limit The number of addons to show
   */
  async searchAddons(query: string, lastItemId: number = 0, limit: number = 100): Promise<Addon[]> {
    if (limit > 500) {
      limit = 500;
    }

    let queryResult: QueryResult<DbAddon>, queryStr: string;

    queryStr = `select *
                from marketplace.addons
                where global = true
                  and ((metadata ? 'deprecated') = false or (metadata -> 'deprecated')::bool = false)
                  and ($1 % addons.display_name or $1 % addons.description or $1 % addons.author or
                       $1 % array_to_string(addons.tags, ' '))
                  and id > $2
                order by id
                limit $3`;

    queryResult = await this.pool.query<DbAddon>(queryStr,
      [
        query,
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
   * Gets a user's authored addons. (Addons created by the author.)
   *
   * @param userId The user id requesting the addons.
   */
  async getAuthoredAddons(userId: string): Promise<Addon[]> {
    let queryResult = await this.pool.query<DbAddon>("select * from marketplace.addons where user_id=$1", [userId]);

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
    let queryStr = `insert into marketplace.addons(user_id, resource_id, type, display_name, description, author, tags,
                                                   price,
                                                   payment_frequency, global, version, metadata, last_updated)
                    values ($1, $2, $3, $4, $5, $6, $7, $8, $9, coalesce($10, false), $11, coalesce($12, '{}'::jsonb),
                            current_timestamp)
                    returning *`;

    let queryResult = await this.pool.query<DbAddon>(queryStr,
      [
        addon.userId,
        addon.resourceId,
        addon.type,
        addon.displayName,
        addon.description,
        addon.author,
        addon.tags,
        addon.price,
        addon.paymentFrequency,
        addon.global,
        addon.version,
        addon.metadata
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
                        display_name=$4,
                        description=$5,
                        author=$6,
                        tags=$7,
                        featured_sorting=coalesce($8, featured_sorting),
                        price=$9,
                        payment_frequency=$10,
                        global=coalesce($11, global),
                        version=$12,
                        last_updated=current_timestamp,
                        metadata=coalesce($13, metadata)
                    where id = $1
                    returning *`;

    let queryResult = await this.pool.query<DbAddon>(queryStr,
      [
        addon.id,
        addon.resourceId,
        addon.type,
        addon.displayName,
        addon.description,
        addon.author,
        addon.tags,
        addon.featuredSorting,
        addon.price,
        addon.paymentFrequency,
        addon.global,
        addon.version,
        addon.metadata
      ]);

    if (queryResult.rowCount < 1)
      throw new HttpError(StatusCodes.CONFLICT, "The addon couldn't be added.");

    return DbTypeConverter.toAddon(queryResult.rows[0]);
  }

  /**
   * Deletes an addon.
   *
   * @return the id of the deleted object
   */
  async deleteAddon(id: string) {
    let queryResult = await this.pool.query<{ id: number }>("delete from marketplace.addons where id=$1 returning id;", [id]);

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

    // uninstall existing installed theme(s) if already installed
    switch (addon.type) {
      case "theme":
        let installedAddons = await this.getInstalledAddons(profile.id);

        let themeAddons: string[] = (await Promise.all(installedAddons.map(async (x): Promise<Addon> => {
          return await this.findAddon(x.addonId);
        })))
          .filter(x => x.type == "theme")
          .map(x => x.id);

        await this.pool.query<DbAddonInstall>("delete from marketplace.installs where profile_id=$1 and (addon_id != $2 and addon_id=any($3))",
          [
            profile.id,
            addonId,
            themeAddons
          ]);
    }

    await this.installAddonToProfile(profile, addon);
    await this.incrementInstallCount(profile.userId, addonId);

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
      throw new HttpError(StatusCodes.NOT_FOUND, "The addon or userid couldn't be found, or wasn't already installed.");

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
      return [];

    return queryResult.rows.map(x => DbTypeConverter.toAddonInstall(x));
  }

  /**
   * Increments the install count for a user on a specific addon. Only does this once per addon/user pair.
   * @param userId
   * @param addonId
   */
  async incrementInstallCount(userId: string, addonId: string) {
    await this.pool.query("insert into analytics.marketplace_installs(addon_id, user_id) values ($1, $2) on conflict do nothing",
      [
        addonId,
        userId
      ]);
  }

  /**
   * Gets the install count of an addon from analytics. Returns the number of installs over the lifetime of an addon.
   *
   * @param id The addon id
   */
  async getAllTimeInstallCount(id: string): Promise<number> {
    let queryResult = await this.pool.query("select count(*) from analytics.marketplace_installs where addon_id=$1",
      [
        id
      ]);

    return queryResult.rows[0].count ?? 0;
  }

  /**
   * Gets the current install count for an addon.
   *
   * @param id The addon id
   */
  async getCurrentInstallCount(id: string): Promise<number> {
    let queryResult = await this.pool.query("select count(*) from marketplace.installs where addon_id=$1",
      [
        id
      ]);

    return queryResult.rows[0].count ?? 0;
  }

  /**
   * Gets an addon's stats.
   */
  async getAddonStats(id: string) {
    let lifeTimeInstalls = await this.getAllTimeInstallCount(id);
    let currentInstalls = await this.getCurrentInstallCount(id);

    return {
      lifetimeInstalls: lifeTimeInstalls,
      currentInstalls: currentInstalls
    };
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

    await this.pool.query("update app.users set private_metadata=jsonb_set(private_metadata, '{favorites}', $2, true) where id=$1 returning private_metadata->'favorites' as favorites", [
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
    let queryResult = await this.pool.query<{ favorites: number[] }>("select private_metadata->'favorites' as favorites from app.users where id=$1 and private_metadata->'favorites' is not null", [userId]);

    if (queryResult.rowCount < 1)
      return [];

    return queryResult.rows[0].favorites;
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
}
