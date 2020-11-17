import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import {DatabaseManager} from "../data/database-manager";
import {AnalyticsService} from "../services/analytics-service";
import {constants as HttpStatus} from "http2";
import {DeepLinker} from "nc-deeplink";
import {Controller} from "./controller";
import {HttpError} from "../utils/http-error";

/**
 * This controller maps and provides for all the controllers under /analytics.
 */
export class AnalyticsController extends Controller {
  private analyticsService: AnalyticsService;

  constructor(fastify: FastifyInstance, databaseManager: DatabaseManager) {
    super(fastify, databaseManager);

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
  async FetchAnalytics(request: FastifyRequest, reply: FastifyReply) {
    let data = await this.analyticsService.getAnalytics();

    return {
      users: data.totalUsers,
      profiles: data.totalProfiles,
      profilesPublished: data.profilesPublished,
      links: data.totalLinks,
      themes: data.totalThemes
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
    let params: any = request.params;
    let id = params.id;

    if (!id) {
      reply.code(HttpStatus.HTTP_STATUS_NOT_FOUND);
      return {};
    }

    let link = await this.analyticsService.getLink(id, true);

    if (link instanceof HttpError) {
      let error: HttpError = link;
      reply.code(error.statusCode);

      return {error: error.message};
    }

    if (link.useDeepLink) {
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
