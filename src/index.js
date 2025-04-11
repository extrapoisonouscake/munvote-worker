export default {
  async fetch(request) {
    const url = new URL(request.url);
    url.hostname = "munvote.com";

    const newRequest = new Request(url.toString(), {
      method: request.method,
      headers: request.headers,
      body: request.body,
      redirect: "manual",
      cf: {
        cacheTtl: 0,
        cacheEverything: true,
        cacheKey: undefined,
      },
    });

    return fetch(newRequest, {
      cache: "no-store",
      cf: {
        cacheTtl: 0,
        cacheEverything: true,
      },
    });
  },
};
