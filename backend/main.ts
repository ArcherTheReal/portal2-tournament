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
global.db = new sqlite3.Database("./db/database.db", (err: any) => {
  if (err) {
    console.log(`Error connecting to db: ${err.message}`)
  } else {
    console.log(`Successfully connected to database`)
  }
})

//Global variable wrapper

interface Tournament {
  file: Record<string, unknown>;
  data: Record<string, unknown>;
  name: string;
  api: Record<string, any>;
  util: Record<string, unknown>;
  keys: Record<string, any>;
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
  keys: await Bun.file("./data/keys.json").json(),
};

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
  if (urlPath[0] === "api" && urlPath[1] === `v${global.api_version}`) {
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
      return Response.json({
        success: false,
        error: "API endpoint not found"
      }, {
        status: 500
      });
    }
  }

  return Response.json({
    success: false,
    error: "Endpoint not found"
  }, {
    status: 500
  })
};

const server = Bun.serve({
  port: global.PORT,
  fetch: fetchHandler,
});

console.log(`Server running on port ${global.PORT}`);
