import {DatabaseManager} from "../data/database-manager";
import {DatabaseService} from "./database-service";
import {DbTypeConverter} from "../utils/db-type-converter";
import {HttpError} from "../utils/http-error";
import {constants as HttpStatus} from "http2";

interface AnalyticsProfileData {
  totalProfileViews: number,
  linkVisits: {
    link: Link,
    views: number
  }[],
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
    let queryResult = await this.pool.query<DbAnalyticsGlobalStats>("select * from analytics.global_stats");

    if (queryResult.rowCount <= 0) {
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
  async getLink(linkId: string, updateAnalytics: boolean): Promise<Link> {
    let queryResult = await this.pool.query<DbLink>("select * from app.links where id=$1", [linkId]);

    if (queryResult.rowCount <= 0) {
      throw new HttpError(HttpStatus.HTTP_STATUS_NOT_FOUND, "The link could not be found.");
    }

    if (updateAnalytics) {
      await this.pool.query("insert into analytics.visits(type, referral_id) values ($1, $2)", ['link', linkId]);
    }

    return DbTypeConverter.toLink(queryResult.rows[0]);
  }

  /**
   * Gets the analytics data for a specific profile.
   *
   * @param profileId
   * @param dayRange The number of days to limit the range by, default is 30
   */
  async getProfileAnalyticsData(profileId: string, dayRange: number = 30): Promise<AnalyticsProfileData> {
    // TODO use subscription tier to check for date range, for now leave it at 30 days

    let profileViewQuery = await this.pool.query<{ profile_views: number }>(`select count(*) filter (where type = 'page') as profile_views from analytics.visits where referral_id = $1 and created_on > current_date - interval '${dayRange}' day`,
      [
        profileId,
      ]);

    if (profileViewQuery.rowCount <= 0) {
      throw new HttpError(HttpStatus.HTTP_STATUS_NOT_FOUND, "The profile views could not be found.");
    }

    let linksQuery = await this.pool.query<DbLink>("select * from app.links where profile_id=$1", [profileId]);

    if (linksQuery.rowCount <= 0) {
      throw new HttpError(HttpStatus.HTTP_STATUS_NOT_FOUND, "The links could not be found.");
    }

    let linkVisits: { link: Link, views: number }[] = [];
    let totalLinks = 0;

    for (let i = 0; i < linksQuery.rowCount; i++) {
      let link = linksQuery.rows[i];
      let linkVisitQuery = await this.pool.query<DbAnalyticsVisit>(`select * from analytics.visits where referral_id = $1 and created_on > current_date - interval '${dayRange}' day`, [link.id]);

      totalLinks++;

      let linkVisitCount = 0;

      for (const visit of linkVisitQuery.rows) {
        linkVisitCount++;
      }

      linkVisits.push({
        link: DbTypeConverter.toLink(link),
        views: linkVisitCount
      });
    }

    let totalProfileViews = profileViewQuery.rows[0].profile_views;
    let clickThroughRate = (totalLinks / totalProfileViews) * 100;

    return {
      totalProfileViews,
      linkVisits,
      clickThroughRate
    };
  }
}
