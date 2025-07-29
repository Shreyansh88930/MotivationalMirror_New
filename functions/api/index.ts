// Remove Firebase Functions specific import
// import * as functions from "firebase-functions";
import express, { Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
// path is still needed if you use it within registerRoutes or other function logic
// but not for serving static files directly in this Express app for Vercel.
// import path from "path"; // Keep if needed elsewhere in your functions logic

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
  const requestPath = req.path; // Renamed 'path' to 'requestPath' to avoid conflict
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  // Intercept res.json to capture the response body for logging
  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  // Log request details when the response finishes
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (requestPath.startsWith("/api")) {
      let logLine = `${req.method} ${requestPath} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }
      console.log(logLine); // Use console.log for Vercel logs
    }
  });

  next(); // Continue to the next middleware or route handler
});

// Register API routes
registerRoutes(server);

/**
 * Error Handling Middleware.
 * This middleware catches errors thrown by preceding middleware or route handlers.
 */
server.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(status).json({ message });
  console.error("API Error:", err); // Log error to Vercel logs
});

// IMPORTANT: Remove static file serving from the Express app for Vercel.
// Vercel Hosting handles serving your client-side assets (dist/client) directly.
// The function should only handle API requests.
/*
server.use(
  "/static",
  express.static(path.resolve(__dirname, "../../client/dist/public"))
);

const serveStatic = (server: any) => {
  server.use(express.static(path.resolve(__dirname, "../../client/dist/public")));
};
serveStatic(server);
*/

// For Vercel Serverless Functions, you export the Express app directly.
// Vercel will wrap this Express app to handle incoming requests.
export default server;
