import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import {UserService} from "../services/user-service";
import {DatabaseManager} from "../data/database-manager";
import {Pool} from "pg";
import {AuthUtils} from "../utils/auth-utils";
import {LinkService} from "../services/link-service";
import {ProfileService} from "../services/profile-service";

/**
 * This controller maps and provides for all the controllers under /profile.
 */
export class ProfileController implements IController {
  private readonly userManager: UserService;

  private fastify: FastifyInstance;
  private databaseManager: DatabaseManager;
  private pool: Pool;
  private profileService: ProfileService;

  constructor(fastify: FastifyInstance, databaseManager: DatabaseManager) {
    this.fastify = fastify;
    this.databaseManager = databaseManager;
    this.pool = databaseManager.pool;
    this.userManager = new UserService(databaseManager);
    this.profileService = new ProfileService(databaseManager);
  }

  registerRoutes(): void {

    // Unauthenticated controllers

    this.fastify.all('/profile/fetch/:handle', this.FetchProfile.bind(this));
    this.fastify.all('/profile/thumbnail/:handle', this.ProfileThumbnailHandle.bind(this));

    // Authenticated

    this.fastify.all('/profile/fetch-preview/', AuthUtils.AuthedRouteOpts, this.FetchProfilePreview.bind(this));
    this.fastify.all('/profile/fetch-preview/:handle', AuthUtils.AuthedRouteOpts, this.FetchProfilePreview.bind(this));

    this.fastify.post('/profile/create/', AuthUtils.AuthedRouteOpts, this.CreateProfile.bind(this));
    this.fastify.post('/profile/activate-theme', AuthUtils.AuthedRouteOpts, this.ActivateProfileTheme.bind(this));
    this.fastify.post('/profile/update', AuthUtils.AuthedRouteOpts, this.UpdateProfile.bind(this));
    this.fastify.post('/profile/links', AuthUtils.AuthedRouteOpts, this.ListProfileLinks.bind(this));
    this.fastify.post('/profile/list', AuthUtils.AuthedRouteOpts, this.ListProfiles.bind(this));
    this.fastify.post('/profile/destroy', AuthUtils.AuthedRouteOpts, this.DestroyProfile.bind(this));

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

  }

  /**
   * Route for /profile/thumbnail/:handle
   *
   *
   *
   * @param request
   * @param reply
   */
  async ProfileThumbnailHandle(request: FastifyRequest, reply: FastifyReply) {

  }

  /**
   * Route for /profile/create/
   * @param request
   * @param reply
   */
  async CreateProfile(request: FastifyRequest, reply: FastifyReply) {

  }

  /**
   * Route for /profile/fetch-preview/
   * /profile/fetch-preview/:handle
   *
   *
   * @param request
   * @param reply
   */
  async FetchProfilePreview(request: FastifyRequest, reply: FastifyReply) {

  }


  /**
   * Route for /profile/activate-theme
   * @param request
   * @param reply
   */
  async ActivateProfileTheme(request: FastifyRequest, reply: FastifyReply) {

  }

  /**
   * Route for /profile/update
   * @param request
   * @param reply
   */
  async UpdateProfile(request: FastifyRequest, reply: FastifyReply) {

  }

  /**
   * Route for /profile/links
   * @param request
   * @param reply
   */
  async ListProfileLinks(request: FastifyRequest, reply: FastifyReply) {

  }

  /**
   * Route for /profile/list
   * @param request
   * @param reply
   */
  async ListProfiles(request: FastifyRequest, reply: FastifyReply) {

  }

  /**
   * Route for /profile/destroy
   * @param request
   * @param reply
   */
  async DestroyProfile(request: FastifyRequest, reply: FastifyReply) {

  }
}
