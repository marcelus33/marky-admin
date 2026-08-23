/**
 * Debounces an async function so that a burst of calls only triggers one
 * underlying invocation (after `delay` ms of silence), while every caller
 * in the burst awaits the same eventual result.
 *
 * Unlike a plain debounce, no promise is ever left unresolved: every call
 * made before the trailing one resolves/rejects alongside it instead of
 * hanging, which matters for callers (e.g. a Yup async `.test`) that await
 * every invocation.
 */
export function debouncePromise<Args extends unknown[], R>(
  fn: (...args: Args) => Promise<R>,
  delay: number,
): (...args: Args) => Promise<R> {
  let timer: ReturnType<typeof setTimeout> | null = null;
  let waiters: Array<{
    resolve: (value: R) => void;
    reject: (reason: unknown) => void;
  }> = [];

  return (...args: Args) =>
    new Promise<R>((resolve, reject) => {
      waiters.push({ resolve, reject });
      if (timer) clearTimeout(timer);

      timer = setTimeout(async () => {
        const currentWaiters = waiters;
        waiters = [];
        timer = null;
        try {
          const result = await fn(...args);
          currentWaiters.forEach(({ resolve: res }) => res(result));
        } catch (error) {
          currentWaiters.forEach(({ reject: rej }) => rej(error));
        }
      }, delay);
    });
}
