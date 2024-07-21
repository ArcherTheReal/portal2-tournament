const fs = require("node:fs");
const path = require("node:path");
const jwt = require("jsonwebtoken");
const SteamAuth = require("../steamauth");

const steam = new SteamAuth({
  realm: `http://172.20.10.3:${global.PORT}/`,
  returnUrl: `http://172.20.10.3:${global.PORT}/api/v${global.api_version}/auth/return/`,
  apiKey: global.tournament.keys.steam,
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

    return jwt.verify(token.split("=")[1], global.tournament.keys.jwt);
  } catch (e) {
    return null;
  }
};

module.exports = async function (args: any[string], req: Request) {
  const getSql = "SELECT * FROM users"

  if (req.method === "GET") {
    if (args.length == 0) {
      return Response.json({
        success: false,
        error: "No action specified"
      }, {
        status: 400
      });
    }

    const action = args[0];

    switch (action) {
      case "login":
        const url = await steam.getRedirectUrl();
        return Response.redirect(url, 302);

      case "return":
        const user = await steam.authenticate(req);
        console.log(user);
        const token = jwt.sign(user, global.tournament.keys.jwt);
        const headers = new Headers({
          "Set-Cookie": `steamtoken=${token}; Path=/; HttpOnly; Max-Age=86400`,
          Location: "/",
        });
        const sql = "INSERT INTO users (id, steam_id, is_admin) VALUES (?, ?, 0)"
        global.db.all(getSql, [], (err: any, data: any) => {
          if (err) {
            return Response.json({
              success: false,
              error: err.message
            })
          }

          let nextID
          if (data.length > 0) {
            nextID = data[data.length - 1].id + 1
          } else {
            nextID = 1;
          }

          global.db.run(sql, [nextID, user.steamid], (err: any, data: any) => {
            if (err) {
              return Response.json({
                success: false,
                error: err.message
              })
            }
            console.log("Successfully inserted user into db")
          })
        })
        return new Response(null, { headers, status: 302 });

      case "logout":
        const newHeaders = new Headers({
          "Set-Cookie": "steamtoken=; Path=/; HttpOnly; Max-Age=0",
          Location: "/",
        });
        return new Response(null, { headers: newHeaders });

      default:
        return Response.json({
          success: false,
          error: "Invalid action"
        }, {
          status: 400
        });
    }
  }
};
