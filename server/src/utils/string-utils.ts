export class StringUtils {

  /**
   * Generates a random slug. Ex: /l9tdfgw6
   */
  static generateRandomSlug(): string {
    return Math.random().toString(36).substring(2, 6) + Math.random().toString(36).substring(2, 6);
  }

  /**
   * Generates a random password string. Maximum possible length 32 characters, minimum length 20.
   */
  static generateRandomPassword(): string {
    return Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
  }

  /**
   * Generates a nonce value with the specified length.
   *
   * @param length
   */
  static generateNonce(length: number) {
    const charset = '0123456789ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvwxyz-._';
    let result = '';

    while (length > 0) {
      const bytes = new Uint8Array(16);
      const random = window.crypto.getRandomValues(bytes);

      random.forEach(function (c) {
        if (length == 0) {
          return;
        }
        if (c < charset.length) {
          result += charset[c];
          length--;
        }
      });
    }
    return result;
  }

  /**
   * Replaces expressions within a string based on the valueObject.
   *
   * Ex: parseTemplate("Hello {{world}}!", {world: "yo"}) == "Hello yo!"
   *
   * @param expression The string containing the expressions
   * @param valueObject an object that contains the values to replace
   */
  static parseTemplate(expression: string, valueObject: any) {
    return expression.replace(/{{\s?([^{}\s]*)\s?}}/g, (substring, value, index) => {
      value = valueObject[value];
      return value;
    });
  }

}
