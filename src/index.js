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
