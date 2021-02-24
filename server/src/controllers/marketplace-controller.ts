import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import {DatabaseManager} from "../data/database-manager";
import {Controller} from "./controller";
import {Auth, AuthenticatedRequest} from "../utils/auth";
import {ReplyUtils} from "../utils/reply-utils";
import {HttpError} from "../utils/http-error";
import {MarketplaceService} from "../services/marketplace-service";
import {config} from "../config/config";
import Mixpanel from "mixpanel";
import {StatusCodes} from "http-status-codes";
import {UserService} from "../services/user-service";

interface MarketplaceListingRequest extends AuthenticatedRequest {
  Body: {
    ids?: string[],
    lastItemId?: number,
    limit?: number
  } & AuthenticatedRequest["Body"]
}

interface GetAddonRequest extends AuthenticatedRequest {
  Params: {
    id: string
  }
}

interface CreateAddonRequest extends AuthenticatedRequest {
  Body: {
    addon: Pick<Addon, 'userId' | 'type'> & Partial<Addon>
  } & AuthenticatedRequest["Body"]
}

interface UpdateAddonRequest extends AuthenticatedRequest {
  Body: {
    addon: Pick<Addon, 'id' | 'userId' | 'type'> & Partial<Addon>
  } & AuthenticatedRequest["Body"]
}

interface DeleteAddonRequest extends AuthenticatedRequest {
  Body: {
    id: string
  } & AuthenticatedRequest["Body"]
}

interface InstallAddonRequest extends AuthenticatedRequest {
  Params: {
    id: string
  } & AuthenticatedRequest["Body"]
}

interface UninstallAddonRequest extends AuthenticatedRequest {
  Params: {
    id: string
  } & AuthenticatedRequest["Body"]
}

interface ToggleUserFavoriteAddonRequest extends AuthenticatedRequest {
  Params: {
    id: string
  }
}

interface ListUserFavoriteAddonsRequest extends AuthenticatedRequest {
  Body: {} & AuthenticatedRequest["Body"]
}

/**
 * This controller maps and provides for all the controllers under /marketplace.
 */
export class MarketplaceController extends Controller {
  private readonly marketplaceService: MarketplaceService;
  private readonly userService: UserService;
  private readonly mixpanel = config.analytics.mixpanelToken ? Mixpanel.init(config.analytics.mixpanelToken) : null;

  constructor(fastify: FastifyInstance, databaseManager: DatabaseManager) {
    super(fastify, databaseManager);

    this.marketplaceService = new MarketplaceService(databaseManager);
    this.userService = new UserService(databaseManager);
  }

  registerRoutes(): void {
    // Authenticated
    this.fastify.all<MarketplaceListingRequest>('/marketplace/addons', Auth.ValidateWithData, this.ListAddons.bind(this));

    this.fastify.all<GetAddonRequest>('/marketplace/addon/:id', Auth.ValidateWithData, this.GetAddon.bind(this));
    this.fastify.all<CreateAddonRequest>('/marketplace/addon/create', Auth.ValidateWithData, this.CreateAddon.bind(this));
    this.fastify.all<UpdateAddonRequest>('/marketplace/addon/update', Auth.ValidateWithData, this.UpdateAddon.bind(this));
    this.fastify.all<DeleteAddonRequest>('/marketplace/addon/delete', Auth.ValidateWithData, this.DeleteAddon.bind(this));

    this.fastify.all<InstallAddonRequest>('/marketplace/addon/install/:id', Auth.ValidateWithData, this.InstallAddon.bind(this));
    this.fastify.all<UninstallAddonRequest>('/marketplace/addon/uninstall/:id', Auth.ValidateWithData, this.UninstallAddon.bind(this));

    this.fastify.all<ToggleUserFavoriteAddonRequest>('/marketplace/user/favorite/:id', Auth.ValidateWithData, this.ToggleUserFavoriteAddon.bind(this));
    this.fastify.all<ListUserFavoriteAddonsRequest>('/marketplace/user/favorites', Auth.ValidateWithData, this.ListUserFavoriteAddons.bind(this));
  }

  /**
   * Route for /marketplace/addons
   *
   * @param request
   * @param reply
   * @constructor
   */
  async ListAddons(request: FastifyRequest<MarketplaceListingRequest>, reply: FastifyReply) {
    try {
      let ids = request.body.ids;
      let lastItemId = request.body.lastItemId;
      let limit = request.body.limit;

      if (this.mixpanel) {
        if (ids) {
          this.mixpanel.track('user requested specific addons', {
            distinct_id: request.body.authUser.id,
            addons: ids
          });
        } else {
          this.mixpanel.track('user listed addons', {
            distinct_id: request.body.authUser.id,
          });
        }
      }

      if (ids) {
        return this.marketplaceService.getAddons(request.body.authUser.id, ids);
      } else {
        return this.marketplaceService.listAddons(request.body.authUser.id, lastItemId, limit);
      }
    } catch (e) {
      if (e instanceof HttpError) {
        reply.code(e.statusCode);
        return ReplyUtils.error(e.message, e);
      }

      throw e;
    }
  }

  /**
   * Route for /marketplace/addon/:id
   *
   * @param request
   * @param reply
   * @constructor
   */
  async GetAddon(request: FastifyRequest<GetAddonRequest>, reply: FastifyReply) {
    try {
      let addon = await this.marketplaceService.getAddon(request.body.authUser.id, request.params.id);

      if (this.mixpanel)
        this.mixpanel.track('addon viewed', {
          distinct_id: request.body.authUser.id,
        });

      return addon;
    } catch (e) {
      if (e instanceof HttpError) {
        reply.code(e.statusCode);
        return ReplyUtils.error(e.message, e);
      }

      throw e;
    }
  }

  /**
   * Route for /marketplace/addon/create
   *
   * @param request
   * @param reply
   * @constructor
   */
  async CreateAddon(request: FastifyRequest<CreateAddonRequest>, reply: FastifyReply) {
    try {
      let addon = request.body.addon;

      let newAddon = await this.marketplaceService.createAddon(addon);

      if (this.mixpanel)
        this.mixpanel.track('addon created', {
          distinct_id: request.body.authUser.id,
          addon: newAddon
        });

      return newAddon;
    } catch (e) {
      if (e instanceof HttpError) {
        reply.code(e.statusCode);
        return ReplyUtils.error(e.message, e);
      }

      throw e;
    }
  }

  /**
   * Route for /marketplace/addon/update
   *
   * @param request
   * @param reply
   * @constructor
   */
  async UpdateAddon(request: FastifyRequest<UpdateAddonRequest>, reply: FastifyReply) {
    try {
      let addon = request.body.addon;

      if (!(await Auth.checkAddonOwnership(this.marketplaceService, addon.id, request.body.authUser))) {
        return ReplyUtils.errorOnly(new HttpError(StatusCodes.UNAUTHORIZED, "The user isn't authorized to access the requested resource"));
      }

      let newAddon = await this.marketplaceService.updateAddon(addon);

      if (this.mixpanel)
        this.mixpanel.track('addon updated', {
          distinct_id: request.body.authUser.id,
          addon: newAddon
        });

      return newAddon;
    } catch (e) {
      if (e instanceof HttpError) {
        reply.code(e.statusCode);
        return ReplyUtils.error(e.message, e);
      }

      throw e;
    }
  }

  /**
   * Route for /marketplace/addon/delete
   *
   * @param request
   * @param reply
   * @constructor
   */
  async DeleteAddon(request: FastifyRequest<DeleteAddonRequest>, reply: FastifyReply) {
    try {
      let user = request.body.authUser;
      let addonId = request.body.id;

      if (!(await Auth.checkAddonOwnership(this.marketplaceService, addonId, user))) {
        return ReplyUtils.errorOnly(new HttpError(StatusCodes.UNAUTHORIZED, "The user isn't authorized to access the requested resource"));
      }

      let deletedAddonId = await this.marketplaceService.deleteAddon(addonId);

      if (this.mixpanel)
        this.mixpanel.track('addon deleted', {
          distinct_id: request.body.authUser.id,
          addonId: addonId
        });

      return {deletedAddon: deletedAddonId};
    } catch (e) {
      if (e instanceof HttpError) {
        reply.code(e.statusCode);
        return ReplyUtils.error(e.message, e);
      }

      throw e;
    }
  }

  /**
   * Route for /marketplace/addon/install/:id
   *
   * @param request
   * @param reply
   * @constructor
   */
  async InstallAddon(request: FastifyRequest<InstallAddonRequest>, reply: FastifyReply) {
    try {
      let user = request.body.authUser;
      let addonId = request.params.id;

      if (!(await Auth.checkAddonOwnership(this.marketplaceService, addonId, user))) {
        return ReplyUtils.errorOnly(new HttpError(StatusCodes.UNAUTHORIZED, "The user isn't authorized to access the requested resource"));
      }

      await this.marketplaceService.installAddon(addonId);

      if (this.mixpanel)
        this.mixpanel.track('addon installed', {
          distinct_id: request.body.authUser.id,
          addonId: addonId
        });

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
   * Route for /marketplace/addon/uninstall/:id
   *
   * @param request
   * @param reply
   * @constructor
   */
  async UninstallAddon(request: FastifyRequest<UninstallAddonRequest>, reply: FastifyReply) {
    try {
      let user = request.body.authUser;
      let addonId = request.params.id;

      if (!(await Auth.checkAddonOwnership(this.marketplaceService, addonId, user))) {
        return ReplyUtils.errorOnly(new HttpError(StatusCodes.UNAUTHORIZED, "The user isn't authorized to access the requested resource"));
      }

      await this.marketplaceService.uninstallAddon(addonId);

      if (this.mixpanel)
        this.mixpanel.track('addon uninstalled', {
          distinct_id: request.body.authUser.id,
          addonId: addonId
        });

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
   * Route for /marketplace/user/favorite/:id
   *
   * @param request
   * @param reply
   * @constructor
   */
  async ToggleUserFavoriteAddon(request: FastifyRequest<ToggleUserFavoriteAddonRequest>, reply: FastifyReply) {
    try {
      let user = request.body.authUser;
      let addonId = request.params.id;

      let favorited = await this.marketplaceService.userToggleFavoriteAddon(user.id, addonId);

      if (this.mixpanel)
        this.mixpanel.track('user favorited addon', {
          distinct_id: user.id,
          addonId: addonId,
          favorited: favorited
        });

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
   * Route for /marketplace/user/favorites
   *
   * @param request
   * @param reply
   * @constructor
   */
  async ListUserFavoriteAddons(request: FastifyRequest<ListUserFavoriteAddonsRequest>, reply: FastifyReply) {
    try {
      let user = request.body.authUser;

      let favorites = await this.marketplaceService.userListFavoriteAddons(user.id);

      if (this.mixpanel)
        this.mixpanel.track('listed favorite addons', {
          distinct_id: user.id
        });

      return favorites;
    } catch (e) {
      if (e instanceof HttpError) {
        reply.code(e.statusCode);
        return ReplyUtils.error(e.message, e);
      }

      throw e;
    }
  }
}
