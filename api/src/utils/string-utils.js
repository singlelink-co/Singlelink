"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringUtils = void 0;
var StringUtils = /** @class */ (function () {
    function StringUtils() {
    }
    /**
     * Generates a random slug. Ex: /l9tdfgw6
     */
    StringUtils.generateRandomSlug = function () {
        return Math.random().toString(36).substring(2, 6) + Math.random().toString(36).substring(2, 6);
    };
    /**
     * Replaces expressions within a string based on the valueObject.
     *
     * Ex: parseTemplate("Hello ${world}!", {world: "yo"}) == "Hello yo!"
     *
     * @param templateString The string containing the expressions
     * @param templateVariables an object that contains the values to replace
     */
    StringUtils.parseTemplate = function (templateString, templateVariables) {
        return templateString.replace(/\${(.*?)}/g, function (_, g) { return templateVariables[g]; });
    };
    return StringUtils;
}());
exports.StringUtils = StringUtils;
