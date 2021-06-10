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
     * Ex: parseTemplate("Hello {{world}}!", {world: "yo"}) == "Hello yo!"
     *
     * @param expression The string containing the expressions
     * @param valueObject an object that contains the values to replace
     */
    StringUtils.parseTemplate = function (expression, valueObject) {
        return expression.replace(/{{\s?([^{}\s]*)\s?}}/g, function (substring, value, index) {
            value = valueObject[value];
            return value;
        });
    };
    return StringUtils;
}());
exports.StringUtils = StringUtils;
