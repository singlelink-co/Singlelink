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
      request.headers['cf-connecting-ip'] || request.headers['x-forwarded-for'] || request.socket.remoteAddress :
      request.socket.remoteAddress;
  }

  /**
   * Returns the first ip from a list of ips. Convenience method for when you may or may not have multiple ips
   * from a forwarded header.
   *
   * @param ips
   * @constructor
   */
  public static GetFirstIp(ips: string | string[] | undefined) {
    if (Array.isArray(ips)) {
      return ips[0];
    }

    return ips;
  }
}
