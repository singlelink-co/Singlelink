import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import {DatabaseManager} from "../data/database-manager";
import {Controller} from "./controller";
import {Auth, AuthenticatedRequest} from "../utils/auth";
import {AdminService} from "../services/admin-service";

interface GetGroupRequest extends AuthenticatedRequest {
  Body: {} & AuthenticatedRequest["Body"]
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
}
