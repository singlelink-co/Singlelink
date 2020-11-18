import {DatabaseManager} from "../data/database-manager";
import {DatabaseService} from "./database-service";
import {DbTypeConverter} from "../utils/db-type-converter";
import {HttpError} from "../utils/http-error";
import {constants as HttpStatus} from "http2";

interface AnalyticsProfileData {
  profileViews: number,
  linkViews: number,
  clickThroughRate: number
}

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
  async getAnalytics(): Promise<AnalyticsGlobalStats> {
    let queryResult = await this.pool.query<AppAnalyticsGlobalStats>("select * from analytics.global_stats");

    if (queryResult.rowCount < 1) {
      return {
        totalUsers: -1,
        totalProfiles: -1,
        profilesPublished: -1,
        totalLinks: -1,
        totalThemes: -1,
      };
    }

    return DbTypeConverter.toAnalytics(queryResult.rows[0]);
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
    let queryResult = await this.pool.query<AppLink>("select * from app.links where id=$1", [linkId]);

    if (queryResult.rowCount < 1) {
      return new HttpError(HttpStatus.HTTP_STATUS_NOT_FOUND, "The link could not be found.");
    }

    if (updateAnalytics) {
      await this.pool.query("insert into analytics.visits(type, referral) values ($1, $2)", ['link', linkId]);
    }

    return DbTypeConverter.toLink(queryResult.rows[0]);
  }

  /**
   * Gets the analytics data for a specific profile.
   *
   * @param profileId
   */
  async getProfileAnalyticsData(profileId: string): Promise<AnalyticsProfileData | HttpError> {
    // TODO use subscription tier to check for date range, for now leave it at 30 days

    let views = await this.pool.query<{ profile_views: number, link_views: number }>("select count(*) filter (where type='page') as profile_views, count(*) filter (where type='link') as link_views from analytics.visits where referral=$1 and created_on > current_date - interval '30' day",
      [
        profileId,
      ]);

    if (views.rowCount < 1) {
      return new HttpError(HttpStatus.HTTP_STATUS_NOT_FOUND, "The link could not be found.");
    }

    let profileViews = views.rows[0].profile_views;
    let linkViews = views.rows[0].link_views;
    let clickThroughRate = (linkViews / profileViews) * 100;

    return {
      profileViews,
      linkViews,
      clickThroughRate
    };
  }
}
