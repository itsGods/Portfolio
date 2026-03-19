// Suspense-compatible cache using React 19's use() pattern
const promiseCache = new Map<string, Promise<any>>();

export function getCachedPromise<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
  if (!promiseCache.has(key)) {
    const promise = fetcher().catch((err) => {
      promiseCache.delete(key);
      throw err;
    });
    promiseCache.set(key, promise);
  }
  return promiseCache.get(key) as Promise<T>;
}

export function clearPromiseCache(key?: string) {
  if (key) {
    promiseCache.delete(key);
  } else {
    promiseCache.clear();
  }
}
