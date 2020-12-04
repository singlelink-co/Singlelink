import {Context} from "@nuxt/types";

export class Cookies {
  /**
   * Gets a cookie.
   * @param a
   */
  static getCookieValue(a: string): string | undefined {
    if (process.client) {
      const b = document.cookie.match('(^|;)\\s*' + a + '\\s*=\\s*([^;]+)');

      return b ? b.pop() : '';
    }
  }

  /**
   * Sets a cookie.
   * @param name The name of the cookie
   * @param value
   * @param days The TTL (time to live) in days
   */
  static setCookie(name: string, value: unknown, days: number) {
    if (process.client) {
      let expires = "";

      if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
      }

      document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }
  }
};
