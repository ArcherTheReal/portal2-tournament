const fs = require("fs");
const path = require("path");

module.exports = async function (args: any[string], req: Request) {
    if (req.method == "GET") {
        const tokenFull = req.headers.get("cookie")
        const token = tokenFull?.split("steamtoken=")[1]
        const response = {
            success: token != undefined ? true : false,
            data: token != undefined ? {
                token: token
            } : {
                error: "Token not found"
            }
        };

        // Set CORS headers
        const headers = new Headers();
        headers.set("Access-Control-Allow-Origin", "http://localhost:3000");
        headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
        headers.set("Access-Control-Allow-Credentials", "true");

        return Response.json(response, {
            status: 200,
            headers: headers,
        });
    }
}
