import {
  Colors,
  CommandInteraction,
  EmbedBuilder,
  REST,
  RESTGetAPIOAuth2CurrentApplicationResult,
  Routes,
  SlashCommandBuilder,
} from "discord.js";
import { Handler } from "./_handlers";
import { Commands } from "../commands/_commands";
import * as color from "colorette";

if (!process.env.DISCORD_TOKEN) throw Error("Discord token not specified");

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

export interface Command {
  // create an interface accessible from another files used to create commands
  data: SlashCommandBuilder;
  execute: (interaction: CommandInteraction) => unknown;
}

const commandMap = new Map<string, Command>(
  Commands.map((cmd) => [cmd.data.name, cmd])
);
console.log(color.bgWhite("Command List:"));
for (const command of commandMap) {
  console.log(color.bold(command[0]));
  console.log("↪ " + color.gray(command[1].data.description));
}

console.log();

export const commandHandler: Handler = (client) => {
  client.on("interactionCreate", (interaction) => {
    if (!interaction.isCommand()) return;
    if (!commandMap.has(interaction.commandName)) return;
    try {
      commandMap.get(interaction.commandName)!.execute(interaction);
    } catch (error) {
      console.error(error);
      const resEmbed = new EmbedBuilder({
        title: "There was an error during command execution",
        color: 0xff0000,
      });
      (interaction.replied ? interaction.followUp : interaction.reply)({
        embeds: [resEmbed],
        ephemeral: true,
      });
    }
  });
};

export async function reloadGlobalSlashCommands() {
  try {
    console.log(
      color.bgYellowBright(
        `Started refreshing ${Commands.length} application (/) commands.`
      )
    );
    console.time(color.yellowBright("Reloaded global commands"));

    const { id: appId } = (await rest.get(
      Routes.oauth2CurrentApplication()
    )) as RESTGetAPIOAuth2CurrentApplicationResult;

    await rest.put(Routes.applicationCommands(appId), {
      body: Commands.map((commandList) => commandList.data.toJSON()),
    });

    console.log(`Successfully reloaded global application (/) commands.`);
    console.timeEnd(color.yellowBright("Reloaded global commands"));
  } catch (error) {
    console.error(error);
  }
}
