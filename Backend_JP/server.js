// Backend_JP - minimal health-check service (Phase 2 of the JP portfolio split).
// Zero runtime dependencies. Binds 127.0.0.1 only (never 0.0.0.0).
// Ground rules: no database, no Prisma, nothing extracted from Reference.

const http = require("http");

const HOST = "127.0.0.1";
const PORT = Number(process.env.PORT) || 3001;

function sendJson(res, statusCode, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body),
    "Cache-Control": "no-store"
  });
  res.end(body);
}

const server = http.createServer((req, res) => {
  const urlPath = (req.url || "/").split("?")[0];

  if (urlPath === "/health") {
    if (req.method !== "GET") {
      sendJson(res, 405, { status: "error", error: "method_not_allowed", method: req.method });
      return;
    }
    sendJson(res, 200, {
      status: "ok",
      service: "Backend_JP",
      time: new Date().toISOString()
    });
    return;
  }

  sendJson(res, 404, { status: "error", error: "not_found", path: urlPath });
});

server.listen(PORT, HOST, () => {
  console.log("Backend_JP health service listening on http://" + HOST + ":" + PORT + "/health");
});

function shutdown(signal) {
  console.log("Received " + signal + ", closing server.");
  server.close(() => {
    console.log("Server closed.");
    process.exit(0);
  });
  setTimeout(() => process.exit(0), 2000).unref();
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
