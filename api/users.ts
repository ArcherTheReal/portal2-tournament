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
        return getUserToken(req);

      default:
        return new Response("Invalid action", { status: 400 });
    }
  }
};
