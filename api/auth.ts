const fs = require("node:fs");
const path = require("node:path");
const jwt = require("jsonwebtoken");
const SteamAuth = require("../steamauth");

const steam = new SteamAuth({
  realm: "http://127.0.0.1:3000/",
  returnUrl: "http://127.0.0.1:3000/api/auth/return/",
  apiKey: global.tournament.data.keys.steam,
});

declare global {
  var getUserToken: (req: Request) => any;
}

global.getUserToken = function (req: Request) {
  try {
    const cookie = req.headers.get("Cookie");
    if (!cookie) return null;

    const cookies = cookie.split(";").map((c) => c.trim());
    const token = cookies.find((c) => c.startsWith("steamtoken="));
    if (!token) return null;

    return jwt.verify(token.split("=")[1], global.tournament.data.keys.jwt);
  } catch (e) {
    return null;
  }
};

module.exports = async function (args: any[string], req: Request) {
  if (req.method === "GET") {
    if (args.length === 0) {
      return new Response("No action specified", { status: 400 });
    }

    const action = args[0];

    switch (action) {
      case "login":
        const url = await steam.getRedirectUrl();
        return Response.redirect(url, 302);

      case "return":
        const user = await steam.authenticate(req);
        const token = jwt.sign(user, global.tournament.data.keys.jwt);
        const headers = new Headers({
          "Set-Cookie": `steamtoken=${token}; Path=/; HttpOnly; Max-Age=86400`,
          Location: "/",
        });
        return new Response(null, { headers, status: 302 });

      case "logout":
        const newHeaders = new Headers({
          "Set-Cookie": "steamtoken=; Path=/; HttpOnly; Max-Age=0",
          Location: "/",
        });
        return new Response(null, { headers: newHeaders });

      default:
        return new Response("Invalid action", { status: 400 });
    }
  }
};
