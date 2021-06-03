import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import {DatabaseManager} from "../data/database-manager";
import {Controller} from "./controller";
import {Auth, AuthenticatedRequest} from "../utils/auth";
import {PermissionService} from "../services/permission-service";
import {StatusCodes} from "http-status-codes";
import {ReplyUtils} from "../utils/reply-utils";
import {HttpError} from "../utils/http-error";

interface HasPermissionRequest extends AuthenticatedRequest {
  Body: {} & AuthenticatedRequest["Body"]
}

/**
 * This controller maps and provides for all the controllers under /permission.
 */
export class PermissionController extends Controller {
  private readonly permissionService: PermissionService;

  constructor(fastify: FastifyInstance, databaseManager: DatabaseManager) {
    super(fastify, databaseManager);

    this.permissionService = new PermissionService(databaseManager);
  }

  registerRoutes(): void {
    // Authenticated
    this.fastify.post<HasPermissionRequest>('/permission/has', Auth.ValidateWithData, this.HasPermission.bind(this));
  }

  // TODO: Implement permissions
  /**
   * Route for /permission/has
   *
   * @param request
   * @param reply
   * @constructor
   */
  async HasPermission(request: FastifyRequest<HasPermissionRequest>, reply: FastifyReply) {
    try {
      reply.code(StatusCodes.NOT_IMPLEMENTED);

      // this.mixpanel.track('user updated', {
      //   distinct_id: request.body.id,
      // });

      return ReplyUtils.error("Sorry, this is not implemented yet.");
    } catch (e) {
      if (e instanceof HttpError) {
        reply.code(e.statusCode);
        return ReplyUtils.error(e.message, e);
      }

      throw e;
    }
  }
}
