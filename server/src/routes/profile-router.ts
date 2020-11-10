import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import {UserManager} from "../server/user-manager";
import {DatabaseManager} from "../server/database-manager";
import {Pool} from "pg";
import {AuthUtils} from "../utils/auth-utils";

/**
 * The analytics router maps and provides for all the routes under /profile.
 */
export class ProfileRouter implements IRouter {
  private readonly userManager: UserManager;

  private fastify: FastifyInstance;
  private databaseManager: DatabaseManager;
  private pool: Pool;

  constructor(fastify: FastifyInstance, databaseManager: DatabaseManager) {
    this.fastify = fastify;
    this.databaseManager = databaseManager;
    this.pool = databaseManager.pool;
    this.userManager = new UserManager(databaseManager);
  }

  registerRoutes(): void {

    // Unauthenticated routes

    this.fastify.all('/profile/fetch/:handle', this.FetchProfile);
    this.fastify.all('/profile/thumbnail/:handle', this.ProfileThumbnailHandle);

    // Authenticated

    this.fastify.all('/profile/fetch-preview/', AuthUtils.AuthedRouteOpts, this.FetchProfilePreview);
    this.fastify.all('/profile/fetch-preview/:handle', AuthUtils.AuthedRouteOpts, this.FetchProfilePreview);

    this.fastify.post('/profile/create/', AuthUtils.AuthedRouteOpts, this.CreateProfile);
    this.fastify.post('/profile/activate-theme', AuthUtils.AuthedRouteOpts, this.ActivateProfileTheme);
    this.fastify.post('/profile/update', AuthUtils.AuthedRouteOpts, this.UpdateProfile);
    this.fastify.post('/profile/links', AuthUtils.AuthedRouteOpts, this.ListProfileLinks);
    this.fastify.post('/profile/list', AuthUtils.AuthedRouteOpts, this.ListProfiles);
    this.fastify.post('/profile/destroy', AuthUtils.AuthedRouteOpts, this.DestroyProfile);

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
