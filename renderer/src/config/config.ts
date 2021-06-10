import {config as dotenvConfig} from "dotenv";

// Include .env as ENV variables via process.env
dotenvConfig();

let config = {
  // Host IP
  host: process.env.HOST ?? "0.0.0.0",

  // Define port for launch
  port: process.env.PORT ?? 80,

  // Define app name
  appName: process.env.APP_NAME ?? 'Singlelink',

  // Define free signup
  freeSignup: process.env.FREE_SIGNUP ?? true,

  // Define hostname
  hostname: process.env.HOSTNAME ?? 'api.singlelink.co',

  // Define API URL
  apiUrl: process.env.API_URL ?? 'https://api.singlelink.co'
};

export default config;
