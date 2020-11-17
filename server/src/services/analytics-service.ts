import {DatabaseManager} from "../data/database-manager";
import {DatabaseService} from "./database-service";
import {Converter} from "../utils/converter";
import {HttpError} from "../utils/http-error";
import {constants as HttpStatus} from "http2";

/**
 * This service takes care of transactional tasks for Analytics.
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
    let queryResult = await this.pool.query("select * from app.analytics_view");

    if (queryResult.rowCount > 0) {
      let data = queryResult.rows[0];

      return Converter.toAnalytics(data);
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
   * @param linkId The linkId of the link that is being visited
   * @param updateAnalytics Should we update analytics?
   */
  async getLink(linkId: string, updateAnalytics: boolean): Promise<Link | HttpError> {
    let queryResult = await this.pool.query("select * from app.links where id=$1", [linkId]);

    if (queryResult.rowCount > 0) {
      let data = queryResult.rows[0];

      if (updateAnalytics) {
        await this.pool.query("insert into history.visits(type, referral) values ($1, $2)", ['link', linkId]);
      }

      return Converter.toLink(data);
    } else {
      return new HttpError(HttpStatus.HTTP_STATUS_NOT_FOUND, "The link could not be found.");
    }
  }
}
