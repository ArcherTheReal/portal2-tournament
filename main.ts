import type { BunFile } from "bun";

const fs = require("fs");
const path = require("path");

//Global variable wrapper

interface Tournament {
  file: Record<string, BunFile>;
  data: Record<string, any>;
  name: string;
  api: Record<string, Function>;
  util: Record<string, Function>;
}
declare global {
  var tournament: Tournament;
}
global.tournament = {
  file: {},
  data: {},
  name: "tournament",
  api: {},
  util: {},
};

fs.readdirSync("./data").forEach((file: string) => {
  const name = file.split(".")[0];
  tournament.file[name] = Bun.file(`./data/${file}`);
  tournament.data[name] = JSON.parse(
    fs.readFileSync(`./data/${file}`, "utf-8")
  );
});

fs.readdirSync(path.join(__dirname, "api")).forEach((file: string) => {
  if (file.endsWith(".ts")) {
    const name = file.slice(0, -3);
    tournament.api[name] = require(`./api/${name}`);
  }
});

fs.readdirSync(path.join(__dirname, "util")).forEach((file: string) => {
  if (file.endsWith(".ts")) {
    const name = file.slice(0, -3);
    tournament.util[name] = require(`./util/${name}`);
  }
});

const fetchHandler = async function (req: Request) {
  const url = new URL(req.url);
  const urlPath = url.pathname.split("/").slice(1).map(decodeURIComponent);
  const userAgent = req.headers.get("User-Agent");

  //api
  if (urlPath[0] === "api") {
    const apiName = urlPath[1];
    const args = urlPath.slice(2);
    const api = tournament.api[apiName];
    if (api) {
      let output: any;
      try {
        output = await api(args, req);
      } catch (e: any) {
        output = new Response("An error occured", { status: 500 });
      }

      if (output instanceof Response) return output;
      return Response.json(output);
    } else {
      return new Response("API not found");
    }
  }

  if (urlPath[0] === "util") {
    if (req.method !== "POST" && false)
      //TODO: remove this
      return new Response("Method not allowed", { status: 405 });

    const user = await tournament.api.users(["whoami"], req);
    console.log(user);
    if (user.admin !== true)
      return new Response("Unauthorized", { status: 401 });

    const utilName = urlPath[1];
    const args = urlPath.slice(2);
    const util = tournament.util[utilName];
    if (util) {
      let output: any;
      try {
        output = await util(args);
      } catch (e: any) {
        output = "An error occured";
      }
      return Response.json(output);
    } else {
      return new Response("Util not found");
    }
  }
  return new Response("temp");
};

const server = Bun.serve({
  port: 3000,
  fetch: fetchHandler,
});

console.log("Server running on port 3000");
