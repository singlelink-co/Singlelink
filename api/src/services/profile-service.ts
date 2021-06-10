import {DatabaseManager} from "../data/database-manager";
import {DatabaseService} from "./database-service";
import Axios, {AxiosResponse} from "axios";
import {config} from "../config/config";
import {DbTypeConverter} from "../utils/db-type-converter";
import {HttpError} from "../utils/http-error";
import {StatusCodes} from "http-status-codes";
import {StringUtils} from "../utils/string-utils";
import {QueryResult} from "pg";
import {DatabaseError} from 'pg-protocol/dist/messages';

/**
 * This service takes care of transactional tasks related to Profiles.
 */
export class ProfileService extends DatabaseService {

  constructor(databaseManager: DatabaseManager) {
    super(databaseManager);
  }

  /**
   * Gets a profile by id.
   *
   * @param profileId
   */
  async getProfile(profileId: string): Promise<Profile> {
    let profileResult = await this.pool.query<DbProfile>("select * from app.profiles where id=$1", [profileId]);

    if (profileResult.rowCount < 1) {
      throw new HttpError(StatusCodes.NOT_FOUND, "The profile couldn't be found.");
    }

    let profileRow = profileResult.rows[0];

    return DbTypeConverter.toProfile(profileRow);
  }

  /**
   * Gets a profile by handle.
   *
   * @param handle The handle of the profile.
   * @param checkVisibility Throw an HttpError if the profile is unpublished.
   */
  async getProfileByHandle(handle: string, checkVisibility: boolean): Promise<Profile> {
    let profileResult = await this.pool.query<DbProfile>("select * from app.profiles where handle=$1", [handle]);

    if (profileResult.rowCount < 1) {
      throw new HttpError(StatusCodes.NOT_FOUND, "The profile couldn't be found.");
    }

    let profileRow = profileResult.rows[0];

    if (checkVisibility) {
      if (profileRow.visibility === 'unpublished') {
        throw new HttpError(StatusCodes.FORBIDDEN, "This profile is unpublished.");
      }
    }

    return DbTypeConverter.toProfile(profileRow);
  }

  /**
   * Uses Neutron Capture to generate a thumbnail image of a profile.
   *
   * @param handle
   */
  async getThumbnailByHandle(handle: string): Promise<AxiosResponse<ArrayBuffer>> {
    let url: string;
    let thumbnail: AxiosResponse<ArrayBuffer>;
    let scale = 3;

    let final_size = {
      x: 1200,
      y: 630
    };

    let resolution = {
      x: final_size.x / scale,
      y: final_size.y / scale
    };

    try {
      url = `https://capture.neutroncreative.com/api/v1/capture?apiKey=${config.captureKey}&url=${config.clientDomain}/u/${handle}&size=${resolution.x}x${resolution.y}&crop=true&scale=${scale}`;
      thumbnail = await Axios.get<ArrayBuffer>(url, {
        responseType: "arraybuffer"
      });

      return thumbnail;
    } catch (err) {
      console.error(err);
      throw new HttpError(StatusCodes.INTERNAL_SERVER_ERROR, "An internal error occurred while fetching the thumbnail.");
    }
  }

  /**
   * Creates a new profile.
   *
   * @param userId The userId that owns this profile.
   * @param handle The handle that is given to the newly created profile for this account Ex: singlelink.co/u/neutroncreative
   * @param imageUrl
   * @param headline
   * @param subtitle
   */
  async createProfile(userId: string, handle?: string, imageUrl?: string, headline?: string, subtitle?: string): Promise<Profile> {
    if (!handle) {
      handle = StringUtils.generateRandomSlug();
    }

    let queryResult = await this.pool.query<DbProfile>("insert into app.profiles (handle, user_id, image_url, headline, subtitle) values ($1, $2, $3, $4, $5) on conflict do nothing returning *",
      [
        handle,
        userId,
        imageUrl,
        headline,
        subtitle
      ]);

    if (queryResult.rowCount < 1)
      throw new HttpError(StatusCodes.CONFLICT, "The profile couldn't be added because it is already being used.");

    return DbTypeConverter.toProfile(queryResult.rows[0]);
  }

  /**
   * Gets all the profiles that an account is associated with.
   *
   * @param userId
   */
  async listProfiles(userId: string): Promise<Profile[]> {
    let queryResult = await this.pool.query<DbProfile>("select * from app.profiles where user_id=$1", [userId]);

    if (queryResult.rowCount < 1)
      throw new HttpError(StatusCodes.NOT_FOUND, "The profiles couldn't be found.");

    return queryResult.rows.map(x => {
      return DbTypeConverter.toProfile(x);
    });
  }

  /**
   * Sets the active theme for a profile. Clears it if the themeId is null.
   *
   * @param profileId
   * @param themeId
   */
  async setActiveTheme(profileId: string, themeId: string): Promise<Profile> {
    let queryResult = await this.pool.query<DbProfile>("update app.profiles set theme_id=$1 where id=$2 returning *", [themeId, profileId]);

    if (queryResult.rowCount < 1)
      throw new HttpError(StatusCodes.NOT_FOUND, "The profile couldn't be found.");

    return DbTypeConverter.toProfile(queryResult.rows[0]);
  }

  /**
   * Returns the amounts on a account.
   *
   * @param userId The user id associated with the profiles.
   */
  async getProfileCount(userId: string): Promise<number> {
    return (await this.pool.query<{ count: number }>("select count(*) from app.profiles where user_id=$1", [userId])).rows[0].count;
  }

  /**
   * Updates a profile.
   *
   * @param profileId
   * @param imageUrl
   * @param headline
   * @param subtitle
   * @param handle
   * @param visibility
   * @param showWatermark
   * @param customCss
   * @param customHtml
   * @param customDomain
   */
  async updateProfile(
    profileId: string,
    imageUrl?: string,
    headline?: string,
    subtitle?: string,
    handle?: string,
    visibility?: string,
    showWatermark?: boolean,
    customCss?: string,
    customHtml?: string,
    customDomain?: string
  ): Promise<Profile> {
    let queryResult: QueryResult<DbProfile>;

    try {
      queryResult = await this.pool.query<DbProfile>("update app.profiles set image_url=coalesce($1, image_url), headline=coalesce($2, headline), subtitle=coalesce($3, subtitle), handle=coalesce($4, handle), visibility=coalesce($5, visibility), show_watermark=coalesce($6, show_watermark), custom_css=coalesce($7, custom_css), custom_html=coalesce($8, custom_html), custom_domain=coalesce($9, custom_domain) where id=$10 returning *;",
        [
          imageUrl,
          headline,
          subtitle,
          handle,
          visibility,
          showWatermark,
          customCss,
          customHtml,
          customDomain,
          profileId
        ]);
    } catch (err) {
      if (err instanceof DatabaseError) {
        if (err.message.includes("duplicate key")) {
          throw new HttpError(StatusCodes.CONFLICT, "This handle is already being used.");
        }
      }

      throw err;
    }

    if (queryResult.rowCount < 1)
      throw new HttpError(StatusCodes.NOT_FOUND, "The profile couldn't be found.");

    return DbTypeConverter.toProfile(queryResult.rows[0]);
  }

  /**
   * Deletes a profile. The user cannot delete a profile if they only have one.
   *
   * @param userId
   * @param profileId
   */
  async deleteProfile(userId: string, profileId: string): Promise<Profile> {
    let profilesResult = await this.listProfiles(userId);

    let profileRow: Profile | undefined = profilesResult.find(x => x.id === profileId);

    if (!profileRow) {
      throw new HttpError(StatusCodes.NOT_FOUND, "The user doesn't own this profile.");
    }

    profilesResult.splice(profilesResult.indexOf(profileRow), 1);

    if (await this.getProfileCount(userId) <= 1) {
      throw new HttpError(StatusCodes.BAD_REQUEST, "You cannot delete your only profile.");
    }

    let deletedProfile = await this.pool.query<DbProfile>("delete from app.profiles where id=$1", [profileId]);

    if (deletedProfile.rowCount < 1) {
      throw new HttpError(StatusCodes.INTERNAL_SERVER_ERROR, "Unable to delete the profile because of an internal error.");
    }

    let nextProfile = profilesResult[0];

    await this.pool.query("update app.users set active_profile_id=$1 where id=$2", [nextProfile.id, userId]);

    return nextProfile;
  }

  /**
   * Enables/Disables privacy mode for a profile. (Hide from analytics and visibility from certain areas.)
   *
   * @param profileId
   * @param privacyModeEnabled
   */
  async setPrivacyMode(profileId: string, privacyModeEnabled: boolean): Promise<Profile> {
    let queryResult = await this.pool.query<DbProfile>(`update app.profiles
                                                        set metadata = jsonb_set(metadata::jsonb, '{privacyMode}', $1, true)
                                                        where id = $2
                                                        returning *;`,
      [privacyModeEnabled, profileId]);

    if (queryResult.rowCount < 1) {
      throw new HttpError(StatusCodes.INTERNAL_SERVER_ERROR, "Unable to update the profile because of an internal error.");
    }

    return DbTypeConverter.toProfile(queryResult.rows[0]);
  }

  /**
   * Enables/Disables unlisted mode for a profile. (Hide from promotional featuring.)
   *
   * @param profileId
   * @param unlisted
   */
  async setUnlisted(profileId: string, unlisted: boolean): Promise<Profile> {
    let queryResult = await this.pool.query<DbProfile>(`update app.profiles
                                                        set metadata = jsonb_set(metadata::jsonb, '{unlisted}', $1, true)
                                                        where id = $2
                                                        returning *;`,
      [unlisted, profileId]);

    if (queryResult.rowCount < 1) {
      throw new HttpError(StatusCodes.INTERNAL_SERVER_ERROR, "Unable to update the profile because of an internal error.");
    }

    return DbTypeConverter.toProfile(queryResult.rows[0]);
  }

  /**
   * Gets the top profiles by views. Also returns total link clicks.
   *
   * You can only get a max of 500 results.
   * @param limit
   */
  async getTopProfiles(limit?: number): Promise<(Profile & { totalViews: number, totalClicks: number })[]> {
    if (!limit) {
      limit = 25;
    }

    if (limit > 500) {
      limit = 500;
    }

    let profileQueryResult = await this.pool.query<DbProfile & { total_views: string }>(`select *,
                                                                                                (select count(*)
                                                                                                 from analytics.visits
                                                                                                 where referral_id = app.profiles.id
                                                                                                   and type = 'page') as total_views
                                                                                         from app.profiles
                                                                                         where ((metadata -> 'unlisted')::bool = true or metadata -> 'unlisted' is null)
                                                                                           and visibility = 'published'
                                                                                         order by total_views desc
                                                                                         limit $1;`,
      [limit]);

    let profiles: (Profile & { totalViews: number, totalClicks: number })[] = [];

    for (let dbProfile of profileQueryResult.rows) {
      let profile = <Profile & { totalViews: number, totalClicks: number }>DbTypeConverter.toProfile(dbProfile);
      profile.totalViews = Number.parseInt(dbProfile.total_views);
      profile.totalClicks = 0;

      let linkQueryResult = await this.pool.query<DbLink>("select id from app.links where profile_id=$1",
        [profile.id]);

      if (linkQueryResult.rowCount > 0) {
        let linkIds = linkQueryResult.rows.map(x => x.id);

        let queryResult = await this.pool.query<{ count: string }>("select count(*) from analytics.visits where referral_id=any($1) and type='link'",
          [linkIds]);

        let count: number = Number.parseInt(queryResult.rows[0].count);
        profile.totalClicks += count;
      }

      profiles.push(profile);
    }

    return profiles;
  }
}
