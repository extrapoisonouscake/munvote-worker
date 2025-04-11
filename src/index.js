export default {
  async fetch(request) {
    // Rewrite the request URL to munvote.com
    const url = new URL(request.url);
    url.hostname = "munvote.com";

    // Forward the request to munvote.com
    const response = await fetch(url.toString(), request);
    // Return the origin response directly
    return response;
  },
};
addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  url.hostname = "munvote.com"; // Update this with the correct domain

  // Create a new request with all the headers and the method, but no caching
  const newRequest = new Request(url.toString(), {
    method: request.method,
    headers: request.headers,
    body: request.body,
    redirect: "manual",
    cf: {
      cacheTtl: 0, // Disable cache
      cacheEverything: true, // Cache everything in the worker
      cacheKey: undefined, // Ignore cached keys to ensure a fresh request
    },
  });

  // Fetch the updated resource from the origin, disable cache
  const response = await fetch(newRequest, {
    cache: "no-store", // Ensure no cache is used
    cf: {
      cacheTtl: 0, // Disable cache
      cacheEverything: true, // Cache everything, but will be overridden by "no-store"
    },
  });

  return response;
}
