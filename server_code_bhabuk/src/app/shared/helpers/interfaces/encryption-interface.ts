export interface IEncryption {
  encrypt(value: string): string;
  decrypt(value: string): string;
}
