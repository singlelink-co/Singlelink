import {FastifyInstance, FastifyReply, FastifyRequest, RequestGenericInterface, RouteHandlerMethod} from "fastify";
import {DatabaseManager} from "../data/database-manager";
import {AnalyticsService} from "../services/analytics-service";
import {constants as HttpStatus} from "http2";
import {DeepLinker} from "nc-deeplink";
import {Controller} from "./controller";
import {HttpError} from "../utils/http-error";
import {Auth, AuthenticatedRequest} from "../utils/auth";
import {ReplyUtils} from "../utils/reply-utils";

interface LinkAnalyticsRequest extends RequestGenericInterface {
  Params: {
    id?: string
  }
}

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
    // Unauthenticated
    this.fastify.get('/analytics', this.GetAnalytics.bind(this));
    this.fastify.all('/analytics/link/:id', this.LinkAnalytics.bind(this));

    // Authenticated
    this.fastify.all('/analytics/profile', Auth.AuthRouteOptions, <RouteHandlerMethod>this.GetProfileAnalytics.bind(this));
  }

  /**
   * Route for /analytics
   *
   * Used to get general SingleLink analytics.
   *
   * @param request
   * @param reply
   * @constructor
   */
  async GetAnalytics(request: FastifyRequest, reply: FastifyReply) {
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
  async LinkAnalytics(request: FastifyRequest<LinkAnalyticsRequest>, reply: FastifyReply) {
    let params = request.params;
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
      }
    }

    return reply.redirect(link?.url);
  }

  /**
   * Route for /visit
   * @param request
   * @param reply
   */
  async GetProfileAnalytics(request: AuthenticatedRequest, reply: FastifyReply) {
    if (!request.profile) {
      return reply.status(HttpStatus.HTTP_STATUS_BAD_REQUEST).send(ReplyUtils.error("This account doesn't have an active profile."));
    }

    let data = await this.analyticsService.getProfileAnalyticsData(request.profile.id);

    if (data instanceof HttpError) {
      let error: HttpError = data;
      reply.code(error.statusCode);

      return ReplyUtils.error(error.message, error);
    }

    return data;
  }
}
