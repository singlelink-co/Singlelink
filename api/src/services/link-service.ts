import {DatabaseManager} from "../data/database-manager";
import {DatabaseService} from "./database-service";
import {PoolClient} from "pg";
import {DbTypeConverter} from "../utils/db-type-converter";
import {HttpError} from "../utils/http-error";
import {StatusCodes} from "http-status-codes";

/**
 * This service takes care of transactional tasks related to Links.
 */
export class LinkService extends DatabaseService {

  constructor(databaseManager: DatabaseManager) {
    super(databaseManager);
  }

  /**
   * Returns a link.
   *
   * @param linkId The id of the link that is being visited
   */
  async getLink(linkId: string): Promise<Link> {
    let queryResult = await this.pool.query<DbLink>("select * from app.links where id=$1", [linkId]);

    if (queryResult.rowCount < 1)
      throw new HttpError(StatusCodes.NOT_FOUND, "The link could not be found.");

    return DbTypeConverter.toLink(queryResult.rows[0]);
  }

  /**
   * Creates a link and returns it.
   *
   * @param link The link to be added
   */
  async createLink(link: Partial<Link>): Promise<Link> {
    let queryResult = await this.pool.query<DbLink>(`insert into app.links (profile_id, label, type, url, sort_order,
                                                                            subtitle, style, custom_css, use_deep_link,
                                                                            metadata)
                                                     values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                                                     returning *;`,
      [
        link.profileId,
        link.label,
        link.type ?? "link",
        link.url,
        link.sortOrder,
        link.subtitle,
        link.style,
        link.customCss,
        link.useDeepLink ?? false,
        link.metadata ?? "{}"
      ]);

    if (queryResult.rowCount < 1)
      throw new HttpError(StatusCodes.NOT_FOUND, "The link couldn't be created.");

    return DbTypeConverter.toLink(queryResult.rows[0]);
  }

  /**
   * Updates a link and returns it.
   *
   * @param link The link that should be updated
   */
  async updateLink(link: Partial<Link>): Promise<Link> {
    let queryResult = await this.pool.query<DbLink>("update app.links set type=coalesce($1, type), url=coalesce($2, url), sort_order=coalesce($3, sort_order), label=coalesce($4, label), subtitle=coalesce($5, subtitle), style=coalesce($6, style), custom_css=coalesce($7, custom_css), use_deep_link=coalesce($8, use_deep_link), metadata=coalesce($9, metadata) where id=$10 returning *;",
      [
        link.type,
        link.url,
        link.sortOrder,
        link.label,
        link.subtitle,
        link.style,
        link.customCss,
        link.useDeepLink,
        link.metadata ?? "{}",
        link.id
      ]);

    if (queryResult.rowCount < 1)
      throw new HttpError(StatusCodes.NOT_FOUND, "The link couldn't be found.");

    return DbTypeConverter.toLink(queryResult.rows[0]);
  }

  /**
   * Deletes a link and returns a list of remaining links of the profile owner.
   *
   * @param linkId The id of the link to delete
   */
  async deleteLink(linkId: string): Promise<string> {
    let queryResult = await this.pool.query<DbLink>(
      "delete from app.links where id=$1 returning profile_id",
      [linkId]);

    if (queryResult.rowCount < 1)
      throw new HttpError(StatusCodes.NOT_FOUND, "The link couldn't be found.");

    return queryResult.rows[0].profile_id;
  }

  /**
   * Returns a list of all the links associated with a profile.
   *
   * @param profileId The profile that owns the links
   */
  async listLinks(profileId: string): Promise<Link[]> {
    let queryResult = await this.pool.query<DbLink>("select * from app.links where profile_id=$1 order by sort_order desc", [profileId]);

    if (queryResult.rowCount < 1)
      return [];

    return queryResult.rows.map(x => {
      return DbTypeConverter.toLink(x);
    });
  }

  /**
   * Returns the amount of links on a profile.
   *
   * @param profileId The profile associated with the links.
   */
  async getProfileLinkCount(profileId: string): Promise<number> {
    return (await this.pool.query("select count(*) from app.links where profile_id=$1", [profileId])).rows[0].count;
  }

  /**
   * Reorders a link.
   * @param profileId
   * @param oldIndex
   * @param newIndex
   */
  async reorderLinks(profileId: string, oldIndex: number, newIndex: number): Promise<Link[]> {
    let db: PoolClient = await this.pool.connect();

    try {
      await db.query("begin");

      let queryResult = await db.query<DbLink>("select * from app.links where profile_id=$1 order by sort_order", [profileId]);

      if (queryResult.rowCount < 1)
        return Promise.reject(new HttpError(StatusCodes.NOT_FOUND, "The profile couldn't be found."));

      let linkRows: DbLink[] = queryResult.rows;
      let linkRow: DbLink | undefined;

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
        return DbTypeConverter.toLink(x);
      });

    } catch (err) {
      console.log("Failed to reorder links:");
      console.error(err);

      await db.query("rollback");
    } finally {
      db.release();
    }

    throw new HttpError(StatusCodes.INTERNAL_SERVER_ERROR, "The link couldn't be reorder because of an internal error.");
  }
}
