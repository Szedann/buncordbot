import { GuildMember, SlashCommandBuilder, channelMention } from "discord.js";
import { Command } from "../handlers/command.handler";
import GuildVoiceManager from "../handlers/voice.handler";
import { response, ResponseTypes } from "../utils/commands";

export const joinCommand: Command = {
  data: new SlashCommandBuilder() // https://old.discordjs.dev/#/docs/builders/main/class/SlashCommandBuilder
    .setName("join")
    .setDescription("check dependencies for voice"),
  async execute(interaction) {
    if (!interaction.guildId) return;
    if (interaction.member?.pending) return;
    const guildVoice = new GuildVoiceManager(interaction.guildId);
    const channel = (interaction.member as GuildMember).voice.channel;
    if (!channel)
      return interaction.reply({
        content: "you are not connected to a voice channel.",
        ephemeral: true,
      });
    guildVoice.join(channel);
    interaction.reply(
      response(
        ResponseTypes.Success,
        true,
        "",
        `connected to ${channelMention(channel.id)}`,
      ),
    );
  },
};
