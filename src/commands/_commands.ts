import { Command } from "../handlers/command.handler";
import { errorCommand } from "./error.command";
import { pingCommand } from "./ping.command";

export const Commands: Command[] = [pingCommand, errorCommand];
