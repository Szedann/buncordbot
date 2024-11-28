import * as color from "colorette";
import { Client, EmbedBuilder, inlineCode, time } from "discord.js";
import config from "../config.toml";
import { Handlers } from "./handlers/_handlers";
import {
  reloadGlobalSlashCommands,
  reloadGuildSlashCommands,
} from "./handlers/command.handler";
import { object, parse, string, type InferOutput } from "valibot";

export const client = new Client({
  intents: ["Guilds", "GuildVoiceStates"],
});

const envVariables = object({
  DISCORD_TOKEN: string(),
});

try {
  parse(envVariables, Bun.env);
} catch (error) {
  throw `Environment variables missing: ${Object.keys(envVariables.entries)
    .filter(k => !Bun.env[k])
    .join(", ")}`;
}

declare global {
  namespace NodeJS {
    interface ProcessEnv extends InferOutput<typeof envVariables> {}
  }
}

console.time(color.blueBright("Bot is ready"));
client.on("ready", async client => {
  console.timeEnd(color.blueBright("Bot is ready"));
  console.log(
    `Authenticated as ${color.cyanBright(client.user.tag)} ${color.gray(
      client.user.toString(),
    )}`,
  );

  if (config.status_channel_id) {
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
  }
});

for (const handler of Handlers) {
  handler(client);
}

if (config.guild_id) await reloadGuildSlashCommands(config.guild_id);
else await reloadGlobalSlashCommands();

client.login(Bun.env.DISCORD_TOKEN);
