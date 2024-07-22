const matches: Record<string, Function> = {};
module.exports = matches;

matches.list = async function () {
  return await tournament.util.sql.get("matches");
};

matches.get = async function (id: string) {
  const matches = await tournament.util.sql.get("matches");
  const match = matches.data.find((match: any) => match.id === id);
  if (!match) return tournament.util.output.error("Match not found", 404);
  return tournament.util.output.success(match);
};

matches.add = async function (data: any) {
  const res = await tournament.util.sql.add("matches", data);
  return res;
};

matches.update = async function (id: string, data: Record<string, any>) {
  const matches = await tournament.util.sql.get("matches");
  const match = matches.data.find((match: any) => match.id === id);
  if (!match) return tournament.util.output.error("Match not found", 404);

  const res = await tournament.util.sql.update("matches", { id: id }, data);
  return res;
};

matches.del = async function (id: string) {
  const matches = await tournament.util.sql.get("matches");
  const match = matches.data.find((match: any) => match.id === id);
  if (!match) return tournament.util.output.error("Match not found", 404);

  const res = await tournament.util.sql.del("matches", { id: id });
  return res;
};
