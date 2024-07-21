import Tournament from "./types/tournament";
import SteamAuth from "./types/steamauth";

const fs = require("fs");
const path = require("path");
declare global {
  var api_version: number;
  var PORT: number;
  var db: any;
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

declare global {
  var tournament: Tournament;
}

global.tournament = new Tournament(
  "tournament",
  await Bun.file("./keys.json").json()
);

tournament.steam = new SteamAuth({
  realm: `http://localhost:${global.PORT}/`,
  returnUrl: `http://localhost:${global.PORT}/api/v${global.api_version}/auth/return/`,
  apiKey: global.tournament.keys.steam,
});

//keys

fs.readdirSync(path.join(__dirname, "api")).forEach((file: string) => {
  if (file.endsWith(".ts")) {
    const name = file.slice(0, -3);
    tournament.api[name] = require(`./api/${name}`);
  }
});

const fetchHandler = async function (req: Request) {
  const url = new URL(req.url);
  const urlPath = url.pathname.split("/").slice(1).map(decodeURIComponent);
  const userAgent = req.headers.get("User-Agent");

  //api
  if (urlPath[0] === "api") {
    if (urlPath[1] !== `v${global.api_version}`)
      return new Response("Wrong API version", { status: 400 });

    const apiName = urlPath[2];
    const args = urlPath.slice(3);
    const api = tournament.api[apiName];
    if (api) {
      let output: Response;
      try {
        output = await api(args, req);
      } catch (e: any) {
        output = new Response("An error occured", { status: 500 });
      }

      if (output instanceof Response) return output;
      return Response.json(output);
    } else {
      return Response.json(
        {
          success: false,
          error: "API endpoint not found",
        },
        {
          status: 500,
        }
      );
    }
  }

  return Response.json(
    {
      success: false,
      error: "Endpoint not found",
    },
    {
      status: 500,
    }
  );
};

const server = Bun.serve({
  port: global.PORT,
  fetch: fetchHandler,
});

console.log(`Server running on port ${global.PORT}`);
