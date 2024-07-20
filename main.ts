const fs = require("node:fs");
const path = require("node:path");

//Global variable wrapper
declare global {
  var tournament: {};
}
global.tournament = { file: {}, data: {}, name: "tournament" };

const fetchHandler = async function (req: Request) {
  const url = new URL(req.url);
  const urlPath = url.pathname.split("/").slice(1);
  const userAgent = req.headers.get("User-Agent");

  return new Response("temp");
};

const server = Bun.serve({
  port: 3000,
  fetch: fetchHandler,
});

console.log("Server running on port 3000");
