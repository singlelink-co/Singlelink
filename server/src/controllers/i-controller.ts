/**
 * IControllers are managed by the server to register routes for Fastify.
 * They can be registered with `SingleLinkServer.addController(controller)`.
 *
 * registerRoutes() is called when the IController is expected to register Fastify routes.
 */
interface IController {
  /**
   * Registers all the controllers necessary for this IController.
   */
  registerRoutes(): void;
}
