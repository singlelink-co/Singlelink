import {DatabaseManager} from "../data/database-manager";
import {DatabaseService} from "./database-service";
import {HttpError} from "../utils/http-error";
import {constants as HttpStatus} from "http2";
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

    if (queryResult.rowCount <= 0) {
      throw new HttpError(HttpStatus.HTTP_STATUS_NOT_FOUND, "The theme couldn't be found.");
    }

    return DbTypeConverter.toTheme(queryResult.rows[0]);
  }

  /**
   * Gets all the themes that are available to a user.
   *
   * @param userId
   * @param includeGlobal Should global themes be included in the results?
   */
  async listThemes(userId: string, includeGlobal: boolean = true): Promise<Theme[]> {
    let queryResult: QueryResult<DbTheme>;

    if (includeGlobal) {
      queryResult = await this.pool.query<DbTheme>("select * from app.themes where user_id=$1 or global=true", [userId]);
    } else {
      queryResult = await this.pool.query<DbTheme>("select * from app.themes where user_id=$1", [userId]);
    }

    if (queryResult.rowCount <= 0) {
      throw new HttpError(HttpStatus.HTTP_STATUS_NOT_FOUND, "No themes were found.");
    }

    return queryResult.rows.map(x => DbTypeConverter.toTheme(x));
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
    colors?: ThemeColors,
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

    if (queryResult.rowCount <= 0) {
      throw new HttpError(HttpStatus.HTTP_STATUS_INTERNAL_SERVER_ERROR, "Failed to add a new theme because of an internal server error.");
    }

    return DbTypeConverter.toTheme(queryResult.rows[0]);
  }
}
