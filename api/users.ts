const fs = require("fs");
const path = require("path");

module.exports = async function (args: any[string], req: Request) {
  if (req.method == "GET") {
    if (args.length == 0) {
      return new Response("No action specified", { status: 400 });
    }

    const action = args[0];

    switch (action) {
      case "whoami":
        const user = getUserToken(req);
        if (!user) return new Response("Not logged in", { status: 401 });
        const useraccount = tournament.data.users.find(
          (u: any) => u.steamid == user.steamid
        );
        if (!useraccount)
          return new Response("User not found", { status: 404 }); //TODO: add account create thing
        return useraccount;

      default:
        return new Response("Invalid action", { status: 400 });
    }
  }
};
