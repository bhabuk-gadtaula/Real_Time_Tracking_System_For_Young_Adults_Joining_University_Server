export * from './object';
export * from './string';
export * from './response';
export * from './location';
export * from './assigner';
export * from './parse-special-character';

export async function sleep(time: number) {
  return new Promise(res => {
    setTimeout(() => {
      res(true);
    }, time);
  });
}

export function generateOTP(digit: number): string {
  const min = parseInt('1'.repeat(digit));
  const max = parseInt('9'.repeat(digit));

  return Math.floor(Math.random() * (max - min + 1) + min).toString();
}
