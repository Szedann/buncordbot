import type { Command } from "../handlers/command.handler";
import { joinCommand } from "./join.command";
import { playCommand } from "./play.command";

export const Commands: Command[] = [joinCommand, playCommand];
