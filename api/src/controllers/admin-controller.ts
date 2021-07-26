import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import {DatabaseManager} from "../data/database-manager";
import {Controller} from "./controller";
import {AdminRequest, Auth, AuthenticatedRequest} from "../utils/auth";
import {AdminService} from "../services/admin-service";
import {StatusCodes} from "http-status-codes";
import {ReplyUtils} from "../utils/reply-utils";
import {HttpError} from "../utils/http-error";

interface GetGroupRequest extends AuthenticatedRequest {
  Body: {} & AuthenticatedRequest["Body"]
}

interface SetBannedRequest extends AuthenticatedRequest {
  Body: {
    userId: string,
    banned: boolean,
    reason?: string
  } & AdminRequest["Body"]
}

/**
 * This controller maps and provides for all the controllers under /admin.
 */
export class AdminController extends Controller {
  private readonly adminService: AdminService;

  constructor(fastify: FastifyInstance, databaseManager: DatabaseManager) {
    super(fastify, databaseManager);

    this.adminService = new AdminService(databaseManager);
  }

  registerRoutes(): void {
    // Authenticated
    this.fastify.post<GetGroupRequest>('/admin/perm-group', Auth.ValidateWithData, this.GetPermGroup.bind(this));

    this.fastify.post<SetBannedRequest>('/admin/set-banned', Auth.ValidateAdminWithData, this.SetBanned.bind(this));
    this.fastify.post<AdminRequest>('/admin/bans', Auth.ValidateAdminWithData, this.ListBans.bind(this));
  }

  /**
   * Route for /admin/perm-group
   *
   * @param request
   * @param reply
   * @constructor
   */
  async GetPermGroup(request: FastifyRequest<GetGroupRequest>, reply: FastifyReply) {
    return this.adminService.getPermGroup(request.body.authUser.id);
  }

  async SetBanned(request: FastifyRequest<SetBannedRequest>, reply: FastifyReply) {
    try {
      if (request.body.authUser.id === request.body.userId) {
        reply.code(StatusCodes.FORBIDDEN);
        return ReplyUtils.error("You cannot ban yourself!");
      }

      if ((await this.adminService.getPermGroup(request.body.userId)).groupName === "admin") {
        reply.code(StatusCodes.FORBIDDEN);
        return ReplyUtils.error("You cannot ban users with admin privileges!");
      }

      if (!request.body.userId) {
        reply.code(StatusCodes.BAD_REQUEST);
        return ReplyUtils.error("The 'userId' field was not set.");
      }

      return this.adminService.setBanned(request.body.userId, request.body.banned, request.body.reason);
    } catch (e) {
      if (e instanceof HttpError) {
        reply.code(e.statusCode);
        return ReplyUtils.error(e.message, e);
      }

      throw e;
    }
  }

  /**
   * List all the banned users.
   *
   * @param request
   * @param reply
   * @constructor
   */
  async ListBans(request: FastifyRequest<AdminRequest>, reply: FastifyReply) {
    return this.adminService.listBanned();
  }
}
