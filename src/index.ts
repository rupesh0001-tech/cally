import { serve } from "bun";
import index from "./index.html";

const server = serve({
  port: Number(process.env.PORT || 3000),
  hostname: "0.0.0.0",
  routes: {
    "/robots.txt": async () => {
      const file = Bun.file("./src/public/robots.txt");
      return new Response(file, {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    },

    "/sitemap.xml": async () => {
      const file = Bun.file("./src/public/sitemap.xml");
      return new Response(file, {
        headers: { "Content-Type": "application/xml; charset=utf-8" },
      });
    },

    "/dashboard-pc.png": async () => {
      return new Response(Bun.file("./src/public/dashboard-pc.png"));
    },
    "/phone-dashboard.png": async () => {
      return new Response(Bun.file("./src/public/phone-dashboard.png"));
    },
    "/booking page.png": async () => {
      return new Response(Bun.file("./src/public/booking page.png"));
    },
    "/booking%20page.png": async () => {
      return new Response(Bun.file("./src/public/booking page.png"));
    },

    // Serve index.html for all unmatched routes.
    "/*": index,

    "/api/hello": {
      async GET(req) {
        return Response.json({
          message: "Hello, world!",
          method: "GET",
        });
      },
      async PUT(req) {
        return Response.json({
          message: "Hello, world!",
          method: "PUT",
        });
      },
    },

    "/api/hello/:name": async req => {
      const name = req.params.name;
      return Response.json({
        message: `Hello, ${name}!`,
      });
    },
  },

  development: process.env.NODE_ENV !== "production" && {
    // Enable browser hot reloading in development
    hmr: true,

    // Echo console logs from the browser to the server
    console: true,
  },
});

console.log("VITE_CLERK_PUBLISHABLE_KEY in server:", process.env.VITE_CLERK_PUBLISHABLE_KEY);
console.log(`🚀 Server running at ${server.url}`);
