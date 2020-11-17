import {DatabaseManager} from "../data/database-manager";
import {DatabaseService} from "./database-service";
import {HttpError} from "../utils/http-error";
import {constants as HttpStatus} from "http2";

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
  async getTheme(themeId: string): Promise<Theme | HttpError> {
    let queryResult = await this.pool.query("select * from app.themes where id=$1", [themeId]);

    if (queryResult.rowCount > 0) {
      let theme = queryResult.rows[0];

      return {
        id: theme.id,
        label: theme.label,
        global: theme.global,
        colors: theme.colors,
        customCss: theme.custom_css,
        customHtml: theme.custom_html,
        userId: theme.user_id,
        createdOn: theme.created_on
      };
    }

    return new HttpError(HttpStatus.HTTP_STATUS_NOT_FOUND, "The theme couldn't be found.");
  }

}
