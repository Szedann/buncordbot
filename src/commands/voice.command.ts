import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  SlashCommandBuilder,
  codeBlock,
} from "discord.js";
import { Command } from "../handlers/command.handler";
import { deleteButton } from "../buttons/delete.button";
import { generateDependencyReport } from "@discordjs/voice";

export const voiceDataCommand: Command = {
  data: new SlashCommandBuilder() // https://old.discordjs.dev/#/docs/builders/main/class/SlashCommandBuilder
    .setName("voicedata")
    .setDescription("check dependencies for voice"),
  async execute(interaction) {
    interaction.reply({
      content: codeBlock(generateDependencyReport()),
      components: [
        new ActionRowBuilder<ButtonBuilder>().addComponents(
          deleteButton
            .button({}, null)
            .setLabel("Delete")
            .setStyle(ButtonStyle.Danger)
        ),
      ],
    });
  },
};
