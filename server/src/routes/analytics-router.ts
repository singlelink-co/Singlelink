import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import {UserManager} from "../server/user-manager";
import {DatabaseManager} from "../server/database-manager";
import {AnalyticsManager} from "../server/analytics-manager";
import {constants as HttpStatus} from "http2";
import {DeepLinker} from "nc-deeplink";

/**
 * The analytics router maps and provides for all the routes under /analytics.
 */
export class AnalyticsRouter implements IRouter {
  private readonly userManager: UserManager;

  private fastify: FastifyInstance;
  private databaseManager: DatabaseManager;
  private analyticsManager: AnalyticsManager;

  constructor(fastify: FastifyInstance, databaseManager: DatabaseManager) {
    this.fastify = fastify;
    this.databaseManager = databaseManager;
    this.userManager = new UserManager(databaseManager);
    this.analyticsManager = new AnalyticsManager(databaseManager);
  }

  registerRoutes(): void {

    this.fastify.get('/analytics/fetch', this.FetchAnalytics);

    this.fastify.all('/analytics/link/:id', this.LinkAnalytics);

  }

  /**
   * Route for /analytics/fetch
   *
   * Used to get general SingleLink analytics.
   *
   * @param request
   * @param reply
   * @constructor
   */
  async FetchAnalytics(request: FastifyRequest, reply: FastifyReply): Promise<any> {
    let data = await this.analyticsManager.getAnalytics();

    return {
      users: data.total_users,
      profiles: data.total_profiles,
      profiles_published: data.profiles_published,
      links: data.total_links,
      themes: data.total_themes
    };
  }

  /**
   * Route for /analytics/link/:id
   *
   * Used to redirect a request to the appropriate link.
   * Also records analytics on that specific link once called.
   *
   * @param request
   * @param reply
   * @constructor
   */
  async LinkAnalytics(request: FastifyRequest, reply: FastifyReply) {
    let id = (<any>request.params).id;

    if (!id) {
      reply.type("application/json").code(HttpStatus.HTTP_STATUS_NOT_FOUND);
      return {};
    }

    let link = await this.analyticsManager.getLink(id, true);

    if (!link) {
      reply.type("application/json").code(HttpStatus.HTTP_STATUS_INTERNAL_SERVER_ERROR);
      return {error: "The link could not be processed by the server."};
    }

    if (link.use_deep_link) {
      const userAgent = request.headers["user-agent"];

      if (userAgent) {

        const deepLink = DeepLinker.parseDeepLink(link.url, userAgent);
        return reply.redirect(deepLink);

      } else {
        return reply.redirect(link?.url);
      }

    } else {
      return reply.redirect(link?.url);
    }

  }
}
