import {DatabaseManager} from "../data/database-manager";
import {DatabaseService} from "./database-service";

/**
 * This service takes care of transactional tasks for the Link Controller.
 */
export class LinkService extends DatabaseService {

  constructor(databaseManager: DatabaseManager) {
    super(databaseManager);
  }

  /**
   * Creates a link and returns it.
   *
   * @param profileId The profile that owns this link.
   * @param url
   * @param order
   * @param label The link's label
   * @param subtitle The link's subtitle
   * @param style
   * @param customCss
   * @param useDeepLink Should the link be a mobile deep link?
   */
  async createLink(
    profileId: string,
    url: string,
    order: number,
    label: string,
    subtitle?: string,
    style?: string,
    customCss?: string,
    useDeepLink: boolean = false
  ): Promise<Link | null> {
    let queryResult = await this.pool.query("insert into users.links (profile_id, label, url, \"order\", subtitle, style, custom_css, use_deep_link)\nvalues ($1, $2, $3, $4, $5, $6, $7, $8)\nreturning *;",
      [
        profileId,
        label,
        url,
        order,
        subtitle,
        style,
        customCss,
        useDeepLink
      ]);

    if (queryResult.rowCount > 0) {
      let result = queryResult.rows[0];

      return {
        id: result.id,
        owner: result.owner,
        url: result.url,
        order: result.order,
        label: result.label,
        subtitle: result.subtitle,
        style: result.style,
        customCss: result.custom_css,
        useDeepLink: result.use_deep_link,
        createdOn: result.created_on
      };
    } else {
      return null;
    }
  }

  /**
   * Updates a link and returns it.
   *
   * @param linkId The id of the link
   * @param url
   * @param order
   * @param label The link's label
   * @param subtitle The link's subtitle
   * @param style
   * @param customCss
   * @param useDeepLink Should the link be a mobile deep link?
   */
  async updateLink(
    linkId: string,
    url?: string,
    order?: number,
    label?: string,
    subtitle?: string,
    style?: string,
    customCss?: string,
    useDeepLink?: boolean
  ): Promise<Link | null> {
    let queryResult = await this.pool.query('update users.links\nset url=coalesce($1, url),\n    "order" = coalesce($2, "order"),\n    label = coalesce($3, label),\n    subtitle = coalesce($4, subtitle),\n    style = coalesce($5, style),\n    custom_css = coalesce($6, custom_css),\n    use_deep_link = coalesce($7, use_deep_link)\nwhere id = $8\nreturning *;',
      [
        url,
        order,
        label,
        subtitle,
        style,
        customCss,
        useDeepLink,
        linkId
      ]);

    if (queryResult.rowCount > 0) {
      let result = queryResult.rows[0];

      return {
        id: result.id,
        owner: result.owner,
        url: result.url,
        order: result.order,
        label: result.label,
        subtitle: result.subtitle,
        style: result.style,
        customCss: result.custom_css,
        useDeepLink: result.use_deep_link,
        createdOn: result.created_on
      };
    } else {
      return null;
    }
  }

  /**
   * Returns the amount of links on a profile.
   *
   * @param profileId The profile associated with the links.
   */
  async getProfileLinkCount(profileId: string) {
    let queryResult = await this.pool.query("select count(*) from users.links where profile_id=$1", [profileId]);

    return queryResult.rowCount > 0 ? Number.parseInt(queryResult.rows[0].count) : 0;
  }


}
