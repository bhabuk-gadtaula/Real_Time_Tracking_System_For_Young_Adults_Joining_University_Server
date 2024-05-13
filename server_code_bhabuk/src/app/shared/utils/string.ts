import { isEmpty } from './object';
import { IName } from '../interface';

/**
 * The function `replaceDynamicVariables` replaces dynamic variables in a string with their
 * corresponding values from a given object.
 * @param {string} input - The `input` parameter is a string that may contain dynamic variables
 * enclosed in double curly braces, such as `{{variable}}`.
 * @param variables - The `variables` parameter is an object that contains key-value pairs. The keys
 * represent the dynamic variable names, and the values represent the corresponding values for those
 * variables.
 * @returns The function `replaceDynamicVariables` returns a string.
 */
export function replaceDynamicVariables(input: string, variables: Record<string, any>): string {
  const regex = /\{\{([\w.]+)\}\}/g;

  return input.replace(regex, (match, variable) => {
    const value = variable.split('.').reduce((obj: Record<string, any>, key: string) => obj?.[key], variables);

    return value !== undefined ? value : match;
  });
}

/**
 * The function "joinStrings" takes a delimiter and multiple words as arguments, and returns a string
 * by joining the words with the delimiter.
 * @param {string} delimiter - The delimiter parameter is a string that specifies the character or
 * characters to be used as a separator between the words in the resulting string.
 * @param {string[]} words - The `words` parameter is a rest parameter that allows you to pass in any
 * number of string arguments. These string arguments will be joined together using the `delimiter`
 * parameter, which is a string that specifies the character(s) to be used as a separator between the
 * joined strings.
 * @returns a string that is the result of joining all the words together with the specified delimiter.
 */
export function joinStrings(delimiter: string, ...words: string[]): string {
  return words.join(delimiter);
}

/**
 * The function formatCommonModelMessage takes a message and a modelName as input and returns the
 * message with dynamic variables replaced.
 * @param {string} message - The `message` parameter is a string that represents a common model
 * message. It could be a template or a placeholder string that needs to be formatted with dynamic
 * variables.
 * @param {string} modelName - The `modelName` parameter is a string that represents the name of a
 * model.
 * @returns the result of calling the `replaceDynamicVariables` function with the `message` and an
 * object containing the `modelName` variable.
 */
export function formatCommonModelMessage(message: string, modelName: string) {
  return replaceDynamicVariables(message, { modelName });
}

/**
 * The function `getFullName` takes an object with properties `firstName`, `middleName`, and
 * `lastName`, and returns a string representing the full name with any extra spaces removed.
 * @param {IName} name - An object of type IName, which has the following properties:
 * @returns the full name of a person, which is a combination of their first name, middle name (if
 * provided), and last name. The function uses the `replace` method to remove any extra spaces between
 * the names.
 */
export function getFullName(name?: IName) {
  if (!name || isEmpty(name)) return null;

  return `${name.firstName} ${name.middleName ?? ''} ${name.lastName}`.replace(/  +/g, ' ');
}

/**
 * Converts the first character to UPPERCASE
 *
 * @param string Eg: hello
 * @returns Eg: Hello
 */
export const toTitleCase = (string: string) => string.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase());

/**
 * Replaces space with underscore(_), removes all the remaining non-alphanumeric characters and converts the characters to UPPERCASE
 *
 * Eg: to Code Case@12 -> TO_CODE_CASE12
 *
 * @param string Eg: to Code Case@12
 * @returns Eg: TO_CODE_CASE12
 */
export const toCodeCase = (string: string) =>
  string
    .replace(/[^\w ]/g, '')
    .replace(' ', '_')
    .toUpperCase();

/**
 * Removes dash(-) from the string
 * @param string Eg: ABC-123
 * @returns Eg: ABC123
 */
export const removeDash = (string: string) => string.replace(/-/g, '');

/**
 * The function `validateSortBy` takes a string parameter `sortBy` and validates its format, returning
 * an object representing the sorting criteria if valid.
 * @param {string} sortBy - The `sortBy` parameter is a string that represents the sorting criteria for
 * a collection of data. It can contain one or more field names followed by an optional sort type
 * (either "asc" for ascending or "desc" for descending). Multiple field names can be separated by
 * commas.
 * @returns an object that represents the sorting criteria.
 */
export function validateSortBy(sortBy: string = 'created.at') {
  const validSortInput = /^([\w\d_\\.]+(:asc|:desc)?)(,[\w\d_\\.]+(:asc|:desc)?)*$/;

  if (!validSortInput.test(sortBy)) throw new Error('Invalid sortBy format!');

  const sorting: Record<string, -1 | 1> = {};

  const pairs = sortBy.split(',');
  pairs.forEach(pair => {
    const [fieldName, sortType] = pair.split(':');
    sorting[fieldName] = sortType ? (sortType === 'asc' ? 1 : -1) : -1;
  });

  return sorting;
}

export function appendStringToEmail(input: string, appendStr: string) {
  // Split the email into username and domain parts
  const [username, domain] = input.split('@');

  // Append the specified string to the username
  const newUsername = username + appendStr;

  // Recreate the email address by combining the new username and the domain
  const output = newUsername + '@' + domain;

  return output.replace(/ /g, '');
}
