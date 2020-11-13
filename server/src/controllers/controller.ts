/**
 * Controllers are managed by the server to register routes for Fastify.
 * They can be registered with `SingleLinkServer.addController(controller)`.
 *
 * registerRoutes() is called when the Controller is expected to register Fastify routes.
 */
interface Controller {
  /**
   * Registers all the controllers necessary for this Controller.
   */
  registerRoutes(): void;
}
