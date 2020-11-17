import {DatabaseManager} from "../data/database-manager";
import {DatabaseService} from "./database-service";
import {QueryUtils} from "../utils/query-utils";
import {PoolClient} from "pg";
import {Converter} from "../utils/converter";
import {HttpError} from "../utils/http-error";
import {constants as HttpStatus} from "http2";

/**
 * This service takes care of transactional tasks related to Links.
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
   * @param sortOrder
   * @param label The link's label
   * @param subtitle The link's subtitle
   * @param style
   * @param customCss
   * @param useDeepLink Should the link be a mobile deep link?
   */
  async createLink(
    profileId: string,
    url: string,
    sortOrder: number,
    label: string,
    subtitle?: string,
    style?: string,
    customCss?: string,
    useDeepLink: boolean = false
  ): Promise<Link | HttpError> {
    let queryResult = await this.pool.query(`insert into app.links (profile_id, label, url, sort_order, subtitle, style, custom_css, use_deep_link) values ${QueryUtils.values(8)} returning *;`,
      [
        profileId,
        label,
        url,
        sortOrder,
        subtitle,
        style,
        customCss,
        useDeepLink
      ]);

    if (queryResult.rowCount > 0) {
      return Converter.toLink(queryResult.rows[0]);
    } else {
      return new HttpError(HttpStatus.HTTP_STATUS_NOT_FOUND, "The link couldn't be found.");
    }
  }

  /**
   * Updates a link and returns it.
   *
   * @param linkId The id of the link
   * @param url
   * @param sortOrder
   * @param label The link's label
   * @param subtitle The link's subtitle
   * @param style
   * @param customCss
   * @param useDeepLink Should the link be a mobile deep link?
   */
  async updateLink(
    linkId: string,
    url?: string,
    sortOrder?: number,
    label?: string,
    subtitle?: string,
    style?: string,
    customCss?: string,
    useDeepLink?: boolean
  ): Promise<Link | HttpError> {
    let queryResult = await this.pool.query("update app.links set url=coalesce($1, url), sort_order=coalesce($2, sort_order), label=coalesce($3, label), subtitle=coalesce($4, subtitle), style=coalesce($5, style), custom_css=coalesce($6, custom_css), use_deep_link=coalesce($7, use_deep_link) where id=$8 returning *;",
      [
        url,
        sortOrder,
        label,
        subtitle,
        style,
        customCss,
        useDeepLink,
        linkId
      ]);

    if (queryResult.rowCount > 0) {
      return Converter.toLink(queryResult.rows[0]);
    } else {
      return new HttpError(HttpStatus.HTTP_STATUS_NOT_FOUND, "The link couldn't be found.");
    }
  }

  /**
   * Deletes a link and returns a list of remaining links of the profile owner.
   *
   * @param linkId The id of the link to delete
   */
  async deleteLink(linkId: string): Promise<Link[] | HttpError> {
    let queryResult = await this.pool.query(
      "delete from app.links where id=$1 returning profile_id",
      [linkId]);

    if (queryResult.rowCount > 0) {
      let profileId = queryResult.rows[0].profile_id;

      return this.listLinks(profileId);
    } else {
      return new HttpError(HttpStatus.HTTP_STATUS_NOT_FOUND, "The link couldn't be found.");
    }
  }

  /**
   * Returns a list of all the links associated with a profile.
   *
   * @param profileId The profile that owns the links
   */
  async listLinks(profileId: string): Promise<Link[] | HttpError> {
    let queryResult = await this.pool.query("select * from app.links where profile_id=$1 order by sort_order desc", [profileId]);

    if (queryResult.rowCount > 0) {
      return queryResult.rows.map(x => {
        return Converter.toLink(x);
      });
    } else {
      return new HttpError(HttpStatus.HTTP_STATUS_NOT_FOUND, "The links couldn't be found.");
    }
  }

  /**
   * Returns the amount of links on a profile.
   *
   * @param profileId The profile associated with the links.
   */
  async getProfileLinkCount(profileId: string): Promise<number> {
    let queryResult = await this.pool.query("select count(*) from app.links where profile_id=$1", [profileId]);

    return queryResult.rowCount > 0 ? Number.parseInt(queryResult.rows[0].count) : 0;
  }

  /**
   * Reorders a link.
   * @param profileId
   * @param oldIndex
   * @param newIndex
   */
  async reorderLinks(profileId: string, oldIndex: number, newIndex: number): Promise<Link[] | HttpError> {
    let db: PoolClient = await this.pool.connect();

    try {
      await db.query("begin");

      let queryResult = await db.query("select * from app.links where profile_id=$1 order by sort_order", [profileId]);

      if (queryResult.rowCount < 1) {
        return new HttpError(HttpStatus.HTTP_STATUS_NOT_FOUND, "The link couldn't be found.");
      }

      let linkRows: any[] = queryResult.rows;
      let linkRow: any;

      if (oldIndex >= 0 && oldIndex < linkRows.length && newIndex >= 0 && newIndex < linkRows.length) {
        if (oldIndex < linkRows.length) {
          linkRow = linkRows[oldIndex];
        }

        if (linkRow) {
          // Delete old index
          linkRows.splice(oldIndex, 1);

          // Insert at new index
          linkRows.splice(newIndex, 0, linkRow);
        }

        for (let i = 0; i < linkRows.length; i++) {
          linkRows[i].sort_order = i;

          await db.query("update app.links set sort_order=$1 where id=$2", [i, linkRows[i].id]);
        }
      }

      await db.query("commit");

      return linkRows.map(x => {
        return Converter.toLink(x);
      });

    } catch (err) {
      console.log("Failed to reorder links:");
      console.error(err);

      await db.query("rollback");
    } finally {
      db.release();
    }

    return new HttpError(HttpStatus.HTTP_STATUS_INTERNAL_SERVER_ERROR, "The link couldn't be reorder because of an internal error.");
  }
}
