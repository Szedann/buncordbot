import { Client } from "discord.js";
import { commandHandler } from "./command.handler";
import { buttonHandler } from "./button.handler";

export type Handler = (client: Client) => unknown;

export const Handlers: Handler[] = [commandHandler, buttonHandler];
