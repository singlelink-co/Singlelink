export class StringUtils {

  /**
   * Generates a random slug. Ex: /l9tdfgw6
   */
  static generateRandomSlug(): string {
    return Math.random().toString(36).substring(2, 6) + Math.random().toString(36).substring(2, 6);
  }

  /**
   * Replaces expressions within a string based on the valueObject.
   *
   * Ex: parseTemplate("Hello ${world}!", {world: "yo"}) == "Hello yo!"
   *
   * @param templateString The string containing the expressions
   * @param templateVariables an object that contains the values to replace
   */
  static parseTemplate(templateString: string, templateVariables: any) {
    return templateString.replace(/\${(.*?)}/g, (_, g) => templateVariables[g]);
  }

}
