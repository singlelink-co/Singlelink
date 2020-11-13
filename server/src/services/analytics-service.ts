import {DatabaseManager} from "../data/database-manager";
import {DatabaseService} from "./database-service";

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
  async getAnalytics(): Promise<Analytics> {
    let queryResult = await this.pool.query("select * from users.analytics_view");

    if (queryResult.rowCount > 0) {
      let data = queryResult.rows[0];

      return {
        totalUsers: data.total_users,
        totalProfiles: data.total_profiles,
        profilesPublished: data.profiles_published,
        totalLinks: data.total_links,
        totalThemes: data.total_themes,
      };
    } else {
      return {
        totalUsers: -1,
        totalProfiles: -1,
        profilesPublished: -1,
        totalLinks: -1,
        totalThemes: -1,
      };
    }
  }

  /**
   * Returns a link and increments the links analytics counter.
   * This counts as a user "visiting" a link.
   *
   * The analytics will only be incremented if "updateAnalytics" is true.
   *
   * @param id The id of the link that is being visited
   * @param updateAnalytics Should we update analytics?
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
