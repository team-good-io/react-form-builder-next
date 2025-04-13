export function debounce<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  delay: number
): T {
  let timer: number | undefined;
  return function (this: any, ...args: any[]) {
    if (timer) clearTimeout(timer);
    return new Promise((resolve) => {
      timer = window.setTimeout(async () => {
        const result = await fn.apply(this, args);
        resolve(result);
      }, delay);
    });
  } as T;
}