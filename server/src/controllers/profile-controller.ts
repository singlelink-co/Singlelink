import {FastifyInstance, FastifyReply, FastifyRequest, preHandlerHookHandler, RequestGenericInterface} from "fastify";
import {DatabaseManager} from "../data/database-manager";
import {Auth, AuthenticatedRequest} from "../utils/auth";
import {ProfileService} from "../services/profile-service";
import {StatusCodes} from "http-status-codes";
import {ReplyUtils} from "../utils/reply-utils";
import {LinkService} from "../services/link-service";
import {UserService} from "../services/user-service";
import {ThemeService} from "../services/theme-service";
import {Controller} from "./controller";
import {HttpError} from "../utils/http-error";
import Mixpanel from "mixpanel";
import {config} from "../config/config";

interface ProfileHandleRequest extends RequestGenericInterface {
  Params: {
    handle?: string
  }
}

interface CreateProfileRequest extends AuthenticatedRequest {
  Body: {
    handle: string,
    imageUrl: string,
    headline: string,
    subtitle: string
  } & AuthenticatedRequest["Body"]
}

interface ActivateProfileThemeRequest extends AuthenticatedRequest {
  Body: {
    id: string
  } & AuthenticatedRequest["Body"]
}

interface UpdateProfileRequest extends AuthenticatedRequest {
  Body: {
    imageUrl: string,
    headline: string,
    subtitle: string,
    handle: string,
    visibility: string,
    showWatermark: boolean,
    customCss: string,
    customHtml: string,
    customDomain: string
  } & AuthenticatedRequest["Body"]
}

interface SetPrivacyModeRequest extends AuthenticatedRequest {
  Body: {
    privacyMode: boolean
  } & AuthenticatedRequest["Body"]
}

const createProfileRequestOpts = {
  config: {
    rateLimit: {
      max: 10,
      timeWindow: '5 minutes'
    }
  },
  preHandler: <preHandlerHookHandler>Auth.validateAuthWithData
};

/**
 * This controller maps and provides for all the controllers under /profile.
 */
export class ProfileController extends Controller {
  private readonly linkService: LinkService;
  private readonly profileService: ProfileService;
  private readonly userService: UserService;
  private readonly themeService: ThemeService;
  private readonly mixpanel = config.analytics.mixpanelToken ? Mixpanel.init(config.analytics.mixpanelToken) : null;

  constructor(fastify: FastifyInstance, databaseManager: DatabaseManager) {
    super(fastify, databaseManager);

    this.profileService = new ProfileService(databaseManager);
    this.linkService = new LinkService(databaseManager);
    this.userService = new UserService(databaseManager);
    this.themeService = new ThemeService(databaseManager);
  }

  registerRoutes(): void {
    // Unauthenticated controllers
    this.fastify.all<ProfileHandleRequest>('/profile/:handle', this.GetProfile.bind(this));
    this.fastify.all<ProfileHandleRequest>('/profile/thumbnail/:handle', this.GetProfileThumbnail.bind(this));

    // Authenticated
    this.fastify.all<AuthenticatedRequest>('/profile/preview', Auth.ValidateWithData, this.GetProfilePreview.bind(this));
    this.fastify.post<AuthenticatedRequest>('/profiles', Auth.ValidateWithData, this.ListProfiles.bind(this));
    this.fastify.post<AuthenticatedRequest>('/profile/links', Auth.ValidateWithData, this.ListProfileLinks.bind(this));

    this.fastify.post<CreateProfileRequest>('/profile/create', createProfileRequestOpts, this.CreateProfile.bind(this));
    this.fastify.post<UpdateProfileRequest>('/profile/update', Auth.ValidateWithData, this.UpdateProfile.bind(this));
    this.fastify.post<AuthenticatedRequest>('/profile/delete', Auth.ValidateWithData, this.DeleteProfile.bind(this));

    this.fastify.post<AuthenticatedRequest>('/profile/active-profile', Auth.ValidateWithData, this.GetActiveProfile.bind(this));
    this.fastify.post<ActivateProfileThemeRequest>('/profile/activate-theme', Auth.ValidateWithData, this.ActivateProfileTheme.bind(this));

    this.fastify.post<SetPrivacyModeRequest>('/profile/set-privacy-mode', Auth.ValidateWithData, this.SetPrivacyMode.bind(this));
  }

  /**
   * Route for /profile
   * /profile/:handle
   *
   * Fetches a user's profile.
   *
   * @param request
   * @param reply
   */
  async GetProfile(request: FastifyRequest<ProfileHandleRequest>, reply: FastifyReply) {
    try {
      let params = request.params;

      if (!params.handle) {
        reply.status(StatusCodes.BAD_REQUEST).send(ReplyUtils.error("No handle was provided."));
        return;
      }

      let profile = await this.profileService.getProfileByHandle(params.handle, true);
      let links;
      let user;
      let theme;

      try {
        links = await this.linkService.listLinks(profile.id);
      } catch (err) {
        // ignore, we don't care why these properties don't exist
      }

      try {
        user = await this.userService.getUser(profile.userId);
      } catch (err) {
        // ignore, we don't care why these properties don't exist
      }

      try {
        theme = await this.themeService.getTheme(profile.themeId);
      } catch (err) {
        // ignore, we don't care why these properties don't exist
      }

      return {
        profile,
        links,
        user,
        theme
      };
    } catch (e) {
      if (e instanceof HttpError) {
        reply.code(e.statusCode);
        return ReplyUtils.error(e.message, e);
      }

      throw e;
    }
  }

  /**
   * Route for /profile/thumbnail/:handle
   *
   * @param request
   * @param reply
   */
  async GetProfileThumbnail(request: FastifyRequest<ProfileHandleRequest>, reply: FastifyReply) {
    try {
      let params = request.params;

      if (!params.handle) {
        reply.status(StatusCodes.BAD_REQUEST).send(ReplyUtils.error("No handle was provided."));
        return;
      }

      let thumbnail = await this.profileService.getThumbnailByHandle(params.handle);

      reply.code(StatusCodes.OK).headers({
        "Content-Type": "image/png",
        "Content-Length": thumbnail.data.byteLength
      });

      reply.send(thumbnail.data);
      return;
    } catch (e) {
      if (e instanceof HttpError) {
        reply.code(e.statusCode);
        return ReplyUtils.error(e.message, e);
      }

      throw e;
    }
  }

  /**
   * Route for /profile/preview
   *
   * @param request
   * @param reply
   */
  async GetProfilePreview(request: FastifyRequest<AuthenticatedRequest>, reply: FastifyReply) {
    try {
      if (!request.body.authProfile) {
        reply.status(StatusCodes.BAD_REQUEST).send(ReplyUtils.error("This account doesn't have an active profile."));
        return;
      }

      let user = request.body.authUser;
      let profile = request.body.authProfile;
      let profiles = await this.profileService.listProfiles(user.id);
      let links;
      let theme;

      try {
        links = await this.linkService.listLinks(profile.id);
      } catch (err) {
        // ignore, we don't care why these properties don't exist
      }

      try {
        theme = await this.themeService.getTheme(profile.themeId);
      } catch (err) {
        // ignore, we don't care why these properties don't exist
      }

      return {
        profile,
        profiles,
        links,
        user,
        theme
      };
    } catch (e) {
      if (e instanceof HttpError) {
        reply.code(e.statusCode);
        return ReplyUtils.error(e.message, e);
      }

      throw e;
    }
  }

  /**
   * Route for /profiles
   *
   * @param request
   * @param reply
   */
  async ListProfiles(request: FastifyRequest<AuthenticatedRequest>, reply: FastifyReply) {
    try {
      if (!request.body.authProfile) {
        reply.status(StatusCodes.BAD_REQUEST).send(ReplyUtils.error("This account doesn't have an active profile."));
        return;
      }

      return this.profileService.listProfiles(request.body.authUser.id);
    } catch (e) {
      if (e instanceof HttpError) {
        reply.code(e.statusCode);
        return ReplyUtils.error(e.message, e);
      }

      throw e;
    }
  }

  /**
   * Route for /profile/links
   *
   * @param request
   * @param reply
   */
  async ListProfileLinks(request: FastifyRequest<AuthenticatedRequest>, reply: FastifyReply) {
    try {
      if (!request.body.authProfile) {
        reply.status(StatusCodes.BAD_REQUEST).send(ReplyUtils.error("This account doesn't have an active profile."));
        return;
      }

      return this.linkService.listLinks(request.body.authProfile.id);
    } catch (e) {
      if (e instanceof HttpError) {
        reply.code(e.statusCode);
        return ReplyUtils.error(e.message, e);
      }

      throw e;
    }
  }

  /**
   * Route for /profile/create/
   *
   * @param request
   * @param reply
   */
  async CreateProfile(request: FastifyRequest<CreateProfileRequest>, reply: FastifyReply) {
    try {
      let body = request.body;

      if (this.mixpanel)
        this.mixpanel.track('new profile created', {
          distinct_id: body.authUser.id,
          profile: body.authProfile.id,
          handle: body.handle,
          imageUrl: body.imageUrl,
          headline: body.headline,
          subtitle: body.subtitle
        });

      return this.profileService.createProfile(body.authUser.id, body.handle, body.imageUrl, body.headline, body.subtitle);
    } catch (e) {
      if (e instanceof HttpError) {
        reply.code(e.statusCode);
        return ReplyUtils.error(e.message, e);
      }

      throw e;
    }
  }

  /**
   * Route for /profile/update
   *
   * @param request
   * @param reply
   */
  async UpdateProfile(request: FastifyRequest<UpdateProfileRequest>, reply: FastifyReply) {
    try {
      let body = request.body;

      if (!body.authProfile) {
        reply.status(StatusCodes.BAD_REQUEST).send(ReplyUtils.error("This account doesn't have an active profile."));
        return;
      }

      if (this.mixpanel)
        this.mixpanel.track('profile updated', {
          distinct_id: body.authUser.id,
          profile: body.authProfile.id,
          imageUrl: body.imageUrl,
          handle: body.handle,
          headline: body.headline,
          subtitle: body.subtitle,
          visibility: body.visibility,
          showWatermark: body.showWatermark,
          customDomain: body.customDomain
        });

      return this.profileService.updateProfile(
        body.authProfile.id,
        body.imageUrl,
        body.headline,
        body.subtitle,
        body.handle,
        body.visibility,
        body.showWatermark,
        body.customCss,
        body.customHtml,
        body.customDomain
      );
    } catch (e) {
      if (e instanceof HttpError) {
        reply.code(e.statusCode);
        return ReplyUtils.error(e.message, e);
      }

      throw e;
    }
  }

  /**
   * Route for /profile/delete
   *
   * @param request
   * @param reply
   */
  async DeleteProfile(request: FastifyRequest<AuthenticatedRequest>, reply: FastifyReply) {
    try {
      if (!request.body.authProfile) {
        reply.status(StatusCodes.BAD_REQUEST).send(ReplyUtils.error("This account doesn't have an active profile."));
        return;
      }

      if (this.mixpanel)
        this.mixpanel.track('profile deleted', {
          distinct_id: request.body.authUser.id,
          profile: request.body.authProfile.id,
          handle: request.body.authProfile.handle,
          headline: request.body.authProfile.headline,
          subtitle: request.body.authProfile.subtitle,
          visibility: request.body.authProfile.visibility,
          showWatermark: request.body.authProfile.showWatermark,
        });

      return this.profileService.deleteProfile(request.body.authUser.id, request.body.authProfile.id);
    } catch (e) {
      if (e instanceof HttpError) {
        reply.code(e.statusCode);
        return ReplyUtils.error(e.message, e);
      }

      throw e;
    }
  }

  /**
   * Route for /profile/active-profile
   *
   * @param request
   * @param reply
   */
  async GetActiveProfile(request: FastifyRequest<AuthenticatedRequest>, reply: FastifyReply) {
    try {
      if (!request.body.authProfile) {
        reply.status(StatusCodes.BAD_REQUEST).send(ReplyUtils.error("This account doesn't have an active profile."));
        return;
      }

      return request.body.authProfile;
    } catch (e) {
      if (e instanceof HttpError) {
        reply.code(e.statusCode);
        return ReplyUtils.error(e.message, e);
      }

      throw e;
    }
  }

  /**
   * Route for /profile/activate-theme
   *
   * @param request
   * @param reply
   */
  async ActivateProfileTheme(request: FastifyRequest<ActivateProfileThemeRequest>, reply: FastifyReply) {
    try {
      let body = request.body;

      if (!body.authProfile) {
        reply.status(StatusCodes.BAD_REQUEST).send(ReplyUtils.error("This account doesn't have an active profile."));
        return;
      }

      if (body.id) {
        if (!await Auth.checkThemeOwnership(this.linkService, body.id, body.authUser, true)) {
          return ReplyUtils.errorOnly(new HttpError(StatusCodes.UNAUTHORIZED, "The profile isn't authorized to access the requested resource"));
        }
      }

      if (this.mixpanel)
        this.mixpanel.track('set profile active theme', {
          distinct_id: request.body.authUser.id,
          profile: request.body.authProfile.id,
          theme: body.id
        });

      return this.profileService.setActiveTheme(body.authProfile.id, body.id);
    } catch (e) {
      if (e instanceof HttpError) {
        reply.code(e.statusCode);
        return ReplyUtils.error(e.message, e);
      }

      throw e;
    }
  }

  /**
   * Route for /profile/set-privacy-mode
   *
   * @param request
   * @param reply
   */
  async SetPrivacyMode(request: FastifyRequest<SetPrivacyModeRequest>, reply: FastifyReply) {
    try {
      if (!request.body.authProfile) {
        reply.status(StatusCodes.BAD_REQUEST).send(ReplyUtils.error("This account doesn't have an active profile."));
        return;
      }

      let previousPrivacyMode = request.body.authProfile.metadata?.privacyMode;

      if (previousPrivacyMode !== request.body.privacyMode) {

        if (this.mixpanel)
          this.mixpanel.track('toggle privacy mode', {
            distinct_id: request.body.authUser.id,
            profile: request.body.authProfile.id,
            privacyMode: request.body.privacyMode
          });

        return this.profileService.setPrivacyMode(request.body.authProfile.id, request.body.privacyMode);
      }

      reply.status(StatusCodes.ACCEPTED).send();
    } catch (e) {
      if (e instanceof HttpError) {
        reply.code(e.statusCode);
        return ReplyUtils.error(e.message, e);
      }

      throw e;
    }
  }

}
