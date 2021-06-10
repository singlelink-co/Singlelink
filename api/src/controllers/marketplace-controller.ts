import {FastifyInstance, FastifyReply, FastifyRequest, preHandlerHookHandler} from "fastify";
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
import {ThemeService} from "../services/theme-service";
import {Constants} from "../config/constants";

interface ListAddonsRequest extends AuthenticatedRequest {
  Body: {
    sorting?: AddonSorting,
    ascending?: boolean,
    detailed?: boolean,
    ids?: string[],
    lastItemId?: number,
    limit?: number
  } & AuthenticatedRequest["Body"]
}

interface SearchAddonsRequest {
  Querystring: {
    query: string,
    detailed?: boolean,
    lastItemId?: number,
    limit?: number
  }
}

interface GetAddonRequest extends AuthenticatedRequest {
  Params: {
    id: string
  },
  Body: {
    detailed?: boolean,
  } & AuthenticatedRequest["Body"],
}

interface CreateAddonRequest extends AuthenticatedRequest {
  Body: {
    addon: Pick<Addon, 'type' | 'resourceId'> & Partial<Addon>
  } & AuthenticatedRequest["Body"]
}

interface UpdateAddonRequest extends AuthenticatedRequest {
  Body: {
    addon: Pick<Addon, 'id'> & Partial<Addon>
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


interface GetAddonStats extends FastifyRequest {
  Params: {
    id: string
  }
}

interface ToggleUserFavoriteAddonRequest extends AuthenticatedRequest {
  Params: {
    id: string
  }
}

interface ListUserFavoriteAddonsRequest extends AuthenticatedRequest {
  Body: {} & AuthenticatedRequest["Body"]
}

const rateLimitSearchRequest = {
  config: {
    rateLimit: {
      max: 20,
      timeWindow: '1 min'
    }
  }
};


const rateLimitStatsRequest = {
  config: {
    rateLimit: {
      max: 10,
      timeWindow: '1 min'
    }
  }
};


const rateLimitMarketplaceCreation = {
  config: {
    rateLimit: {
      max: 10,
      timeWindow: '1 min'
    }
  },
  preHandler: <preHandlerHookHandler>Auth.validateAuthWithData
};

/**
 * This controller maps and provides for all the controllers under /marketplace.
 */
export class MarketplaceController extends Controller {
  private readonly marketplaceService: MarketplaceService;
  private readonly userService: UserService;
  private readonly themeService: ThemeService;
  private readonly mixpanel = config.analytics.mixpanelToken ? Mixpanel.init(config.analytics.mixpanelToken) : null;

  constructor(fastify: FastifyInstance, databaseManager: DatabaseManager) {
    super(fastify, databaseManager);

    this.marketplaceService = new MarketplaceService(databaseManager);
    this.userService = new UserService(databaseManager);
    this.themeService = new ThemeService(databaseManager);
  }

  registerRoutes(): void {
    // Unauthenticated
    this.fastify.post<GetAddonStats>('/marketplace/addon/stats/:id', rateLimitStatsRequest, this.GetAddonStats.bind(this));
    this.fastify.post<SearchAddonsRequest>('/marketplace/addons/search', rateLimitSearchRequest, this.SearchAddons.bind(this));

    // Authenticated
    this.fastify.post<ListAddonsRequest>('/marketplace/addons', Auth.ValidateWithData, this.ListAddons.bind(this));
    this.fastify.post<AuthenticatedRequest>('/marketplace/addons/authored', Auth.ValidateWithData, this.ListAuthoredAddons.bind(this));
    this.fastify.post<AuthenticatedRequest>('/marketplace/addons/installed', Auth.ValidateWithData, this.ListInstalledAddons.bind(this));

    this.fastify.post<GetAddonRequest>('/marketplace/addon/:id', Auth.ValidateWithData, this.GetAddon.bind(this));
    this.fastify.post<CreateAddonRequest>('/marketplace/addon/create', rateLimitMarketplaceCreation, this.CreateAddon.bind(this));
    this.fastify.post<UpdateAddonRequest>('/marketplace/addon/update', Auth.ValidateWithData, this.UpdateAddon.bind(this));
    this.fastify.post<DeleteAddonRequest>('/marketplace/addon/delete', Auth.ValidateWithData, this.DeleteAddon.bind(this));

    this.fastify.post<InstallAddonRequest>('/marketplace/addon/install/:id', Auth.ValidateWithData, this.InstallAddon.bind(this));
    this.fastify.post<UninstallAddonRequest>('/marketplace/addon/uninstall/:id', Auth.ValidateWithData, this.UninstallAddon.bind(this));

    this.fastify.post<ToggleUserFavoriteAddonRequest>('/marketplace/user/favorite/:id', Auth.ValidateWithData, this.ToggleUserFavoriteAddon.bind(this));
    this.fastify.post<ListUserFavoriteAddonsRequest>('/marketplace/user/favorites', Auth.ValidateWithData, this.ListUserFavoriteAddons.bind(this));
  }

  /**
   * Route for /marketplace/addons
   *
   * @param request
   * @param reply
   * @constructor
   */
  async ListAddons(request: FastifyRequest<ListAddonsRequest>, reply: FastifyReply) {
    try {
      let ids = request.body.ids;
      let lastItemId = request.body.lastItemId;
      let limit = request.body.limit;

      if (this.mixpanel) {
        if (ids) {
          this.mixpanel.track('user requested specific addons', {
            distinct_id: request.body.authUser.id,
            $ip: request.ip,
            addons: ids
          });
        } else {
          this.mixpanel.track('user listed addons', {
            distinct_id: request.body.authUser.id,
            $ip: request.ip,
            sorting: request.body.sorting,
            ascending: request.body.ascending
          });
        }
      }

      if (ids) {
        let addons = await this.marketplaceService.getAddons(request.body.authUser.id, ids);

        if (request.body.detailed) {
          let promises = [];

          for (let addon of addons) {
            promises.push(this.hydrateAddon(addon));
          }

          await Promise.all(promises);
        }

        return addons;
      } else {
        let addons = await this.marketplaceService.listAddons(request.body.authUser.id, request.body.sorting, request.body.ascending, lastItemId, limit);

        if (request.body.detailed) {
          let promises = [];

          for (let addon of addons) {
            promises.push(this.hydrateAddon(addon));
          }

          await Promise.all(promises);
        }

        return addons;
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
   * Route for /marketplace/addons/search
   *
   * @param request
   * @param reply
   * @constructor
   */
  async SearchAddons(request: FastifyRequest<SearchAddonsRequest>, reply: FastifyReply) {
    try {
      let query = request.query.query;
      let detailed = request.query.detailed;
      let lastItemId = request.query.lastItemId;
      let limit = request.query.limit;

      if (this.mixpanel) {
        this.mixpanel.track('search query', {
          distinct_id: Constants.ANONYMOUS_USER_ID,
          $ip: request.ip,
          query: query
        });
      }

      let addons = await this.marketplaceService.searchAddons(query, lastItemId, limit);

      if (detailed) {
        let promises = [];

        for (let addon of addons) {
          promises.push(this.hydrateAddon(addon));
        }

        await Promise.all(promises);
      }

      return addons;
    } catch (e) {
      if (e instanceof HttpError) {
        reply.code(e.statusCode);
        return ReplyUtils.error(e.message, e);
      }

      throw e;
    }
  }

  /**
   * Route for /marketplace/addon/authored
   *
   * @param request
   * @param reply
   * @constructor
   */
  async ListAuthoredAddons(request: FastifyRequest<AuthenticatedRequest>, reply: FastifyReply) {
    try {
      let user = request.body.authUser;

      return await this.marketplaceService.getAuthoredAddons(user.id);
    } catch (e) {
      if (e instanceof HttpError) {
        reply.code(e.statusCode);
        return ReplyUtils.error(e.message, e);
      }

      throw e;
    }
  }

  /**
   * Route for /marketplace/addon/installed
   *
   * @param request
   * @param reply
   * @constructor
   */
  async ListInstalledAddons(request: FastifyRequest<AuthenticatedRequest>, reply: FastifyReply) {
    try {
      let profile = request.body.authProfile;

      return await this.marketplaceService.getInstalledAddons(profile.id);
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
          $ip: request.ip,
          addon: addon.id,
          name: addon.displayName ?? undefined
        });

      if (request.body.detailed)
        addon = await this.hydrateAddon(addon);

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

      // ignore userId field if set and replace with our own
      addon.userId = request.body.authUser.id;

      switch (addon.type) {
        case "theme":
          if (!(await Auth.checkThemeOwnership(this.marketplaceService, addon.resourceId, request.body.authUser, false))) {
            return ReplyUtils.errorOnly(new HttpError(StatusCodes.UNAUTHORIZED, "The user isn't authorized to access the requested resource"));
          }
          break;
        case "preset":
        case "plugin":
        //TODO Implement these later
      }

      let newAddon = await this.marketplaceService.createAddon(addon);

      if (this.mixpanel)
        this.mixpanel.track('addon created', {
          distinct_id: request.body.authUser.id,
          $ip: request.ip,
          addon: newAddon.id,
          addonObject: newAddon
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

      // ignore userId field if set and replace with our own
      addon.userId = request.body.authUser.id;

      if (!(await Auth.checkAddonOwnership(this.marketplaceService, addon.id, request.body.authUser))) {
        return ReplyUtils.errorOnly(new HttpError(StatusCodes.UNAUTHORIZED, "The user isn't authorized to access the requested resource"));
      }

      let newAddon = await this.marketplaceService.updateAddon(addon);

      if (this.mixpanel)
        this.mixpanel.track('addon updated', {
          distinct_id: request.body.authUser.id,
          $ip: request.ip,
          addon: newAddon.id,
          addonObject: newAddon
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

      let addons = await this.marketplaceService.getAuthoredAddons(request.body.authUser.id);

      for (let addon of addons) {
        if (addon.type == "theme") {
          let number = await this.marketplaceService.getCurrentInstallCount(addon.id);

          if (number > config.settings.marketplaceDeleteAddonThreshold) {
            reply.code(StatusCodes.FORBIDDEN);
            return ReplyUtils.error(`Sorry, but you cannot delete a Theme addon that has more than ${config.settings.marketplaceDeleteAddonThreshold} active installations!`);
          }
        }
      }

      let deletedAddonId = await this.marketplaceService.deleteAddon(addonId);

      if (this.mixpanel)
        this.mixpanel.track('addon deleted', {
          distinct_id: request.body.authUser.id,
          $ip: request.ip,
          addon: addonId
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
      let profile = request.body.authProfile;
      let addonId = request.params.id;

      if (!(await Auth.checkAddonPermission(this.marketplaceService, addonId, user))) {
        return ReplyUtils.errorOnly(new HttpError(StatusCodes.UNAUTHORIZED, "The user isn't authorized to access the requested resource"));
      }

      await this.marketplaceService.installAddon(profile, addonId);

      if (this.mixpanel)
        this.mixpanel.track('addon installed', {
          distinct_id: request.body.authUser.id,
          $ip: request.ip,
          addon: addonId
        });

      return {"message": "addon has been installed"};
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
      let profile = request.body.authProfile;
      let addonId = request.params.id;

      await this.marketplaceService.uninstallAddon(profile, addonId);

      if (this.mixpanel)
        this.mixpanel.track('addon uninstalled', {
          distinct_id: request.body.authUser.id,
          $ip: request.ip,
          addon: addonId
        });

      return {"message": "addon has been uninstalled"};
    } catch (e) {
      if (e instanceof HttpError) {
        reply.code(e.statusCode);
        return ReplyUtils.error(e.message, e);
      }

      throw e;
    }
  }

  /**
   * Route for /marketplace/addon/stats
   *
   * @param request
   * @param reply
   * @constructor
   */
  async GetAddonStats(request: FastifyRequest<GetAddonStats>, reply: FastifyReply) {
    try {
      return this.marketplaceService.getAddonStats(request.params.id);
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
          $ip: request.ip,
          addon: addonId,
          favorited: favorited
        });

      return {"message": favorited ? `Favorited addon: ${addonId}` : `Unfavorited addon: ${addonId}`};
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

      return await this.marketplaceService.userListFavoriteAddons(user.id);
    } catch (e) {
      if (e instanceof HttpError) {
        reply.code(e.statusCode);
        return ReplyUtils.error(e.message, e);
      }

      throw e;
    }
  }

  private async hydrateAddon(addon: Addon): Promise<HydratedAddon> {
    let newAddon: HydratedAddon = <HydratedAddon>addon;

    // Populate resource field
    switch (addon.type) {
      case "theme":
        newAddon.resource = await this.themeService.getTheme(addon.resourceId);

        break;
      //TODO Add support for preset and plugin
      case "preset":
        break;
      case "plugin":
        break;
    }

    // Populate stats field
    newAddon.stats = await this.marketplaceService.getAddonStats(addon.id);

    return newAddon;
  }
}
