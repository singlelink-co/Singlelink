/**
 * An IController is a way to describe a class that is going to register routes for Fastify.
 *
 * registerRoutes() is called when the IController is expected to register Fastify routes.
 */
interface IController {
  /**
   * Registers all the controllers necessary for this IController.
   */
  registerRoutes(): void;
}
