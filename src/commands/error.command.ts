import { SlashCommandBuilder } from "discord.js";
import { Command } from "../handlers/command.handler";

export const errorCommand: Command = {
  data: new SlashCommandBuilder() // https://old.discordjs.dev/#/docs/builders/main/class/SlashCommandBuilder
    .setName("error")
    .setDescription("test error handling"),
  async execute(interaction) {
    return Error("aaa");
    interaction.reply("test");
  },
};
