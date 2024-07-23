import { Command } from "../handlers/command.handler";
import { errorCommand } from "./error.command";
import { joinCommand } from "./join.command";
import { pingCommand } from "./ping.command";
import { playStreamCommand } from "./playStream.command";

export const Commands: Command[] = [
  pingCommand,
  errorCommand,
  joinCommand,
  playStreamCommand,
];
