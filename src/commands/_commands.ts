import { Command } from "../handlers/command.handler";
import { errorCommand } from "./error.command";
import { pingCommand } from "./ping.command";
import { voiceDataCommand } from "./voice.command";

export const Commands: Command[] = [
  pingCommand,
  errorCommand,
  voiceDataCommand,
];
