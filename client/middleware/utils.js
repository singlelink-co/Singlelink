export default class Cookies {
  static getCookieValue(a, context) {
    if (process.client) {
      const b = document.cookie.match('(^|;)\\s*' + a + '\\s*=\\s*([^;]+)');
      return b ? b.pop() : '';
    } else {
      if(context && context.app.$cookies) {
        return context.app.$cookies.get(a);
      }
    }
  }

  static setCookie(name, value, days, context) {
    if(process.client) {
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
/*
export default {

  getCookieValue: function (a, context) {
    if(process.client) {
      const b = document.cookie.match('(^|;)\\s*' + a + '\\s*=\\s*([^;]+)');
      return b ? b.pop() : '';
    } else {
      console.log('Server side get');
      return context.$cookies.get(a);
      //return this.$cookies.get(a);
    }
  },
  setCookie: function(name, value, days, context) {
    if(process.client) {
      let expires = "";
      if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
      }
      document.cookie = name + "=" + (value || "") + expires + "; path=/";
    } else {
      console.log('Server side set');

      //return;
      if(days) {
        context.$cookies.set(name, value, {
          maxAge: 60 * 60 * 24 * days
        });
      } else {
        context.$cookies.set(name, value);
      }
    }
  }
};
*/
