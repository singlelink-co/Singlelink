import fastifyInit, {FastifyReply, FastifyRequest} from "fastify";
import AWS from 'aws-sdk';
import {config} from "./config/config";
import {Controller} from "./controllers/controller";
import {CustomDomainHandler} from "./utils/custom-domains";

/**
 * The server contains a Fastify instance and a list of Controllers, which registers routes with Fastify.
 */
export class SingleLinkServer {
  private readonly controllers: Controller[];

  fastify = fastifyInit({
    logger: true,
    ignoreTrailingSlash: true,
  });

  /**
   *
   * @param controllers Any controllers that should be passed with the constructor. Otherwise, they can be added later with addController(controller).
   * @constructor
   */
  constructor(controllers?: Controller[]) {
    if (controllers)
      this.controllers = controllers;
    else
      this.controllers = [];

    AWS.config.update({
      region: config.aws.region,
      credentials: {
        accessKeyId: config.aws.accessKey,
        secretAccessKey: config.aws.secretKey
      },
      apiVersion: '2010-12-01'
    });
  }

  /**
   * Starts the fastify server with the controllers provided.
   */
  startServer() {
    this.fastify.listen(config.port, config.host, (err: Error, address: string) => {
      if (err)
        throw err;
    });

    this.registerDefaultRoutes();

    for (let controller of this.controllers) {
      controller.registerRoutes();
    }

    console.log("SingleLink is listening for requests!");
  }

  registerDefaultRoutes() {
    this.fastify.register(require('fastify-favicon'), {
      path: `${__dirname}/../assets/`
    });

    this.fastify.register(require('fastify-rate-limit'), {
      max: 200,
      timeWindow: '1 minute'
    });

    // Allow anyone
    this.fastify.register(require('fastify-cors'), {
      origin: '*'
    });

    /*
     We have to do this because JS does weird things when you pass functions. So instead of passing the function directly,
     you need to pass call the function from an arrow function instead.

     Unlike the controllers where you can bind(this) to the function to change the context, that won't work here since the
     context is irrelevant.
    */
    this.fastify.addHook('preHandler', ((request, reply) => {
      try {
        return CustomDomainHandler.checkRoute(request, reply);
      } catch (e) {
        // Fail-safe
        console.error(e);
      }
    }));

    this.fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
      return this.Index(request, reply);
    });
  }

  /**
   * Add a controller.
   * @param controller
   */
  addController(controller: Controller) {
    this.controllers.push(controller);
  }

  /**
   * Remove a controller.
   * @param controller
   */
  removeController(controller: Controller) {
    let index = this.controllers.indexOf(controller);

    if (index > -1)
      this.controllers.splice(index, 1);
  }

  /**
   * Index route for the server.
   *
   * @param request
   * @param reply
   * @constructor
   */
  async Index(request: FastifyRequest, reply: FastifyReply) {
    reply.type('text/html').code(200);

    return `<html lang="en">
    <head>
        <link href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css" rel="stylesheet">
        <link rel="icon" type="image/png" href="https://app.singlelink.co/favicon.ico">
        <title>Status Page | Singlelink</title>
    </head>
    <body class="flex flex-col items-center justify-center w-screen min-h-screen bg-gray-100">
        <section class="flex flex-col mt-auto bg-white rounded shadow p-6 w-11/12 max-w-lg border-8 border-l-0 border-r-0 border-b-0 border-indigo-600">
            <h1 class="text-2xl font-semibold text-gray-800 mb-2">Status Page</h1>
            <p class="text-base text-gray-600 mb-4">Welcome to the Singlelink status page, view the status and downtime of various application infrastructure below.</p>
            <div class="flex flex-row justify-apart items-center p-3 cursor-pointer hover:bg-gray-100 rounded">
               <div style="width:8px;height:8px;box-shadow: 0 0 0 3px rgba(104,211,145,.4);" class="mr-4 bg-green-400 rounded-full"></div>               <p class="mr-2 text-gray-600 font-medium text-sm">Singlelink API</p>               <p class="ml-auto text-gray-500 text-sm">99.9% Uptime</p>            </div>
            <div class="flex flex-row justify-apart items-center p-3 cursor-pointer hover:bg-gray-100 rounded">
               <div style="width:8px;height:8px;box-shadow: 0 0 0 3px rgba(104,211,145,.4);" class="mr-4 bg-green-400 rounded-full"></div>               <p class="mr-2 text-gray-600 font-medium text-sm">Singlelink Client</p>               <p class="ml-auto text-gray-500 text-sm">99.9% Uptime</p>            </div>
            <div class="flex flex-row justify-apart items-center p-3 cursor-pointer hover:bg-gray-100 rounded">
               <div style="width:8px;height:8px;box-shadow: 0 0 0 3px rgba(104,211,145,.4);" class="mr-4 bg-green-400 rounded-full"></div>               <p class="mr-2 text-gray-600 font-medium text-sm">Singlelink Database</p>               <p class="ml-auto text-gray-500 text-sm">99.9% Uptime</p>            </div>
            <div class="flex flex-row justify-apart items-center p-3 cursor-pointer hover:bg-gray-100 rounded">
               <div style="width:8px;height:8px;box-shadow: 0 0 0 3px rgba(104,211,145,.4);" class="mr-4 bg-green-400 rounded-full"></div>               <p class="mr-2 text-gray-600 font-medium text-sm">Community Support</p>               <p class="ml-auto text-gray-500 text-sm">100% Uptime</p>            </div>
        </section>
       <section class="flex text-center text-gray-600 text-sm mt-auto mb-4">All rights reserved.</br>Copyright ©2020 Neutron Creative Inc.</section>
    </body>
</html>
`;
  }

}
