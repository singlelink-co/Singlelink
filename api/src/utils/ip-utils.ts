import {FastifyRequest} from "fastify";
import {config} from "../config/config";

export class IpUtils {

  /**
   * Grabs IPs from a fastify request, accounting for proxy forwarded IPs.
   * @param request
   * @constructor
   */
  public static GrabIps(request: FastifyRequest) {
    return config.allowXForwardHeader ?
      request.headers['cf-connecting-ip'] || request.headers['x-forwarded-for'] || request.connection.remoteAddress :
      request.connection.remoteAddress;
  }
}
