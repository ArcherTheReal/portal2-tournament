import Tournament from "./types/tournament";
import SteamAuth from "./types/steamauth";
import type { Database, sqlite3 } from "sqlite3";

const fs = require("fs");
const path = require("path");
declare global {
  var api_version: number;
  var PORT: number;
  var db: Database;
  var tournament: Tournament;
}
global.api_version = 1;
global.PORT = 8080;
const sqlite3 = require("sqlite3").verbose();
global.db = await new sqlite3.Database("./db/database.db", (err: any) => {
  if (err) {
    console.log(`Error connecting to db: ${err.message}`);
  } else {
    console.log(`Successfully connected to database`);
  }
});

//Global variable wrapper

global.tournament = new Tournament(
  "tournament",
  await Bun.file("./keys.json").json(),
  `http://localhost:${global.PORT}/`,
  `http://localhost:${global.PORT}/api/v${global.api_version}/auth/return/`
);

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
    if (urlPath[1] !== `v${global.api_version}`)
      return tournament.util.output.parse(tournament.util.output.error("Wrong API version", 400));

    const apiName = urlPath[2];
    const args = urlPath.slice(3);
    const api = tournament.api[apiName];
    if (api) {
      // const test = await tournament.api.users(["whoami"], req);
      // console.log(test);
      // console.log(tournament.steam.fetchIdentifier(test.data.steamid));
      let output: any;
      try {
        output = await api(args, req);
      } catch (e: any) {
        console.error(e);
        output = tournament.util.output.parse(tournament.util.output.error(e.message, 500));
      }

      // Set CORS headers
      const headers = new Headers();
      headers.set("Access-Control-Allow-Origin", "http://localhost:3000");
      headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
      headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
      headers.set("Access-Control-Allow-Credentials", "true");
      
      if (output instanceof Response) return output;
      let status = output.status || 200;
      delete output.status;
      return Response.json(output, { status: status, headers: headers });
    } else {
      return tournament.util.output.parse(tournament.util.output.error("API not found", 400));
    }
  }

  // Set CORS headers
  const headers = new Headers();
  headers.set("Access-Control-Allow-Origin", "http://localhost:3000");
  headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  headers.set("Access-Control-Allow-Credentials", "true");

  return tournament.util.output.parse(tournament.util.output.error("Invalid request", 400));
};

const server = Bun.serve({
  port: global.PORT,
  fetch: fetchHandler,
});

console.log(`Server running on port ${global.PORT}`);
