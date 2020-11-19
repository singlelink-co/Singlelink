import {FastifyInstance, FastifyReply, FastifyRequest, RequestGenericInterface} from "fastify";
import {DatabaseManager} from "../data/database-manager";
import {AnalyticsService} from "../services/analytics-service";
import {constants as HttpStatus} from "http2";
import {DeepLinker} from "nc-deeplink";
import {Controller} from "./controller";
import {HttpError} from "../utils/http-error";
import {AuthenticatedRequest, AuthOpts} from "../utils/auth";
import {ReplyUtils} from "../utils/reply-utils";

interface LinkAnalyticsRequest extends RequestGenericInterface {
  Params: {
    id?: string
  }
}

interface GetProfileAnalyticsRequest extends AuthenticatedRequest {
  Body: {
    dayRange: number,
    dateRange: string
  } & AuthenticatedRequest["Body"]
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
    this.fastify.all<GetProfileAnalyticsRequest>('/analytics/profile', AuthOpts.ValidateWithData, this.GetProfileAnalytics.bind(this));
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
    try {
      let params = request.params;
      let id = params.id;

      if (!id) {
        reply.code(HttpStatus.HTTP_STATUS_NOT_FOUND);
        return ReplyUtils.error("The link was not found.");
      }

      let link = await this.analyticsService.getLink(id, true);

      if (link.useDeepLink) {
        const userAgent = request.headers["user-agent"];

        if (userAgent) {
          const deepLink = DeepLinker.parseDeepLink(link.url, userAgent);

          reply.redirect(deepLink);
          return;
        }
      }

      reply.redirect(link?.url);
    } catch (e) {
      if (e instanceof HttpError) {
        reply.code(e.statusCode);
        return ReplyUtils.error(e.message, e);
      }

      throw e;
    }
  }

  /**
   * Route for /analytics/profile
   * @param request
   * @param reply
   */
  async GetProfileAnalytics(request: FastifyRequest<GetProfileAnalyticsRequest>, reply: FastifyReply) {
    try {
      if (!request.body.profile) {
        reply.status(HttpStatus.HTTP_STATUS_BAD_REQUEST).send(ReplyUtils.error("This account doesn't have an active profile."));
        return;
      }

      // TODO Grab dateRange/dayRange and pass it in for time specific analytics

      return await this.analyticsService.getProfileAnalyticsData(request.body.profile.id);
    } catch (e) {
      if (e instanceof HttpError) {
        reply.code(e.statusCode);
        return ReplyUtils.error(e.message, e);
      }

      throw e;
    }
  }
}
