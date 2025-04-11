addEventListener("fetch", (event) => {
  if (event.request.headers.get("Upgrade") === "websocket") {
    const url = new URL(event.request.url);

    // Extract the path and query parameters from the URL
    const path = url.pathname; // e.g., /api/socket.io
    const queryParams = url.search; // e.g., ?EIO=4&transport=websocket&sid=99o4j_ug0xsuD42lAAAD

    // Forward the WebSocket connection to your WebSocket server
    // Assuming your WebSocket server is running at ws://your-websocket-server.com
    const webSocketUrl = `wss://munvote.com${path}${queryParams}`;
    console.log(webSocketUrl);
    // Create a WebSocket upgrade request
    event.respondWith(handleWebSocket(event.request, webSocketUrl));
  } else {
    event.respondWith(handleRequest(event.request));
  }
});

async function handleRequest(request) {
  // Construct the URL for the request
  let url = new URL(request.url);

  // Replace the hostname with munvote.com
  url.hostname = "munvote.com";
  const isGet = request.method === "GET";
  // Generate a random query parameter to ensure cache bypass

  // Append the random query parameter to the URL
  if (isGet) {
    const params = new URLSearchParams(url.search);

    // Add the random 'nocache' query parameter to the URL
    params.set("nocache", Math.random().toString(36).substring(2));

    // Set the modified search parameters back to the URL
    url.search = params.toString();
  }
  console.log(url.toString());
  // Make the actual request to your origin (munvote.com)
  const response = await fetch(url.toString(), {
    method: request.method,
    headers: request.headers,
    body: isGet || request.method === "HEAD" ? null : request.body,
    redirect: "follow",
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
async function handleWebSocket(req, webSocketUrl) {
  const upgradeHeaders = {
    Upgrade: "websocket",
    Connection: "Upgrade",
  };

  const ws = await WebSocketPair.from(req);
  const [clientSocket, serverSocket] = ws;

  // Connect the WebSocket client to your WebSocket server
  const serverWebSocket = new WebSocket(webSocketUrl);

  // Forward messages from the client to the WebSocket server
  clientSocket.accept();
  serverWebSocket.on("message", (message) => {
    clientSocket.send(message);
  });

  // Forward messages from the WebSocket server to the client
  clientSocket.onmessage = (event) => {
    serverWebSocket.send(event.data);
  };

  // Close the WebSocket when the client disconnects
  clientSocket.onclose = () => {
    serverWebSocket.close();
  };

  // Close the WebSocket when the server disconnects
  serverWebSocket.onclose = () => {
    clientSocket.close();
  };

  return new Response(null, {
    status: 101, // HTTP 101 WebSocket Protocol Handshake
    headers: upgradeHeaders,
    webSocket: true,
  });
}
