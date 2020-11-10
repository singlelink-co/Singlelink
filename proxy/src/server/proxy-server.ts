import fastifyInit from "fastify";
import {config} from "../data/config";
import AWS from 'aws-sdk';

/**
 * The Capture Server contains a Fastify instance and a list of IRouters, which register routes with Fastify.
 */
export class ProxyServer {
  private readonly routers: IRouter[];

  fastify = fastifyInit({
    logger: true
  });

  constructor(routers?: IRouter[]) {
    if (routers)
      this.routers = routers;
    else
      this.routers = [];

    this.fastify.register(require('fastify-rate-limit'), {
      max: 200,
      timeWindow: '1 minute'
    });

    this.fastify.register(require('fastify-raw-body'), {
      field: 'rawBody', // change the default request.rawBody property name
      global: false, // add the rawBody to every request. **Default true**
      encoding: 'utf8', // set it to false to set rawBody as a Buffer **Default utf8**
      runFirst: true // get the body before any preParsing hook change/uncompress it. **Default false**
    });

    /*
        Allow anyone
     */
    this.fastify.register(require('fastify-cors'), {
      origin: '*'
    });

    AWS.config.update({
      region: config.aws.region,
      credentials: {
        accessKeyId: config.aws.access_key,
        secretAccessKey: config.aws.secret_key
      },
      apiVersion: '2010-12-01'
    });
  }

  addRoute(router: IRouter) {
    this.routers.push(router);
  }

  removeRoute(router: IRouter) {
    let index = this.routers.indexOf(router);

    if (index > -1)
      this.routers.splice(index, 1);
  }

  /**
   * Starts the fastify server with the routes provided.
   */
  startServer() {
    this.fastify.listen(config.port, config.host, (err, address) => {
      if (err)
        throw err;
    });

    this.registerDefaultRoutes();

    for (let router of this.routers) {
      router.registerRoutes();
    }

    console.log("Neutron Capture is listening for requests!");
  }

  registerDefaultRoutes() {
    /**
     * Index
     */

    this.fastify.get('/', async (request, reply) => {
      reply.type('application/json').code(200);

      return {message: "We're up and running! Check out https://capture.neutroncreative.com!"};
    });

    this.fastify.get('/favicon.ico', async (request, reply) => {
      reply.type('application/json').code(200);

      return null;
    });
  }
}
