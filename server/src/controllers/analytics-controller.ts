import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import {UserService} from "../services/user-service";
import {DatabaseManager} from "../managers/database-manager";
import {AnalyticsService} from "../services/analytics-service";
import {constants as HttpStatus} from "http2";
import {DeepLinker} from "nc-deeplink";

/**
 * This controller maps and provides for all the controllers under /analytics.
 */
export class AnalyticsController implements IController {
  private readonly userManager: UserService;

  private fastify: FastifyInstance;
  private databaseManager: DatabaseManager;
  private analyticsService: AnalyticsService;

  constructor(fastify: FastifyInstance, databaseManager: DatabaseManager) {
    this.fastify = fastify;
    this.databaseManager = databaseManager;
    this.userManager = new UserService(databaseManager);
    this.analyticsService = new AnalyticsService(databaseManager);
  }

  registerRoutes(): void {

    this.fastify.get('/analytics/fetch', this.FetchAnalytics.bind(this));
    this.fastify.all('/analytics/link/:id', this.LinkAnalytics.bind(this));

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
    let data = await this.analyticsService.getAnalytics();

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

    let link = await this.analyticsService.getLink(id, true);

    if (!link) {
      reply.type("application/json").code(HttpStatus.HTTP_STATUS_INTERNAL_SERVER_ERROR);
      return {error: "The link could not be processed by the managers."};
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
