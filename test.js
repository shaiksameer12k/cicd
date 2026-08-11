// Minimal smoke test - no test framework dependency needed for a POC.
// Starts the server, hits /health, checks the response, then exits.
// This is what the CI pipeline runs before allowing a deploy.

const http = require("http");
const app = require("./server.js");

const PORT = 3999;
const server = app.listen(PORT, () => {
  http.get(`http://localhost:${PORT}/health`, (res) => {
    let data = "";
    res.on("data", (chunk) => (data += chunk));
    res.on("end", () => {
      const parsed = JSON.parse(data);
      if (res.statusCode === 200 && parsed.status === "ok") {
        console.log("PASS: /health returned 200 and status ok");
        server.close(() => process.exit(0));
      } else {
        console.error("FAIL: unexpected response from /health", res.statusCode, data);
        server.close(() => process.exit(1));
      }
    });
  }).on("error", (err) => {
    console.error("FAIL: request error", err);
    server.close(() => process.exit(1));
  });
});