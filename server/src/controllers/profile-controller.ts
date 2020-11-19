import {FastifyInstance, FastifyReply, FastifyRequest, RequestGenericInterface, RouteHandlerMethod} from "fastify";
import {DatabaseManager} from "../data/database-manager";
import {Auth, AuthenticatedRequest} from "../utils/auth";
import {ProfileService} from "../services/profile-service";
import {constants as HttpStatus} from "http2";
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

interface CreateProfileRequest extends RequestGenericInterface {
  Body: {
    handle: string,
    imageUrl: string,
    headline: string,
    subtitle: string
  }
}

interface ActiveProfileThemeRequest extends RequestGenericInterface {
  Body: {
    theme: string
  }
}

interface UpdateProfileRequest extends RequestGenericInterface {
  Body: {
    imageUrl: string,
    headline: string,
    subtitle: string,
    handle: string,
    visibility: string,
    customCss: string,
    customHtml: string,
    customDomain: string
  }
}

/**
 * This controller maps and provides for all the controllers under /profile.
 */
export class ProfileController extends Controller {
  private profileService: ProfileService;
  private linkService: LinkService;
  private accountService: UserService;
  private themeService: ThemeService;

  constructor(fastify: FastifyInstance, databaseManager: DatabaseManager) {
    super(fastify, databaseManager);

    this.profileService = new ProfileService(databaseManager);
    this.linkService = new LinkService(databaseManager);
    this.accountService = new UserService(databaseManager);
    this.themeService = new ThemeService(databaseManager);
  }

  registerRoutes(): void {
    // Unauthenticated controllers

    this.fastify.all('/profile', this.GetProfile.bind(this));
    this.fastify.all('/profile/:handle', this.GetProfile.bind(this));
    this.fastify.all('/profile/thumbnail/:handle', this.GetProfileThumbnail.bind(this));

    // Authenticated

    this.fastify.all('/profile/preview', Auth.AuthRouteOptions, <RouteHandlerMethod>this.GetProfilePreview.bind(this));
    this.fastify.all('/profile/preview/:handle', Auth.AuthRouteOptions, <RouteHandlerMethod>this.GetProfilePreview.bind(this));

    this.fastify.post('/profiles', Auth.AuthRouteOptions, <RouteHandlerMethod>this.ListProfiles.bind(this));
    this.fastify.post('/profile/create', Auth.AuthRouteOptions, <RouteHandlerMethod>this.CreateProfile.bind(this));
    this.fastify.post('/profile/activate-theme', Auth.AuthRouteOptions, <RouteHandlerMethod>this.ActivateProfileTheme.bind(this));
    this.fastify.post('/profile/update', Auth.AuthRouteOptions, <RouteHandlerMethod>this.UpdateProfile.bind(this));
    this.fastify.post('/profile/links', Auth.AuthRouteOptions, <RouteHandlerMethod>this.ListProfileLinks.bind(this));
    this.fastify.post('/profile/destroy', Auth.AuthRouteOptions, <RouteHandlerMethod>this.DestroyProfile.bind(this));
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
        reply.status(HttpStatus.HTTP_STATUS_BAD_REQUEST).send(ReplyUtils.error("No handle was provided."));
        return;
      }

      let profile = await this.profileService.getProfileByHandle(params.handle);
      let links;
      let user;
      let theme;

      try {
        links = await this.linkService.listLinks(profile.id);
      } catch (err) {
        // ignore, we don't care why these properties don't exist
      }

      try {
        user = await this.accountService.getUser(profile.userId);
      } catch (err) {
        // ignore, we don't care why these properties don't exist
      }

      try {
        theme = await this.themeService.getTheme(profile.themeId);
      } catch (err) {
        // ignore, we don't care why these properties don't exist
      }

      return {
        profile: profile,
        links: links,
        user: user,
        theme: theme
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
        reply.status(HttpStatus.HTTP_STATUS_BAD_REQUEST).send(ReplyUtils.error("No handle was provided."));
        return;
      }

      let thumbnail = await this.profileService.getThumbnailByHandle(params.handle);

      reply.code(HttpStatus.HTTP_STATUS_OK).headers({
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
   * Route for /profiles
   *
   * @param request
   * @param reply
   */
  async ListProfiles(request: AuthenticatedRequest, reply: FastifyReply) {
    try {
      if (!request.profile) {
        reply.status(HttpStatus.HTTP_STATUS_BAD_REQUEST).send(ReplyUtils.error("This account doesn't have an active profile."));
        return;
      }

      return await this.profileService.listProfiles(request.user.id);
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
  async CreateProfile(request: AuthenticatedRequest<CreateProfileRequest>, reply: FastifyReply) {
    try {
      let body = request.body;

      return await this.profileService.createProfile(body.handle, request.user.id, body.imageUrl, body.headline, body.subtitle);
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
   * /profile/preview/:handle
   *
   * @param request
   * @param reply
   */
  async GetProfilePreview(request: AuthenticatedRequest, reply: FastifyReply) {
    try {
      if (!request.profile) {
        reply.status(HttpStatus.HTTP_STATUS_BAD_REQUEST).send(ReplyUtils.error("This account doesn't have an active profile."));
        return;
      }

      let user = request.user;
      let profile = request.profile;
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
        links: links,
        user,
        theme: theme
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
   * Route for /profile/activate-theme
   *
   * @param request
   * @param reply
   */
  async ActivateProfileTheme(request: AuthenticatedRequest<ActiveProfileThemeRequest>, reply: FastifyReply) {
    try {
      if (!request.profile) {
        reply.status(HttpStatus.HTTP_STATUS_BAD_REQUEST).send(ReplyUtils.error("This account doesn't have an active profile."));
        return;
      }

      let body = request.body;

      return await this.profileService.setActiveTheme(request.profile.id, body.theme);
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
  async UpdateProfile(request: AuthenticatedRequest<UpdateProfileRequest>, reply: FastifyReply) {
    try {
      if (!request.profile) {
        reply.status(HttpStatus.HTTP_STATUS_BAD_REQUEST).send(ReplyUtils.error("This account doesn't have an active profile."));
        return;
      }

      let body = request.body;

      return await this.profileService.updateProfile(
        request.profile.id,
        body.imageUrl,
        body.headline,
        body.subtitle,
        body.handle,
        body.visibility,
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
   * Route for /profile/links
   *
   * @param request
   * @param reply
   */
  async ListProfileLinks(request: AuthenticatedRequest, reply: FastifyReply) {
    try {
      if (!request.profile) {
        reply.status(HttpStatus.HTTP_STATUS_BAD_REQUEST).send(ReplyUtils.error("This account doesn't have an active profile."));
        return;
      }

      return await this.linkService.listLinks(request.profile.id);
    } catch (e) {
      if (e instanceof HttpError) {
        reply.code(e.statusCode);
        return ReplyUtils.error(e.message, e);
      }

      throw e;
    }
  }

  /**
   * Route for /profile/destroy
   *
   * @param request
   * @param reply
   */
  async DestroyProfile(request: AuthenticatedRequest, reply: FastifyReply) {
    try {
      if (!request.profile) {
        reply.status(HttpStatus.HTTP_STATUS_BAD_REQUEST).send(ReplyUtils.error("This account doesn't have an active profile."));
        return;
      }

      return await this.profileService.destroyProfile(request.user.id, request.profile.id);
    } catch (e) {
      if (e instanceof HttpError) {
        reply.code(e.statusCode);
        return ReplyUtils.error(e.message, e);
      }

      throw e;
    }
  }
}
