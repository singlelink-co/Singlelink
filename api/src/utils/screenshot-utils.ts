import {config} from "../config/config";
import {Client} from "minio";
import * as ObjectHash from "object-hash";
import {StatusCodes} from "http-status-codes";
import {HttpError} from "./http-error";
import * as fs from "fs";
import Pageres from "pageres";

/**
 * This represents a query coming in from a user.
 */

export class ScreenshotUtils {
  /**
   * One day in seconds
   */
  static readonly DEFAULT_TTL: number = 84600;

  static minio: Client | null = null;
  static bucketEnabled: boolean = false;

  static async initialize() {
    if (config.s3Bucket) {
      this.minio = new Client({
        endPoint: config.s3Bucket.endPoint,
        port: config.s3Bucket.port ?? config.s3Bucket.useSSL ? 443 : 80,
        useSSL: config.s3Bucket.useSSL,
        accessKey: config.s3Bucket.accessKey,
        secretKey: config.s3Bucket.secretKey
      });

      this.bucketEnabled = await this.minio.bucketExists(config.s3Bucket.bucketName);

      if (!this.bucketEnabled) {
        console.log(`S3 Bucket was configured, but no bucket with the name ${config.s3Bucket.bucketName} exists! You need to make this bucket first before you can use it.`);
        return;
      } else {
        console.log(`S3 Bucket is ready!`);
      }
    }
  }

  /**
   * Gets a screenshot, or creates it if it doesn't exist.
   * If noCache is enabled, then it creates a new screenshot every time.
   *
   * @param url The url of the page to be captured
   * @param sizes The sizes of the screenshots
   * @param ttl The time to live until the cached screenshot expires
   * @param noCache Whether we should cache the screenshot or not
   * @param options The screenshot options
   */
  static async getOrCreateScreenshot(url: string, sizes: string[], ttl: number = ScreenshotUtils.DEFAULT_TTL, noCache: boolean = false, options: ScreenshotOptions): Promise<Buffer> {
    let hash = ObjectHash.sha1(options);

    if (!url.startsWith("http")) {
      throw new HttpError(StatusCodes.BAD_REQUEST, `Only http protocol is supported when creating screenshots. URL received: ${url}`);
    }

    if (!noCache && this.bucketEnabled && this.minio) {
      let bucketName = config.s3Bucket.bucketName;

      try {
        let stats = await this.minio.statObject(bucketName, "imageCache/" + hash);
        let expires: Date = new Date(Date.parse(JSON.parse(stats.metaData.expires)));
        let date = new Date();

        if (expires > date) {
          console.log(`Pulling from S3 bucket: imageCache/${hash}`);

          let readableStream = await this.minio.getObject(bucketName, "imageCache/" + hash);

          const chunks = [];
          for await (let chunk of readableStream) {
            chunks.push(chunk);
          }

          return Buffer.concat(chunks);
        }
      } catch (e) {
        console.log("No s3 cache found for pageresQuery: " + hash + ", downloading instead.");
      }
    }

    let screenshot = (await new Pageres(options.asObject())
      .src(url, sizes)
      .dest("captures")
      .run())[0];

    try {
      console.log(`Generated screenshot ${screenshot.filename} ${hash} of length ${screenshot.byteLength}`);

      if (!noCache && this.bucketEnabled && this.minio) {
        console.log("Caching to S3 Bucket");

        let expires = new Date();
        expires.setSeconds(expires.getSeconds() + ttl);

        await this.minio.fPutObject(
          config.s3Bucket.bucketName, "imageCache/" + hash,
          `captures/${screenshot.filename}`,
          {
            "expires": JSON.stringify(expires),
            "filename": screenshot.filename
          }
        );
      }

      let readStream = fs.createReadStream(`captures/${screenshot.filename}`);

      const chunks = [];
      for await (let chunk of readStream) {
        chunks.push(chunk);
      }

      return Buffer.concat(chunks);
    } finally {
      fs.unlink(`captures/${screenshot.filename}`, err => {
        if (err != null)
          console.error("Error unlinking file: " + err);
      });
    }
  }
}

/**
 * This class is a 1:1 mapping of the documentation of options from https://github.com/sindresorhus/pageres
 */
export class ScreenshotOptions {
  delay: number = 0;
  timeout: number = 60;
  crop: boolean = false;
  css: string = "";
  script: string = "";
  cookies: Array<string | object> = new Array<string | object>();
  filename: string = "";
  incrementalName: boolean = false;
  selector: string = "";
  hide: string[] = [];
  username: string = "";
  password: string = "";
  scale: number = 1;
  format: string = "png";
  userAgent: string = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36";
  transparent: boolean = false;

  asObject(): Object {
    return Object.assign({}, this);
  }
}
