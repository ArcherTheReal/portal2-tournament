const fs = require("node:fs");
const path = require("node:path");
const jwt = require("jsonwebtoken");

module.exports = async function (args: any[string], req: Request) {
  if (req.method === "GET") {
    if (args.length == 0) {
      return {
        success: false,
        error: "No action specified",
        status: 400,
      };
    }

    const action = args[0];

    switch (action) {
      case "login":
        const url = await tournament.steam.getRedirectUrl();
        return Response.redirect(url, 302);

      case "return":
        const user = await tournament.steam.authenticate(req);
        const token = jwt.sign(user, global.tournament.keys.jwt);
        const headers = new Headers({
          "Set-Cookie": `steamtoken=${token}; Path=/; HttpOnly; Max-Age=86400; sameSite='None'`,
          Location: "http://localhost:3000/",
        });
        const sql = "INSERT INTO users (steamid) VALUES (?)";

        global.db.run(sql, [user.steamid], (err: any, data: any) => {
          if (err) {
            return Response.json({
              success: false,
              error: err.message,
            });
          }
          console.log("Successfully inserted user into db");
        });

        return new Response(null, { headers, status: 302 });

      case "logout":
        const newHeaders = new Headers({
          "Set-Cookie": "steamtoken=; Path=/; HttpOnly; Max-Age=0",
          Location: "/",
        });
        newHeaders.set("Access-Control-Allow-Origin", "http://localhost:3000");
        newHeaders.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        newHeaders.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
        newHeaders.set("Access-Control-Allow-Credentials", "true");
        return new Response(null, { headers: newHeaders, status: 302 });

      default:
        return {
          success: false,
          error: "Invalid action",
          status: 400,
        };
    }
  }
};
