import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { Command } from "../handlers/command.handler";
import { createAudioResource } from "@discordjs/voice";
import GuildVoiceManager from "../handlers/voice.handler";
import { response, ResponseTypes } from "../utils/commands";

export const playStreamCommand: Command = {
  data: new SlashCommandBuilder() // https://old.discordjs.dev/#/docs/builders/main/class/SlashCommandBuilder
    .setName("playstream")
    .setDescription("check dependencies for voice")
    .addStringOption((option) =>
      option
        .setName("url")
        .setRequired(true)
        .setDescription("the url of the stream"),
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    if (!interaction.guildId) return;
    if (interaction.member?.pending) return;
    const guildVoice = new GuildVoiceManager(interaction.guildId);
    const url = interaction.options.get("url")?.value;
    if (typeof url != "string") return;

    const res = await fetch(url);

    if (!res.ok)
      return interaction.reply(
        response(ResponseTypes.Error, true, undefined, res.statusText),
      );

    try {
      //@ts-expect-error this type works fine for this purpose
      const resource = createAudioResource(res.body);
      guildVoice.play(resource);
      interaction.reply(response(ResponseTypes.Success));
    } catch {
      interaction.reply(
        response(
          ResponseTypes.Error,
          true,
          "Couldn't create audio resource",
          "make sure the url is correct",
        ),
      );
    }
  },
};
