addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  // Construct the URL for the request
  let url = new URL(request.url);

  // Replace the hostname with munvote.com
  url.hostname = "munvote.com";

  // Generate a random query parameter to ensure cache bypass
  const randomQueryParam = `?nocache=${Math.random()
    .toString(36)
    .substring(2)}`;

  // Append the random query parameter to the URL
  url.search = randomQueryParam;
  console.log(url.toString());
  // Make the actual request to your origin (munvote.com)
  const response = await fetch(url.toString(), {
    method: request.method,
    headers: request.headers,
  });

  // Clone the response so we can modify headers
  const modifiedResponse = new Response(response.body, response);

  // Add headers to disable cache
  modifiedResponse.headers.set(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );
  modifiedResponse.headers.set("Pragma", "no-cache");
  modifiedResponse.headers.set("Expires", "0");

  // Return the modified response to the client
  return modifiedResponse;
}
