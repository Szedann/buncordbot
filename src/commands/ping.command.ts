import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  SlashCommandBuilder,
} from "discord.js";
import { Command } from "../handlers/command.handler";
import { deleteButton } from "../buttons/delete.button";

export const pingCommand: Command = {
  data: new SlashCommandBuilder() // https://old.discordjs.dev/#/docs/builders/main/class/SlashCommandBuilder
    .setName("ping")
    .setDescription("check if the bot is working"),
  async execute(interaction) {
    interaction.reply({
      content: "pong",
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
