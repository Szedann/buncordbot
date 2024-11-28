import {
  GuildMember,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
import type { Command } from "../handlers/command.handler";
import { createAudioResource } from "@discordjs/voice";
import GuildVoiceManager from "../handlers/voice.handler";
import { response, ResponseTypes } from "../utils/commands";
import ytdl from "ytdl-core";

export const playCommand: Command = {
  data: new SlashCommandBuilder() // https://old.discordjs.dev/#/docs/builders/main/class/SlashCommandBuilder
    .setName("play")
    .setDescription("check dependencies for voice")
    .addStringOption(option =>
      option
        .setName("name")
        .setRequired(true)
        .setDescription("the url or name of the track"),
    )
    .addStringOption(option =>
      option
        .setName("provider")
        .setDescription("provider for the audio")
        .addChoices(
          { name: "YouTube", value: "youtube" },
          { name: "Spotify", value: "spotify" },
        ),
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    if (!interaction.guildId) return;
    if (interaction.member?.pending) return;
    const guildVoice = new GuildVoiceManager(interaction.guildId);
    const url = interaction.options.get("name")?.value;
    if (typeof url != "string") return;

    const res = ytdl.validateURL(url)
      ? ytdl(url, { filter: "audioonly" })
      : (await fetch(url)).body;

    console.log(res);

    // if (!res.ok)
    //   return interaction.reply(
    //     response(ResponseTypes.Error, true, undefined, res.statusText),
    //   );

    try {
      //@ts-expect-error ReadableStream works fine for this purpose
      const resource = createAudioResource(res);
      console.log(resource.metadata);
      guildVoice.play(
        resource,
        (interaction.member as GuildMember).voice.channel ?? undefined,
      );
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
