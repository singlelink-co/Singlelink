const Nuxt = require('nuxt-start');

const clientConfig = require('./editor/nuxt.config.js');
const apiConfig = require('./api/nuxt.config.js');

const client = new Nuxt(clientConfig);
const api = new Nuxt(apiConfig);

client.listen(80);
api.listen(5566);

