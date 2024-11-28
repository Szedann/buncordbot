import {
  CommandInteraction,
  REST,
  type RESTGetAPIOAuth2CurrentApplicationResult,
  Routes,
  SlashCommandBuilder,
  type SlashCommandOptionsOnlyBuilder,
} from "discord.js";
import type { Handler } from "./_handlers";
import { Commands } from "../commands/_commands";
import * as color from "colorette";
import { response, ResponseTypes } from "../utils/commands";

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

export interface Command {
  // create an interface accessible from another files used to create commands
  data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
  execute: (interaction: CommandInteraction) => unknown;
}

const commandMap = new Map<string, Command>(
  Commands.map(cmd => [cmd.data.name, cmd]),
);
console.log(color.bgWhite("Command List:"));
for (const command of commandMap) {
  console.log(color.bold(command[0]));
  console.log("↪ " + color.gray(command[1].data.description));
}

console.log();

export const commandHandler: Handler = client => {
  client.on("interactionCreate", async interaction => {
    if (!interaction.isCommand()) return;
    if (!commandMap.has(interaction.commandName)) return;
    try {
      await commandMap.get(interaction.commandName)!.execute(interaction);
    } catch (error) {
      console.error(error);
      (interaction.replied ? interaction.followUp : interaction.reply)(
        response(
          ResponseTypes.Error,
          true,
          "There was an error during command execution",
        ),
      );
    }
  });
};

export async function reloadGlobalSlashCommands() {
  try {
    console.time(color.yellowBright("Reloaded global commands"));

    const { id: appId } = (await rest.get(
      Routes.oauth2CurrentApplication(),
    )) as RESTGetAPIOAuth2CurrentApplicationResult;

    await rest.put(Routes.applicationCommands(appId), {
      body: Commands.map(commandList => commandList.data.toJSON()),
    });

    console.timeEnd(color.yellowBright("Reloaded global commands"));
  } catch (error) {
    console.error(error);
  }
}

export async function reloadGuildSlashCommands(guildId: string) {
  try {
    console.time(color.yellowBright("Reloaded guild commands"));

    const { id: appId } = (await rest.get(
      Routes.oauth2CurrentApplication(),
    )) as RESTGetAPIOAuth2CurrentApplicationResult;

    await rest.put(Routes.applicationGuildCommands(appId, guildId), {
      body: Commands.map(commandList => commandList.data.toJSON()),
    });

    console.timeEnd(color.yellowBright("Reloaded guild commands"));
  } catch (error) {
    console.error(error);
  }
}
