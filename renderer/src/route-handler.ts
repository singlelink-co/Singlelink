import fs from "fs";
import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import chalk from "chalk";
import axios from "axios";
import config from "./config/config";
import {StatusCodes} from "http-status-codes";

/**
 * Creates all the routes.
 */
export class RouteHandler {
  icon: Buffer;
  fastify: FastifyInstance;

  constructor(fastify: FastifyInstance) {
    this.icon = fs.readFileSync(`${__dirname}/../favicon.png`);
    this.fastify = fastify;
  }

  /**
   * Register routes
   */
  registerRoutes() {
    /*
     Favicon route
     Route /favicon.*
    */
    this.fastify.get("/favicon.*", async (request: FastifyRequest, reply: FastifyReply) => {
      reply.header('Content-Type', 'image/png');
      reply.send(this.icon);
    });

    /*
      Redirect to new link format
     */
    this.fastify.get("/u/*", async (request: FastifyRequest, reply: FastifyReply) => {
      // Get requested profile handle from URL
      const handle = request.url.replace('/u/', '');

      reply.redirect(StatusCodes.PERMANENT_REDIRECT, `/${handle}`);
    });

    /*
     Declare site route
     Route /*
    */
    this.fastify.get("*", async (request: FastifyRequest, reply: FastifyReply) => {
      // Get requested profile handle from URL
      const handle = request.url.replace('/', '');

      // Log request
      console.log(`${chalk.cyan.bold(config.appName)}: Request received at /${handle}`);

      let response;

      try {
        // Fetch profile from API
        response = await axios.get<{ profile: Profile, links: Link[], user: User, theme: Theme }>(`${config.apiUrl}/profile/${handle}`);
      } catch (err) {
        // Log error
        console.log(`${chalk.cyan.bold(config.appName)}: Error when processing request`);
        console.log(`${chalk.cyan.bold(config.appName)}: ${err}`);
        reply.type('text/html');

        //language=HTML
        return reply.send(`
          <html lang="">
          <head>
            <meta charset="UTF-8">
            <title>Singlelink Web Client</title>
            <link rel="icon" href="favicon.ico" type="image/png"/>
          </head>
          <body>
          <div class="w-full h-full flex flex-col items-center justify-center">
            <h1 class="text-4xl text-gray-900 mb-2 font-extrabold">500 - Server Error</h1>
            <h3 class="text-lg text-gray-600 mb-4">Oops! Something went wrong. Try again?</h3>
            <a class="bg-indigo-600 hover:bg-indigo-500 rounded shadow text-white py-3 px-6 text-sm font-medium"
               href="${request.url}">Reload page</a>
          </div>
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.0.4/tailwind.min.css"/>
          <style>
            @import url('https://rsms.me/inter/inter.css');

            html {
              font-family: 'Inter', sans-serif;
            }

            @supports (font-variation-settings: normal) {
              html {
                font-family: 'Inter var', sans-serif;
              }
            }
          </style>
          </body>
          </html>
        `);
      }

      // Define profile
      const profile = response.data.profile;

      // Define user
      const user = response.data.user;

      // Define theme = response.data.theme;
      const theme = response.data.theme;

      // Define Avatar image
      const imageUrl = profile.imageUrl || `https://www.gravatar.com/avatar/${user.emailHash}`;

      // Define Link HTML Block
      let linkHtml = '';

      // Define links & sort by order
      const links = response.data.links.sort(function (a: Link, b: Link) {
        return a.sortOrder - b.sortOrder;
      });

      // Add link html to html block link-by-link
      for await (let link of links) {
        let subtitleHtml = '';

        //language=HTML
        if (link.subtitle)
          subtitleHtml = `<span class="text-sm text-gray-700 sl-link-subtitle mt-1">${link.subtitle}</span>`;

        let css = link.customCss ?? '';

        //language=HTML
        linkHtml += `
          <a
            id="sl-item-${link.id}"
            href="${config.apiUrl}/analytics/link/record/${link.id}"
            class="w-full"
            target="_blank"
          >
            <div
              class="rounded shadow bg-white p-4 w-full font-medium mb-3 nc-link sl-item  flex items-center justify-center flex-col"
              style="${css}"
            >
              <span class="font-medium text-gray-900 sl-label">${link.label}</span>${subtitleHtml}
            </div>
          </a>
        `;
      }

      // Define headline HTML
      //language=HTML
      const headlineHtml = `<h1 class="text-black font-semibold text-2xl sl-headline">${profile.headline}</h1>`;

      // Define subtitle HTML
      let subtitleHtml = ``;
      //language=HTML
      if (profile.subtitle) subtitleHtml = `<h3 class="text-gray-600 mb-4 sl-subtitle">${profile.subtitle}</h3>`;

      // Define theme colors html
      let themeColorsHtml = ``;

      //language=HTML
      if (theme)
        themeColorsHtml = `
          <style>
            .sl-headline {
              color: ${theme.colors?.text.primary ?? 'inherit'};
            }

            .sl-subtitle {
              opacity: .85;
              color: ${theme.colors?.text.primary ?? 'inherit'};
            }

            .sl-bg {
              background: ${theme.colors?.fill.primary ?? 'inherit'};
            }

            .sl-item {
              background: ${theme.colors?.fill.secondary ?? 'inherit'};
            }

            .sl-label {
              color: ${theme.colors?.text.secondary ?? 'inherit'};
            }

            .sl-link-subtitle {
              opacity: .85;
              color: ${theme.colors?.text.secondary ?? 'inherit'};
            }
          </style>`;


      // Build watermark string
      let watermarkHtml = '';
      //language=HTML
      watermarkHtml += `
        <div id="sl-watermark">`;

      if (theme) {
        //language=HTML
        watermarkHtml += `
          <p style="color: ${theme.colors?.text.primary ?? 'inherit'};" class="mt-4 text-sm">
            Proudly built with ${config.appName} 🔗
          </p>`;
      } else {
        //language=HTML
        watermarkHtml += `
          <p style="color:rgba(0,0,0,1);" class="mt-4 text-sm">
            Proudly built with ${config.appName} 🔗
          </p>`;
      }

      if (config.freeSignup) {
        //language=HTML
        watermarkHtml += `
          <a class="text-indigo-600 hover:underline text-sm" href="https://${config.hostname}/create-account"
             target="_blank">
            Create your free profile in minutes!
          </a>`;
      }

      watermarkHtml += `<base target="_blank">`;
      watermarkHtml += `</div>`;

      if (profile.customCss === null) profile.customCss = '';
      if (profile.customHtml === null) profile.customHtml = '';
      if (theme.customCss === null) theme.customCss = '';
      if (theme.customHtml === null) theme.customHtml = '';

      // Send response content type to text/html
      reply.type('text/html');

      // Send response to client
      // language=HTML
      return reply.send(`
        <html lang="">
        <head>
          <meta charset="UTF-8">
          <title>${profile.headline}</title>
          <link rel="icon" href="favicon.ico" type="image/png"/>
        </head>
        <body>
        <div class="relative flex min-h-screen w-screen bg-gray-100 justify-center w-full sl-bg">
          <div
            id="user-site-view"
            class="relative flex min-h-screen w-screen bg-gray-100 justify-center w-full sl-bg"
          >
            <section class="flex flex-col p-6 pt-8 pb-8 items-center text-center max-w-sm w-full">
              <img class="nc-avatar mb-2" src="${imageUrl}" alt="avatar"/>
              ${headlineHtml}
              ${subtitleHtml}
              ${linkHtml}
              <!-- Site html -->
              <div id="custom-html">
                ${profile.customHtml}
              </div>
              <!-- Theme html -->
              <div id="theme-html">
                ${theme.customHtml}
              </div>
              <!-- Watermark -->
              ${watermarkHtml}
              <!-- Tailwind CSS -->
              <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.0.4/tailwind.min.css"/>
              <!-- Theme style -->
              <style>
                ${theme.customCss}
              </style>
              <!-- Personal styles -->
              <style>
                ${profile.customCss}
              </style>
              <style>
                .nc-avatar {
                  width: 60px;
                  height: 60px;
                  border-radius: 1000px;
                }

                .nc-link {
                  background-color: #FFF;
                  padding: 1rem;
                  margin-bottom: .75rem;
                  width: 100%;
                  border-radius: .25rem;
                  box-shadow: 0 1px 3px 0 rgb(0 0 (0 / 10%)), 0 1 px 2 px 0 rgb(0 0 (0 / 6 %));
                  font-weight: 500;
                  cursor: pointer;
                  transition: transform .15s ease-in-out;
                }

                .nc-link:hover {
                  transform: scale(1.02);
                }

                .nc-link:active {
                  transform: scale(1);
                }

                body {
                  overflow-x: hidden;
                }
              </style>
              ${themeColorsHtml}

            </section>
          </div>
        </div>
        <style>
          html, * {
            font-family: 'Inter',
            -apple-system,
            BlinkMacSystemFont,
            'Segoe UI',
            Roboto,
            'Helvetica Neue',
            Arial,
            sans-serif;
            font-size: 16px;
            line-height: 1.65;
            word-spacing: 1px;
            -ms-text-size-adjust: 100%;
            -webkit-text-size-adjust: 100%;
            -moz-osx-font-smoothing: grayscale;
            -webkit-font-smoothing: antialiased;
            box-sizing: border-box;
          }

          h1.sl-headline, h3.sl-subtitle {
            line-height: 1.65;
            word-spacing: 1px;
            -ms-text-size-adjust: 100%;
            -webkit-text-size-adjust: 100%;
            -moz-osx-font-smoothing: grayscale;
            -webkit-font-smoothing: antialiased;
          }

          *,
          *::before,
          *::after {
            box-sizing: border-box;
            margin: 0;
          }
        </style>
        </body>
        </html>
      `);
    });
  }
}
