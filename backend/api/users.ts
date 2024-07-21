const fs = require("fs");
const path = require("path");

module.exports = async function (args: any[string], req: Request) {
  const getSql = "SELECT * FROM users";

  if (req.method == "GET") {
    if (args.length == 0) {
      return new Promise((resolve, reject) => {
        global.db.all(getSql, [], (err: any, data: any) => {
          if (err) {
            resolve(
              Response.json({
                success: false,
                error: err.message,
              })
            );
          } else {
            resolve(
              Response.json({
                success: true,
                data: data,
              })
            );
          }
        });
      });
    }

    const action = args[0];

    switch (action) {
      case "whoami":
        if (getUserToken(req) == null) {
          return Response.json({
            success: false,
            error: "User not found",
          });
        } else {
          return Response.json({
            success: true,
            user: getUserToken(req),
          });
        }

      default:
        return Response.json(
          {
            success: false,
            error: "Invalid action",
          },
          {
            status: 400,
          }
        );
    }
  }
};
