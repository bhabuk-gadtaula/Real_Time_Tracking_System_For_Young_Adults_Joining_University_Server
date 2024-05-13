export function success(data: any, message?: string) {
  return {
    data,
    message,
    success: true,
  };
}
