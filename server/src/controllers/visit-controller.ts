import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import {DatabaseManager} from "../data/database-manager";
import {Pool} from "pg";
import {AuthUtils} from "../utils/auth-utils";
import {VisitService} from "../services/visit-service";

/**
 * This controller maps and provides for all the controllers under /visit.
 */
export class VisitController implements IController {
  private fastify: FastifyInstance;
  private databaseManager: DatabaseManager;
  private pool: Pool;
  private visitService: VisitService;

  constructor(fastify: FastifyInstance, databaseManager: DatabaseManager) {
    this.fastify = fastify;
    this.databaseManager = databaseManager;
    this.pool = databaseManager.pool;
    this.visitService = new VisitService(databaseManager);
  }

  registerRoutes(): void {

    this.fastify.all('/visit/fetch', AuthUtils.AuthedRouteOpts, this.FetchVisit.bind(this));

  }

  /**
   * Route for /visit/fetch
   * @param request
   * @param reply
   */
  async FetchVisit(request: FastifyRequest, reply: FastifyReply) {

  }
}
