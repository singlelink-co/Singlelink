import {DatabaseManager} from "../data/database-manager";
import {DatabaseService} from "./database-service";
import {HttpError} from "../utils/http-error";
import {StatusCodes} from "http-status-codes";
import {QueryResult} from "pg";
import {DbTypeConverter} from "../utils/db-type-converter";

/**
 * This service takes care of transactional tasks for Themes.
 */
export class ThemeService extends DatabaseService {

  constructor(databaseManager: DatabaseManager) {
    super(databaseManager);
  }

  /**
   * Gets a theme by the theme id.
   *
   * @param themeId
   */
  async getTheme(themeId: string): Promise<Theme> {
    let queryResult = await this.pool.query<DbTheme>("select * from app.themes where id=$1", [themeId]);

    if (queryResult.rowCount < 1)
      throw new HttpError(StatusCodes.NOT_FOUND, "The theme couldn't be found.");

    return DbTypeConverter.toTheme(queryResult.rows[0]);
  }

  /**
   * Gets includeGlobal the themes that are available to a user.
   *
   * @param userId
   * @param includeGlobal Should global themes be included in the results?
   */
  async listUserThemes(userId: string, includeGlobal: boolean = true): Promise<Theme[]> {
    let queryResult: QueryResult<DbTheme>;

    if (includeGlobal) {
      queryResult = await this.pool.query<DbTheme>("select * from app.themes where user_id=$1 or global=true", [userId]);
    } else {
      queryResult = await this.pool.query<DbTheme>("select * from app.themes where user_id=$1 and global=false", [userId]);
    }

    return queryResult.rowCount < 1 ? [] : queryResult.rows.map(x => DbTypeConverter.toTheme(x));
  }

  /**
   * Gets all the global themes that are on the server.
   */
  async listGlobalThemes(): Promise<Theme[]> {
    let queryResult: QueryResult<DbTheme> = await this.pool.query<DbTheme>("select * from app.themes where global=true");

    return queryResult.rowCount < 1 ? [] : queryResult.rows.map(x => DbTypeConverter.toTheme(x));
  }

  /**
   * Creates a new theme.
   *
   * @param userId
   * @param label
   * @param colors
   * @param customCss
   * @param customHtml
   */
  async createTheme(
    userId: string,
    label: string,
    colors?: Theme["colors"],
    customCss?: string,
    customHtml?: string
  ): Promise<Theme> {
    let queryResult = await this.pool.query<DbTheme>("insert into app.themes(label, colors, custom_css, custom_html, user_id) values ($1, $2, $3, $4, $5) returning *",
      [
        label,
        colors,
        customCss,
        customHtml,
        userId
      ]);

    if (queryResult.rowCount < 1)
      throw new HttpError(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to add a new theme because of an internal server error.");

    return DbTypeConverter.toTheme(queryResult.rows[0]);
  }

  /**
   * Updates a theme. Must be owned by the user.
   *
   * @param themeId
   * @param userId
   * @param label
   * @param colors
   * @param customCss
   * @param customHtml
   */
  async updateUserTheme(
    themeId: string,
    userId: string,
    label: string,
    colors?: Theme["colors"],
    customCss?: string,
    customHtml?: string
  ): Promise<Theme> {
    let queryResult = await this.pool.query<DbTheme>("update app.themes set label=$1, colors=$2, custom_css=$3, custom_html=$4 where id=$5 and user_id=$6 returning *",
      [
        label,
        colors,
        customCss,
        customHtml,
        themeId,
        userId
      ]);

    if (queryResult.rowCount < 1)
      throw new HttpError(StatusCodes.NOT_FOUND, "Failed to update the theme because the id couldn't be found.");

    return DbTypeConverter.toTheme(queryResult.rows[0]);
  }

  /**
   * Deletes a theme. Must be owned by the user to delete.
   *
   * @param themeId
   * @param userId
   */
  async deleteUserTheme(
    themeId: string,
    userId: string
  ): Promise<Theme> {
    let queryResult = await this.pool.query<DbTheme>("delete from app.themes where id=$1 and user_id=$2 returning *",
      [
        themeId,
        userId
      ]);

    if (queryResult.rowCount < 1)
      throw new HttpError(StatusCodes.NOT_FOUND, "Failed to delete the theme because the id couldn't be found.");

    return DbTypeConverter.toTheme(queryResult.rows[0]);
  }

  // region Admin Methods

  /**
   * Sets a Theme as global (or not).
   */
  async setGlobal(themeId: string, global: boolean) {
    let queryResult = await this.pool.query("update app.themes set global=$1 where id=$2 returning *",
      [
        global,
        themeId
      ]);

    if (queryResult.rowCount < 1)
      throw new HttpError(StatusCodes.NOT_FOUND, "Failed to add a new theme because the id couldn't be found.");

    return DbTypeConverter.toTheme(queryResult.rows[0]);
  }

  /**
   * Change the owner of a theme.
   */
  async setUserId(themeId: string, userId: string) {
    let queryResult = await this.pool.query("update app.themes set user_id=$1 where id=$2 returning *",
      [
        userId,
        themeId
      ]);

    if (queryResult.rowCount < 1)
      throw new HttpError(StatusCodes.NOT_FOUND, "Failed to add a new theme because the id couldn't be found.");

    return DbTypeConverter.toTheme(queryResult.rows[0]);
  }

  /**
   * Updates ANY theme. *Dangerous, make sure you know what you're doing!*
   *
   * @param themeId
   * @param label
   * @param colors
   * @param customCss
   * @param customHtml
   */
  async updateTheme(
    themeId: string,
    label: string,
    colors?: Theme["colors"],
    customCss?: string,
    customHtml?: string
  ): Promise<Theme> {
    let queryResult = await this.pool.query<DbTheme>("update app.themes set label=$1, colors=$2, custom_css=$3, custom_html=$4 where id=$5 returning *",
      [
        label,
        colors,
        customCss,
        customHtml,
        themeId
      ]);

    if (queryResult.rowCount < 1)
      throw new HttpError(StatusCodes.NOT_FOUND, "Failed to update the theme because the id couldn't be found.");

    return DbTypeConverter.toTheme(queryResult.rows[0]);
  }

  /**
   * Deletes ANY theme. *Dangerous, make sure you know what you're doing!*
   *
   * @param themeId
   */
  async deleteTheme(
    themeId: string,
  ): Promise<Theme> {
    let queryResult = await this.pool.query<DbTheme>("delete from app.themes where id=$1 returning *",
      [
        themeId
      ]);

    if (queryResult.rowCount < 1)
      throw new HttpError(StatusCodes.NOT_FOUND, "Failed to delete the theme because the id couldn't be found.");

    return DbTypeConverter.toTheme(queryResult.rows[0]);
  }

  // endregion
}
