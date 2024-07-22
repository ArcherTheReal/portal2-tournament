const jwt = require("jsonwebtoken");

const users: Record<string, Function> = {};
module.exports = users;

users.list = async function () {
  return await tournament.util.sql.get("users");
};

users.getUserToken = function (req: Request) {
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

users.get = async function (id: string) {
  const users = await tournament.util.sql.get("users");
  const user = users.data.find((user: any) => user.steamid === id);
  if (!user) return tournament.util.output.error("User not found", 404);
  return tournament.util.output.success(user);
};

users.add = async function (id: string) {
  const users = await tournament.util.sql.get("users");
  const user = users.data.find((user: any) => user.steamid === id);
  if (user) return tournament.util.output.error("User already exists", 400);

  const res = await tournament.util.sql.add("users", { steamid: id });
  return res;
};

users.update = async function (id: string, data: Record<string, any>) {
  const users = await tournament.util.sql.get("users");
  const user = users.data.find((user: any) => user.steamid === id);
  if (!user) return tournament.util.output.error("User not found", 404);

  const res = await tournament.util.sql.update("users", { steamid: id }, data);
  return res;
};

users.del = async function (id: string) {
  const users = await tournament.util.sql.get("users");
  const user = users.data.find((user: any) => user.steamid === id);
  if (!user) return tournament.util.output.error("User not found", 404);

  const res = await tournament.util.sql.del("users", { steamid: id });
  return res;
};
