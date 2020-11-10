import {FastifyReply, FastifyRequest} from "fastify";

export class AuthUtils {

  /**
   * Default authentication options for controllers.
   */
  static AuthedRouteOpts = {
    preHandler: AuthUtils.checkAuth
  };

  /**
   * Checks for authentication before allowing a request to pass through.
   *
   * @param request
   * @param reply
   * @param done
   */
  static checkAuth(request: FastifyRequest, reply: FastifyReply, done: Function) {

  }
}
