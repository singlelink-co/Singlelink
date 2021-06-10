import chalk from "chalk";
import fastifyConstructor from "fastify";
import config from "./config/config";
import {RouteHandler} from "./route-handler";

const fastify = fastifyConstructor({logger: false});

let routeHandler = new RouteHandler(fastify);

routeHandler.registerRoutes();

// Run the server!
async function start() {
  try {
    console.clear();
    console.log(`${chalk.cyan.bold(config.appName)}: Starting application...`);

    await fastify.listen(config.port);

    console.log(`${chalk.cyan.bold(config.appName)}: Application listening on port ${config.port}`);
  } catch (err) {
    console.log(`${chalk.cyan.bold(config.appName)}: Error!`);
    console.log(`${chalk.cyan.bold(config.appName)}: ${err}`);

    process.exit(1);
  }
}

start().then(() => {
  // do nothing
});
