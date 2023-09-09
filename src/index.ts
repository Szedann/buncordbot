import * as color from "colorette";
import { Client, EmbedBuilder, time, inlineCode } from "discord.js";

const client = new Client({
  intents: ["Guilds"],
});

console.time("ready");
client.on("ready", async (readyClient) => {
  console.timeEnd("ready");
  console.log(`Logged in as ${color.green(readyClient.user.tag)}`);

  if (!process.env.STATUS_CHANNEL_ID) return;

  const channel = await client.channels.fetch(process.env.STATUS_CHANNEL_ID);
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

client.login(process.env.DISCORD_TOKEN);
