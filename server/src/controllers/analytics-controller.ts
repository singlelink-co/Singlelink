import {FastifyInstance, FastifyReply, FastifyRequest, RequestGenericInterface} from "fastify";
import {DatabaseManager} from "../data/database-manager";
import {AnalyticsService} from "../services/analytics-service";
import {StatusCodes} from "http-status-codes";
import {DeepLinker} from "nc-deeplink";
import {Controller} from "./controller";
import {HttpError} from "../utils/http-error";
import {Auth, AuthenticatedRequest} from "../utils/auth";
import {ReplyUtils} from "../utils/reply-utils";
import {ProfileService} from "../services/profile-service";
import {LinkService} from "../services/link-service";

interface LinkAnalyticsRequest extends RequestGenericInterface {
  Params: {
    id?: string
  }
}

interface ProfileAnalyticsRequest extends RequestGenericInterface {
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

const rateLimitAnalytics = {
  config: {
    rateLimit: {
      max: 10,
      timeWindow: '1 second'
    }
  }
};

/**
 * This controller maps and provides for all the controllers under /analytics.
 */
export class AnalyticsController extends Controller {
  private analyticsService: AnalyticsService;
  private linkService: LinkService;
  private profileService: ProfileService;

  constructor(fastify: FastifyInstance, databaseManager: DatabaseManager) {
    super(fastify, databaseManager);

    this.analyticsService = new AnalyticsService(databaseManager);
    this.linkService = new LinkService(databaseManager);
    this.profileService = new ProfileService(databaseManager);
  }

  registerRoutes(): void {
    // Unauthenticated
    this.fastify.get('/analytics', this.GetAnalytics.bind(this));
    this.fastify.all('/analytics/link/:id', this.LinkAnalytics.bind(this));
    this.fastify.all('/analytics/profile/:id', this.ProfileAnalytics.bind(this));

    // Authenticated
    this.fastify.all<GetProfileAnalyticsRequest>('/analytics/profile', Auth.ValidateWithData, this.GetProfileAnalytics.bind(this));
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
        reply.code(StatusCodes.NOT_FOUND);
        return ReplyUtils.error("The link was not found.");
      }

      let link = await this.linkService.getLink(id);
      const profileId = link.profileId;
      const profile = await this.profileService.getMetadata(profileId);

      if (!profile.metadata.privacyMode && profile.visibility !== "unpublished") {
        await this.analyticsService.createLinkVisit(id);
      }

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
   * Route for /analytics/profile/:id
   *
   * Records analytics on that specific profile once called.
   *
   * @param request
   * @param reply
   * @constructor
   */
  async ProfileAnalytics(request: FastifyRequest<ProfileAnalyticsRequest>, reply: FastifyReply) {
    try {
      let params = request.params;
      let id = params.id;

      if (!id) {
        reply.code(StatusCodes.NOT_FOUND);
        return ReplyUtils.error("The profile was not found.");
      }

      const profile: { visibility: DbProfile["visibility"]; metadata: DbProfile["metadata"] } = await this.profileService.getMetadata(id);

      if (!profile.metadata.privacyMode && profile.visibility !== "unpublished") {
        await this.analyticsService.createProfileVisit(id);
      }

      reply.code(StatusCodes.OK).send();
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
      if (!request.body.authProfile) {
        reply.status(StatusCodes.BAD_REQUEST).send(ReplyUtils.error("This account doesn't have an active profile."));
        return;
      }

      // TODO Grab dateRange/dayRange and pass it in for time specific analytics

      return await this.analyticsService.getProfileAnalyticsData(request.body.authProfile.id);
    } catch (e) {
      if (e instanceof HttpError) {
        reply.code(e.statusCode);
        return ReplyUtils.error(e.message, e);
      }

      throw e;
    }
  }
}
