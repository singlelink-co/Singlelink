import {FastifyInstance, FastifyReply, FastifyRequest, RouteHandlerMethod} from "fastify";
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

    this.fastify.all('/profile/fetch/:handle', this.FetchProfile.bind(this));
    this.fastify.all('/profile/thumbnail/:handle', this.ProfileThumbnailHandle.bind(this));

    // Authenticated

    this.fastify.all('/profile/fetch-preview', Auth.AuthedRouteOpts, <RouteHandlerMethod>this.FetchProfilePreview.bind(this));
    this.fastify.all('/profile/fetch-preview/:handle', Auth.AuthedRouteOpts, <RouteHandlerMethod>this.FetchProfilePreview.bind(this));

    this.fastify.post('/profile/create', Auth.AuthedRouteOpts, <RouteHandlerMethod>this.CreateProfile.bind(this));
    this.fastify.post('/profile/activate-theme', Auth.AuthedRouteOpts, <RouteHandlerMethod>this.ActivateProfileTheme.bind(this));
    this.fastify.post('/profile/update', Auth.AuthedRouteOpts, <RouteHandlerMethod>this.UpdateProfile.bind(this));
    this.fastify.post('/profile/links', Auth.AuthedRouteOpts, <RouteHandlerMethod>this.ListProfileLinks.bind(this));
    this.fastify.post('/profile/list', Auth.AuthedRouteOpts, <RouteHandlerMethod>this.ListProfiles.bind(this));
    this.fastify.post('/profile/destroy', Auth.AuthedRouteOpts, <RouteHandlerMethod>this.DestroyProfile.bind(this));
  }

  /**
   * Route for /profile/fetch
   * /profile/fetch/:handle
   *
   * Fetches a user's profile.
   *
   * @param request
   * @param reply
   */
  async FetchProfile(request: FastifyRequest, reply: FastifyReply) {
    let params: any = request.params;

    if (!params.handle) {
      return reply.status(HttpStatus.HTTP_STATUS_BAD_REQUEST).send(ReplyUtils.error("No handle was provided."));
    }

    let profile = await this.profileService.getProfile(params.handle);

    if (profile instanceof HttpError) {
      let error: HttpError = profile;
      reply.code(error.statusCode);

      return ReplyUtils.error(error.message, error);
    }

    let links = await this.linkService.listLinks(profile.id);
    let user = await this.accountService.getUser(profile.userId);
    let theme = await this.themeService.getTheme(profile.themeId);

    return {
      profile: profile,
      links: links instanceof HttpError ? null : links,
      user: user instanceof HttpError ? null : user,
      theme: theme instanceof HttpError ? null : theme
    };
  }

  /**
   * Route for /profile/thumbnail/:handle
   *
   * @param request
   * @param reply
   */
  async ProfileThumbnailHandle(request: FastifyRequest, reply: FastifyReply) {
    let params: any = request.params;

    if (!params.handle) {
      return reply.status(HttpStatus.HTTP_STATUS_BAD_REQUEST).send(ReplyUtils.error("No handle was provided."));
    }

    let thumbnail = await this.profileService.getThumbnail(params.handle);

    if (thumbnail instanceof HttpError) {
      let error: HttpError = thumbnail;
      reply.code(error.statusCode);

      return ReplyUtils.error(error.message, error);
    }

    reply.code(HttpStatus.HTTP_STATUS_OK).headers({
      "Content-Type": "image/png",
      "Content-Length": thumbnail.data.byteLength
    });

    return reply.send(thumbnail.data);
  }

  /**
   * Route for /profile/create/
   *
   * @param request
   * @param reply
   */
  async CreateProfile(request: AuthenticatedRequest, reply: FastifyReply) {
    let json: any = request.body;

    if (!json.handle) {
      json.handle = Math.random().toString(36).substring(2, 6) + Math.random().toString(36).substring(2, 6);
    }

    let profile = await this.profileService.createProfile(json.handle, request.user.id, json.imageUrl, json.headline, json.subtitle);

    if (profile instanceof HttpError) {
      let error: HttpError = profile;
      reply.code(error.statusCode);

      return ReplyUtils.error(error.message, error);
    }

    return profile;
  }

  /**
   * Route for /profile/fetch-preview/
   * /profile/fetch-preview/:handle
   *
   * @param request
   * @param reply
   */
  async FetchProfilePreview(request: AuthenticatedRequest, reply: FastifyReply) {
    if (!request.profile) {
      return reply.status(HttpStatus.HTTP_STATUS_BAD_REQUEST).send(ReplyUtils.error("This account doesn't have an active profile."));
    }

    let user = request.user;
    let profile = request.profile;

    let profiles = await this.profileService.listProfiles(user.id);

    if (profiles instanceof HttpError) {
      let error: HttpError = profiles;
      reply.code(error.statusCode);

      return ReplyUtils.error(error.message, error);
    }

    let links = await this.linkService.listLinks(profile.id);
    let theme = await this.themeService.getTheme(profile.themeId);

    return {
      profile,
      profiles,
      links: links instanceof HttpError ? null : links,
      user,
      theme: theme instanceof HttpError ? null : theme
    };
  }


  /**
   * Route for /profile/activate-theme
   *
   * @param request
   * @param reply
   */
  async ActivateProfileTheme(request: AuthenticatedRequest, reply: FastifyReply) {
    if (!request.profile) {
      return reply.status(HttpStatus.HTTP_STATUS_BAD_REQUEST).send(ReplyUtils.error("This account doesn't have an active profile."));
    }

    let json: any = request.body;

    let profile = await this.profileService.setActiveTheme(request.profile.id, json.theme);

    if (profile instanceof HttpError) {
      let error: HttpError = profile;
      reply.code(error.statusCode);

      return ReplyUtils.error(error.message, error);
    }

    return profile;
  }

  /**
   * Route for /profile/update
   *
   * @param request
   * @param reply
   */
  async UpdateProfile(request: AuthenticatedRequest, reply: FastifyReply) {
    if (!request.profile) {
      return reply.status(HttpStatus.HTTP_STATUS_BAD_REQUEST).send(ReplyUtils.error("This account doesn't have an active profile."));
    }

    let json: any = request.body;

    let profile = await this.profileService.updateProfile(
      request.profile.id,
      json.imageUrl,
      json.headline,
      json.subtitle,
      json.handle,
      json.visibility,
      json.customCss,
      json.customHtml,
      json.customDomain
    );

    if (profile instanceof HttpError) {
      let error: HttpError = profile;
      reply.code(error.statusCode);

      return ReplyUtils.error(error.message, error);
    }

    return profile;
  }

  /**
   * Route for /profile/links
   *
   * @param request
   * @param reply
   */
  async ListProfileLinks(request: AuthenticatedRequest, reply: FastifyReply) {
    if (!request.profile) {
      return reply.status(HttpStatus.HTTP_STATUS_BAD_REQUEST).send(ReplyUtils.error("This account doesn't have an active profile."));
    }

    let links = await this.linkService.listLinks(request.profile.id);

    if (links instanceof HttpError) {
      let error: HttpError = links;
      reply.code(error.statusCode);

      return ReplyUtils.error(error.message, error);
    }

    return links;
  }

  /**
   * Route for /profile/list
   *
   * @param request
   * @param reply
   */
  async ListProfiles(request: AuthenticatedRequest, reply: FastifyReply) {
    if (!request.profile) {
      return reply.status(HttpStatus.HTTP_STATUS_BAD_REQUEST).send(ReplyUtils.error("This account doesn't have an active profile."));
    }

    let profiles = await this.profileService.listProfiles(request.user.id);

    if (profiles instanceof HttpError) {
      let error: HttpError = profiles;
      reply.code(error.statusCode);

      return ReplyUtils.error(error.message, error);
    }

    return profiles;
  }

  /**
   * Route for /profile/destroy
   *
   * @param request
   * @param reply
   */
  async DestroyProfile(request: AuthenticatedRequest, reply: FastifyReply) {
    if (!request.profile) {
      return reply.status(HttpStatus.HTTP_STATUS_BAD_REQUEST).send(ReplyUtils.error("This account doesn't have an active profile."));
    }

    let nextProfile = await this.profileService.destroyProfile(request.user.id, request.profile.id);

    if (nextProfile instanceof HttpError) {
      let error: HttpError = nextProfile;
      reply.code(error.statusCode);

      return ReplyUtils.error(error.message, error);
    }

    return nextProfile;
  }
}
