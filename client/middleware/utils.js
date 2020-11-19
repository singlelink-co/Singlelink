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
    } else {
      // This throws errors, is it needed?
      /*console.log('Set ignore me');
      if(context && context.app.$cookies) {
        if(!days) return context.app.$cookies.set(name, value);
        return context.app.$cookies.set(name, value, {
          maxAge: days * 24 * 60 * 60
        });
      }*/
    }
  }

};
