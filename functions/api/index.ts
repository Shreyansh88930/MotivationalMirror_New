import * as functions from "firebase-functions";
import express, { Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import path from "path";
// The following import was causing issues by pulling client-side Vite code into the server bundle.
// import { log } from "../../client/vite";

const server = express();

// Use express middleware to parse JSON and URL-encoded bodies
server.use(express.json());
server.use(express.urlencoded({ extended: false }));

/**
 * Logger middleware for API requests.
 * It logs request details and captured JSON responses to the console.
 */
server.use((req, res, next) => {
  const start = Date.now();
  // Renamed 'path' to 'requestPath' to avoid conflict with the 'path' module import.
  const requestPath = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  // Intercept res.json to capture the response body for logging
  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    // Call the original res.json method to send the response
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  // Log request details when the response finishes
  res.on("finish", () => {
    const duration = Date.now() - start;
    // Only log API requests
    if (requestPath.startsWith("/api")) {
      let logLine = `${req.method} ${requestPath} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        // Append the JSON response to the log line if available
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      // Truncate long log lines for readability
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }
      // Use console.log for server-side logging. Firebase Functions automatically
      // sends console.log output to Cloud Logging.
      console.log(logLine);
      // For more structured logging, consider using functions.logger.info(logLine);
    }
  });

  next(); // Continue to the next middleware or route handler
});

// Register API routes (e.g., from posts.ts, storage.ts)
registerRoutes(server);

/**
 * Error Handling Middleware.
 * This middleware catches errors thrown by preceding middleware or route handlers.
 */
server.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  // Determine the appropriate status code, defaulting to 500 (Internal Server Error)
  const status = err.status || err.statusCode || 500;
  // Get the error message, defaulting to a generic message
  const message = err.message || "Internal Server Error";

  // Send the error response to the client
  res.status(status).json({ message });

  // Log the error on the server side for debugging.
  // Do NOT re-throw the error after sending a response, as it can lead to unhandled
  // promise rejections and crashes in a serverless environment.
  console.error("API Error:", err);
});

/**
 * Serve static files from Vite's build output.
 * IMPORTANT: When deploying to Firebase, static assets (your client-side build)
 * are typically served by Firebase Hosting, not directly by the Firebase Function.
 * This section is primarily useful for local development or if you're deploying
 * your function to a different hosting environment that needs to serve static files.
 */
server.use(
  "/static", // Define the URL path for serving static assets
  express.static(path.resolve(__dirname, "../../client/dist/public")) // Path to your client's public build output
);

/**
 * Helper function to serve static files.
 * This is redundant if already using the server.use above, but kept to match original structure.
 */
const serveStatic = (server: any) => {
  // Ensure the `dist/public` folder is served correctly for production.
  // As noted above, this is usually handled by Firebase Hosting.
  server.use(express.static(path.resolve(__dirname, "../../client/dist/public")));
};

serveStatic(server);

// Export the Express app as a Firebase HTTPS function.
// This makes your Express application callable via an HTTP endpoint provided by Firebase.
export const api = functions.https.onRequest(server);
