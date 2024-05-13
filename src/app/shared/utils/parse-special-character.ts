/**
 * The function `parseSpecialCharacterString` takes a string as input and returns a new string where
 * special characters are escaped with a backslash.
 * @param {string} value - The `value` parameter is a string that contains special characters.
 * @returns a string where any special characters (backslash, square brackets, asterisk, plus sign,
 * question mark, parentheses) are preceded by a backslash.
 */
export function parseSpecialCharacterString(value: string) {
  return value
    .split('')
    .map(str => {
      if (str.match(/[\\[\\\]\\*\\+\\?\\(\\)]/g)) return '\\' + str;

      return str;
    })
    .join('');
}

/**
 * The function replaces all spaces in a string with the escape sequence for the plus character.
 * @param {string} value - The `value` parameter is a string that represents a character string.
 * @returns a string with all spaces replaced by the escape sequence '\+'.
 */
export function parsePlusCharacterString(value: string) {
  return value.replace(' ', '\\+');
}
