export default class Cookies {
  static getCookieValue(a, context) {
    if (process.client) {
      const b = document.cookie.match('(^|;)\\s*' + a + '\\s*=\\s*([^;]+)');
      return b ? b.pop() : '';
    } else {
      if (context && context.app.$cookies) {
        return context.app.$cookies.get(a);
      }
    }
  }

  static setCookie(name, value, days, context) {
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
