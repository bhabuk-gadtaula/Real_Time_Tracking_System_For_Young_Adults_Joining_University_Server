export interface IHash {
  hash(password: string): string;
  compare(userPassword: string, hashPassword: string): boolean;
}
