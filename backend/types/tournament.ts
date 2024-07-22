import type { BunFile } from "bun";
import SteamAuth from "./steamauth";

class Tournament {
  file: Record<string, BunFile>;
  data: Record<string, any>;
  name: string;
  api: Record<string, any>;
  util: Record<string, Record<string, Function>>;
  keys: Record<string, any>;
  steam: SteamAuth;

  constructor(
    name: string,
    keys: any,
    steamrealm: string,
    steamreturn: string
  ) {
    this.file = {};
    this.data = {};
    this.name = name;
    this.api = {};
    this.util = {};
    this.keys = keys;
    this.steam = new SteamAuth({
      realm: steamrealm,
      returnUrl: steamreturn,
      apiKey: keys.steam,
    });
  }
}

export default Tournament;
