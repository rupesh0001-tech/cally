import { serve } from "bun";
import index from "./index.html";

const server = serve({
  port: Number(process.env.PORT || 3000),
  hostname: "0.0.0.0",
  async fetch(req) {
    const url = new URL(req.url);
    const pathname = url.pathname;

    // API Health check
    if (pathname === "/api/hello") {
      return Response.json({ message: "Cally Frontend Server OK" });
    }

    // Serve static assets (CSS, JS, images, fonts, robots, sitemap)
    if (pathname !== "/") {
      let file = Bun.file(`./dist${pathname}`);
      if (await file.exists()) {
        return new Response(file);
      }

      // Handle nested route asset requests (e.g. /book/user/slug/chunk-xxx.js -> ./dist/chunk-xxx.js)
      const filename = pathname.split("/").pop() || "";
      if (filename.includes(".")) {
        const distFile = Bun.file(`./dist/${filename}`);
        if (await distFile.exists()) {
          return new Response(distFile);
        }
        const publicFile = Bun.file(`./src/public/${filename}`);
        if (await publicFile.exists()) {
          return new Response(publicFile);
        }
      }

      file = Bun.file(`./src/public${pathname}`);
      if (await file.exists()) {
        return new Response(file);
      }
      file = Bun.file(`./src${pathname}`);
      if (await file.exists()) {
        return new Response(file);
      }
    }

    // Serve dist/index.html or index module for SPA routing
    const distIndex = Bun.file("./dist/index.html");
    if (await distIndex.exists()) {
      return new Response(distIndex, {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    return new Response(index, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  },
});

console.log(`🚀 Frontend server running at ${server.url}`);
