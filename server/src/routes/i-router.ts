/**
 * An IRouter is a way to describe a class that is going to register routes for Fastify.
 *
 * registerRoutes() is called when the IRouter is expected to register Fastify routes.
 */
interface IRouter {
  /**
   * Registers all the routes necessary for this IRouter.
   */
  registerRoutes(): void;
}
