import http from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize, resolve } from "node:path";

const args = process.argv.slice(2);
const getArg = (name, fallback) => {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : fallback;
};
const host = getArg("--host", "127.0.0.1");
const port = Number(getArg("--port", "4174"));
const root = process.cwd();
const projectRoot = resolve(root, "..");
const projectRoutes = new Set([
  "heatmap",
  "bondsmap",
  "portfolio_manager_interactive",
  "mature_bonds_report",
  "statements"
]);
const sharedRoutes = new Set(["assets", "elements", "asset_cards"]);
const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".woff2": "font/woff2"
};

http.createServer(async (req, res) => {
  try {
    const requestPath = decodeURIComponent((req.url || "/").split("?")[0]);
    const cleanPath = normalize(requestPath).replace(/^[\/\\]+/, "");
    if (cleanPath.startsWith("..")) throw new Error("Unsafe path");
    const firstSegment = cleanPath.split(/[\/\\]/)[0];
    const isMainHeroAsset = cleanPath === "assets/quantis-water.png";
    const routeRoot = !isMainHeroAsset && (projectRoutes.has(firstSegment) || sharedRoutes.has(firstSegment)) ? projectRoot : root;
    let filePath = requestPath === "/" ? join(root, "index.html") : join(routeRoot, cleanPath);
    const info = await stat(filePath);
    if (info.isDirectory()) filePath = join(filePath, "index.html");
    const body = await readFile(filePath);
    res.writeHead(200, { "Content-Type": mime[extname(filePath)] || "application/octet-stream", "Cache-Control": "no-cache" });
    res.end(body);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
  }
}).listen(port, host, () => console.log(`Quantis is running on http://${host}:${port}`));
