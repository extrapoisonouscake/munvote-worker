export default {
  async fetch(request) {
    const originalUrl = new URL(request.url);
    const targetUrl = `https://munvote.com${originalUrl.pathname}${originalUrl.search}`;

    return fetch(targetUrl, {
      method: request.method,
      headers: request.headers,
      body: request.body,
      redirect: "follow",
    });
  },
};
