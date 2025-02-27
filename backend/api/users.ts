const fs = require("fs");
const path = require("path");

module.exports = async function (args: any[string], req: Request) {
  const getSql = "SELECT * FROM users";

  if (req.method == "GET") {
    if (args.length == 0) {
      return new Promise((resolve, reject) => {
        global.db.all(getSql, [], (err: any, data: any) => {
          if (err) {
            resolve({
              success: false,
              error: err.message,
              status: 500,
            });
          } else {
            resolve({
              success: true,
              data: data,
            });
          }
        });
      });
    }

    const action = args[0];

    switch (action) {
      case "whoami":
        const sql = "SELECT * FROM users WHERE steamid = ?";
        const user = global.tournament.util.users.getUserToken(req);
        return new Promise((resolve, reject) => {
          if (user === null) {
            resolve({
              success: false,
              error: "User not authenticated",
              status: 401,
            });
          }
          db.get(sql, [user.steamid], (err: any, data: any) => {
            if (data === null) {
              resolve({
                success: false,
                error: "User not found",
                status: 404,
              });
            } else {
              resolve({
                success: true,
                data: {
                  id: data.id,
                  steamid: data.steamid,
                  admin: data.admin,
                  name: user.username,
                  steam_user: user
                },
              });
            }
          });
        });

      default:
        return new Promise((resolve, reject) => {
          resolve({
            success: false,
            error: "Invalid action",
            status: 400,
          });
        });
    }
  }
};
