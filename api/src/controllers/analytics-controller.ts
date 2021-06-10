import {FastifyInstance, FastifyReply, FastifyRequest, preHandlerHookHandler, RequestGenericInterface} from "fastify";
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
import Mixpanel from "mixpanel";
import {config} from "../config/config";
import {Constants} from "../config/constants";

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
      max: 4,
      timeWindow: '1 second'
    }
  },
  preHandler: <preHandlerHookHandler>Auth.validateAuthWithData
};

/**
 * This controller maps and provides for all the controllers under /analytics.
 */
export class AnalyticsController extends Controller {
  private readonly analyticsService: AnalyticsService;
  private readonly linkService: LinkService;
  private readonly profileService: ProfileService;
  private readonly mixpanel = config.analytics.mixpanelToken ? Mixpanel.init(config.analytics.mixpanelToken) : null;

  constructor(fastify: FastifyInstance, databaseManager: DatabaseManager) {
    super(fastify, databaseManager);

    this.analyticsService = new AnalyticsService(databaseManager);
    this.linkService = new LinkService(databaseManager);
    this.profileService = new ProfileService(databaseManager);
  }

  registerRoutes(): void {
    // Unauthenticated
    this.fastify.get('/analytics', this.GetAnalytics.bind(this));
    this.fastify.all('/analytics/link/record/:id', this.LinkAnalytics.bind(this));
    this.fastify.all('/analytics/profile/record/:id', this.ProfileAnalytics.bind(this));

    // Authenticated
    this.fastify.post<GetProfileAnalyticsRequest>('/analytics/profile', rateLimitAnalytics, this.GetProfileAnalytics.bind(this));
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
   * Route for /analytics/link/record/:id
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
      const profile = await this.profileService.getProfile(profileId);

      if (profile.visibility !== "unpublished") {
        if (!profile.metadata?.privacyMode) {
          await this.analyticsService.createVisit(id, "link");

          if (this.mixpanel)
            this.mixpanel.track('clicked profile link', {
              distinct_id: profile.userId,
              $ip: request.ip,
              profile: profileId,
              link: link.id,
              url: link.url
            });
        } else {
          await this.analyticsService.createAnonymousVisit("link");

          if (this.mixpanel)
            this.mixpanel.track('clicked profile link', {
              distinct_id: Constants.ANONYMOUS_USER_ID,
              $ip: request.ip,
              profile: profileId,
              link: link.id,
              url: link.url
            });
        }
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
   * Route for /analytics/profile/record/:id
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

      const profile = await this.profileService.getProfile(id);

      if (profile.visibility !== "unpublished") {
        if (!profile.metadata?.privacyMode) {
          await this.analyticsService.createVisit(id, "page");

          if (this.mixpanel)
            this.mixpanel.track('viewed profile', {
              distinct_id: profile.userId,
              $ip: request.ip,
              profile: profile.id,
              handle: profile.handle
            });
        } else {
          await this.analyticsService.createAnonymousVisit("page");

          if (this.mixpanel)
            this.mixpanel.track('viewed profile', {
              distinct_id: Constants.ANONYMOUS_USER_ID,
              $ip: request.ip,
              profile: profile.id,
              handle: profile.handle
            });
        }
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

      return this.analyticsService.getProfileAnalyticsData(request.body.authProfile.id);
    } catch (e) {
      if (e instanceof HttpError) {
        reply.code(e.statusCode);
        return ReplyUtils.error(e.message, e);
      }

      throw e;
    }
  }
}
