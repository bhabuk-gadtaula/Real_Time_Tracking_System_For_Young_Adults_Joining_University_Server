import crypto from 'crypto';
import { UnauthorizedError } from '../errors';
import { configService } from '../../../config';
import { IEncryption, IHash } from './interfaces';

class EncryptionHelper implements IHash, IEncryption {
  private delimiter = '.';
  private iterations = 10000; // Number of iterations
  private keylen = 64; // Use the same key length as during the initial hashing
  private digest = 'sha512'; // The hash algorithm to use

  /**
   * The function takes a password as input, generates a random salt, and then uses the pbkdf2Sync
   * function to generate a hash of the password using the salt.
   * @param {string} password - The `password` parameter is a string that represents the password that
   * needs to be hashed.
   * @returns the hash of the password, which is a string.
   */
  hash(password: string): string {
    const salt = crypto.randomBytes(16); // Generate a random salt

    // Generate the hash synchronously
    const hash = crypto.pbkdf2Sync(password, salt, this.iterations, this.keylen, this.digest);

    return this.attachSalt(hash, salt);
  }

  /**
   * The function compares a user-provided password with a stored hashed password to determine if they
   * match.
   * @param {string} userPassword - The user-provided password that needs to be compared with the stored
   * hashed password.
   * @param {string} hashPassword - The `hashPassword` parameter is the stored password hash. It contains
   * both the hashed password and the salt used for hashing.
   * @returns a boolean value.
   */
  compare(userPassword: string, hashPassword: string): boolean {
    const { hash: storedHashedPassword, salt: storedSalt } = this.detachSalt(hashPassword);

    // Hash the user-provided password with the stored salt and parameters
    const hash = crypto.pbkdf2Sync(userPassword, Buffer.from(storedSalt, 'hex'), this.iterations, this.keylen, this.digest);

    // Compare the generated hash with the stored hash
    return hash.toString('hex') === storedHashedPassword;
  }

  private attachSalt(hash: Buffer, salt: Buffer) {
    return hash.toString('hex') + this.delimiter + salt.toString('hex');
  }

  private detachSalt(hashPassword: string) {
    if (hashPassword.includes(this.delimiter)) {
      const splittedData = hashPassword.split(this.delimiter);

      return {
        hash: splittedData[0],
        salt: splittedData[1],
      };
    }

    throw new UnauthorizedError('Invalid credential!');
  }

  /**
   * The encrypt function takes a string value, creates a cipher using a secret and vector, updates the
   * cipher with the plaintext value, and returns the encrypted data.
   * @param {string} value - The `value` parameter is the string that you want to encrypt.
   * @returns The encrypted data is being returned as a string.
   */
  encrypt(value: string): string {
    // Create a cipher with the 'createCipheriv' method
    const cipher = crypto.createCipheriv(
      configService.getEncryptionConfig.algorithm,
      Buffer.from(configService.getEncryptionConfig.secret.toString().slice(0, 32)),
      configService.getEncryptionConfig.vector.toString().slice(0, 16)
    );

    // Update the cipher with the plaintext and obtain the encrypted data
    let encryptedData = cipher.update(value, 'utf8', 'hex');
    encryptedData += cipher.final('hex');

    // Output the encrypted data
    return encryptedData;
  }

  /**
   * The function decrypts a given value using a specified encryption algorithm, secret key, and
   * initialization vector.
   * @param {string} value - The `value` parameter is the encrypted data that needs to be decrypted.
   * @returns The decrypted data as a JSON object.
   */
  decrypt(value: string): string {
    const decipher = crypto.createDecipheriv(
      configService.getEncryptionConfig.algorithm,
      Buffer.from(configService.getEncryptionConfig.secret.toString().slice(0, 32)),
      configService.getEncryptionConfig.vector.toString().slice(0, 16)
    );

    // Update the decipher with the encrypted data to obtain the original plaintext
    let decryptedData = decipher.update(value, 'hex', 'utf8');
    decryptedData += decipher.final('utf8');

    return JSON.parse(decryptedData);
  }
}

export default new EncryptionHelper();
