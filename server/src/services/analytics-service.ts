import {DatabaseManager} from "../managers/database-manager";
import {DatabaseService} from "./base-service";

/**
 * This service takes care of transactional tasks for the Analytics Controller.
 */
export class AnalyticsService extends DatabaseService {

  constructor(databaseManager: DatabaseManager) {
    super(databaseManager);
  }

  /**
   * Returns analytics data from the database.
   *
   * Returns all data as -1 if the database was unable to be queried.
   */
  async getAnalytics(): Promise<{ total_users: number, total_profiles: number, profiles_published: number, total_links: number, total_themes: number }> {
    let queryResult = await this.pool.query("select * from users.analytics_view");

    if (queryResult.rowCount > 0) {
      let data = queryResult.rows[0];

      return {
        total_users: data.total_users,
        total_profiles: data.total_profiles,
        profiles_published: data.profiles_published,
        total_links: data.total_links,
        total_themes: data.total_themes,
      };
    } else {
      return {
        total_users: -1,
        total_profiles: -1,
        profiles_published: -1,
        total_links: -1,
        total_themes: -1,
      };
    }
  }

  /**
   * Returns a link and increments the links analytics counter.
   * This counts as a user "visiting" a link.
   *
   * The analytics will only be incremented if "updateAnalytics" is true.
   *
   * @param id: The id of the link that is being visited
   * @param updateAnalytics: Should we update analytics?
   */
  async getLink(id: string, updateAnalytics: boolean): Promise<{ url: string, use_deep_link: boolean } | null> {
    let queryResult = await this.pool.query("select * from users.links");

    if (queryResult.rowCount > 0) {
      let data = queryResult.rows[0];

      if (updateAnalytics) {
        await this.pool.query("insert into history.visits( \"type\", referral) values ($1, $2)", ['link', id]);
      }

      return {
        url: data.url,
        use_deep_link: data.use_deep_link
      };
    } else {
      return null;
    }
  }
}
