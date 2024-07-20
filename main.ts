const fs = require("fs");
const path = require("path");

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
  if (urlPath[0] === "api") {
    const apiName = urlPath[1];
    const args = urlPath.slice(2);
    const api = tournament.api[apiName];
    if (api) {
      let output: Response;
      try {
        output = await api(args, req);
      } catch (e: any) {
        output = new Response("An error occured", { status: 500 });
      }

      return output;
    } else {
      return new Response("API not found");
    }
  }

  return new Response("temp");
};

const server = Bun.serve({
  port: 3000,
  fetch: fetchHandler,
});

console.log("Server running on port 3000");
