import * as color from "colorette";
import { Client, EmbedBuilder, time, inlineCode } from "discord.js";
import { Handlers } from "./handlers/_handlers";
import {
  reloadGlobalSlashCommands,
  reloadGuildSlashCommands,
} from "./handlers/command.handler";
import config from "../config.toml";

export const client = new Client({
  intents: ["Guilds", "GuildVoiceStates"],
});

console.time(color.blueBright("Bot is ready"));
client.on("ready", async (client) => {
  console.timeEnd(color.blueBright("Bot is ready"));
  console.log(
    `Authenticated as ${color.cyanBright(client.user.tag)} ${color.gray(
      client.user.toString(),
    )}`,
  );

  if (!config.status_channel_id) return;

  const channel = await client.channels.fetch(config.status_channel_id);
  if (!channel || !channel.isTextBased()) return;

  const embed = new EmbedBuilder({
    title: "Bot is ready",
    fields: [
      {
        inline: true,
        name: "startup time",
        value: time(new Date()),
      },
      {
        inline: true,
        name: "environment",
        value: inlineCode(process.env.NODE_ENV ?? "production"),
      },
      {
        inline: true,
        name: "os",
        value: process.platform,
      },
    ],
  });
  channel.send({ embeds: [embed] });
});

for (const handler of Handlers) {
  handler(client);
}

if (config.guild_id) await reloadGuildSlashCommands(config.guild_id);
else await reloadGlobalSlashCommands();

client.login(Bun.env.DISCORD_TOKEN);
