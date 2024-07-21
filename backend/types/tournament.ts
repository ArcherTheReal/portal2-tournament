import type { BunFile } from "bun";
import SteamAuth from "./steamauth";

class Tournament {
  file: Record<string, BunFile>;
  data: Record<string, any>;
  name: string;
  api: Record<string, any>;
  util: Record<string, unknown>;
  keys: Record<string, any>;
  steam: SteamAuth;

  constructor(name: string, keys: any, steam: SteamAuth) {
    this.file = {};
    this.data = {};
    this.name = name;
    this.api = {};
    this.util = {};
    this.keys = keys;
    this.steam = steam;
  }
}

export default Tournament;
