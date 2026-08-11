const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

// Health check endpoint - CI/CD and load balancers ping this to confirm the app is alive
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// A simple status endpoint that reports which environment / version is running.
// This is the endpoint you hit after deployment to confirm the RIGHT version reached UAT.
app.get("/api/status", (req, res) => {
  res.status(200).json({
    service: "cicd-uat-poc",
    environment: process.env.NODE_ENV || "development",
    version: process.env.APP_VERSION || "local-dev",
    message: "If you can see this on UAT, the pipeline worked.",
  });
});

app.get("/", (req, res) => {
  res.send("CI/CD UAT POC is running. Try /health or /api/status");
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

module.exports = app;