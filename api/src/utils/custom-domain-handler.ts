import {FastifyReply, FastifyRequest} from "fastify";
import {Pool} from "pg";
import {config} from "../config/config";

/**
 * A convenience class for Fastify Handler options regarding authentication.
 */
export class CustomDomainHandler {
  /**
   * Private pool instance for Auth.
   * @private
   */
  private static pool: Pool;

  /**
   * Initialize Auth.
   * @param pool
   */
  static initialize(pool: Pool) {
    this.pool = pool;
  }

  /**
   * Checks for custom domains in the route.
   *
   * @param request
   * @param reply
   */
  public static async checkRoute(request: FastifyRequest, reply: FastifyReply) {
    let customDomain = request.hostname;
    let rendererUrl = config.rendererUrl;

    // Disallow setting the domain as the client or api domain.
    // This is to prevent feedback loops.
    if (customDomain === config.editorUrl || customDomain === config.apiUrl || customDomain === config.rendererUrl) {
      return;
    }

    let queryResult = await this.pool.query<DbProfile>("select * from app.profiles where custom_domain=$1",
      [customDomain]);

    if (queryResult.rowCount < 1)
      return;

    let profile = queryResult.rows[0];

    if (!profile.visibility || profile.visibility === "unpublished") {
      return;
    }

    let url = `${rendererUrl}/${profile.handle}`;

    // language=HTML
    let html = `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <!-- SEO Title -->
      <title>${profile.headline || ''}</title>
      <!-- SEO/OG Description -->
      <meta data-n-head="1" name="og:description" content="${profile.subtitle || ''}">
      <!-- OpenGraph Image -->
      <meta data-n-head="1" name="og:image" content="https://api.singlelink.co/profile/thumbnail/${profile.handle}">
      <!-- Set favicon -->
      <link rel="icon" type="image/png" href="https://singlelink.co/favicon.ico">
      <!-- Set page scale -->
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <!-- Facebook Meta Tags -->
      <meta property="og:url" content="${profile.custom_domain}">
      <meta property="og:type" content="website">
      <meta property="og:title" content="${profile.headline || ''}">
      <meta property="og:description" content="${profile.subtitle || ''}">
      <meta property="og:image" content="https://api.singlelink.co/profile/thumbnail/${profile.handle}">

      <!-- Twitter Meta Tags -->
      <meta property="twitter:url" content="${profile.custom_domain}">
      <meta name="twitter:card" content="summary_large_image">
      <meta name="twitter:title" content="${profile.headline || ''}">
      <meta name="twitter:description" content="${profile.subtitle || ''}">
      <meta name="twitter:image" content="https://api.singlelink.co/profile/thumbnail/${profile.handle}">
    </head>

    <body>
    <!-- Profile contents -->
    <iframe
      src='${url}'
      style="
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    width: 100%;
    border: none;
    margin: 0;
    padding: 0;
    overflow: hidden;
    z-index: 999999;
    height: 100%;
  ">
    </iframe>
    </body>
    </html>`;

    reply.status(200).type('text/html').send(html);

    return;
  }

}
