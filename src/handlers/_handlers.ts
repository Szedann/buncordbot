import { Client } from "discord.js";
import { commandHandler } from "./command.handler";
import { voiceHandler } from "./voice.handler";

export type Handler = (client: Client) => unknown;

export const Handlers: Handler[] = [commandHandler, voiceHandler];
