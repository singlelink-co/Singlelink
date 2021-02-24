import {FastifyInstance} from "fastify";
import {DatabaseManager} from "../data/database-manager";
import {Pool} from "pg";

/**
 * Controllers are managed by the server to register routes for Fastify.
 * They can be registered with `SingleLinkServer.addController(controller)`.
 *
 * registerRoutes() is called when the Controller is expected to register Fastify routes.
 */
export abstract class Controller {
  protected readonly fastify: FastifyInstance;
  protected readonly databaseManager: DatabaseManager;
  protected readonly pool: Pool;

  protected constructor(fastify: FastifyInstance, databaseManager: DatabaseManager) {
    this.fastify = fastify;
    this.databaseManager = databaseManager;
    this.pool = databaseManager.pool;
  }

  /**
   * Registers all the controllers necessary for this Controller.
   */
  abstract registerRoutes(): void;
}
