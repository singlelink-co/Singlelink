import {FastifyInstance, FastifyReply, FastifyRequest, preHandlerHookHandler, RequestGenericInterface} from "fastify";
import {DatabaseManager} from "../data/database-manager";
import {AuthenticatedRequest, AuthOpts} from "../utils/auth";
import {ProfileService} from "../services/profile-service";
import {StatusCodes} from "http-status-codes";
import {ReplyUtils} from "../utils/reply-utils";
import {LinkService} from "../services/link-service";
import {UserService} from "../services/user-service";
import {ThemeService} from "../services/theme-service";
import {Controller} from "./controller";
import {HttpError} from "../utils/http-error";

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
    theme: string
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

const createProfileRequestOpts = {
  config: {
    rateLimit: {
      max: 10,
      timeWindow: '5 minutes'
    }
  },
  preHandler: <preHandlerHookHandler>AuthOpts.validateAuthWithData
};

/**
 * This controller maps and provides for all the controllers under /profile.
 */
export class ProfileController extends Controller {
  private profileService: ProfileService;
  private linkService: LinkService;
  private userService: UserService;
  private themeService: ThemeService;

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
    this.fastify.all<AuthenticatedRequest>('/profile/preview', AuthOpts.ValidateWithData, this.GetProfilePreview.bind(this));
    this.fastify.post<AuthenticatedRequest>('/profiles', AuthOpts.ValidateWithData, this.ListProfiles.bind(this));
    this.fastify.post<AuthenticatedRequest>('/profile/links', AuthOpts.ValidateWithData, this.ListProfileLinks.bind(this));

    this.fastify.post<CreateProfileRequest>('/profile/create', createProfileRequestOpts, this.CreateProfile.bind(this));
    this.fastify.post<UpdateProfileRequest>('/profile/update', AuthOpts.ValidateWithData, this.UpdateProfile.bind(this));
    this.fastify.post<AuthenticatedRequest>('/profile/delete', AuthOpts.ValidateWithData, this.DeleteProfile.bind(this));

    this.fastify.post<AuthenticatedRequest>('/profile/active-profile', AuthOpts.ValidateWithData, this.GetActiveProfile.bind(this));
    this.fastify.post<ActivateProfileThemeRequest>('/profile/activate-theme', AuthOpts.ValidateWithData, this.ActivateProfileTheme.bind(this));
  }

  /**
   * Route for /profile
   * /profile//:handle
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
      if (!request.body.profile) {
        reply.status(StatusCodes.BAD_REQUEST).send(ReplyUtils.error("This account doesn't have an active profile."));
        return;
      }

      let user = request.body.user;
      let profile = request.body.profile;
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
      if (!request.body.profile) {
        reply.status(StatusCodes.BAD_REQUEST).send(ReplyUtils.error("This account doesn't have an active profile."));
        return;
      }

      return await this.profileService.listProfiles(request.body.user.id);
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
      if (!request.body.profile) {
        reply.status(StatusCodes.BAD_REQUEST).send(ReplyUtils.error("This account doesn't have an active profile."));
        return;
      }

      return await this.linkService.listLinks(request.body.profile.id);
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

      return await this.profileService.createProfile(body.user.id, body.handle, body.imageUrl, body.headline, body.subtitle);
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

      if (!body.profile) {
        reply.status(StatusCodes.BAD_REQUEST).send(ReplyUtils.error("This account doesn't have an active profile."));
        return;
      }

      return await this.profileService.updateProfile(
        body.profile.id,
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
      if (!request.body.profile) {
        reply.status(StatusCodes.BAD_REQUEST).send(ReplyUtils.error("This account doesn't have an active profile."));
        return;
      }

      return await this.profileService.deleteProfile(request.body.user.id, request.body.profile.id);
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
      if (!request.body.profile) {
        reply.status(StatusCodes.BAD_REQUEST).send(ReplyUtils.error("This account doesn't have an active profile."));
        return;
      }

      return request.body.profile;
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

      if (!body.profile) {
        reply.status(StatusCodes.BAD_REQUEST).send(ReplyUtils.error("This account doesn't have an active profile."));
        return;
      }

      return await this.profileService.setActiveTheme(body.profile.id, body.theme);
    } catch (e) {
      if (e instanceof HttpError) {
        reply.code(e.statusCode);
        return ReplyUtils.error(e.message, e);
      }

      throw e;
    }
  }
}
