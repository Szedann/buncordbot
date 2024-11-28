import { Colors, EmbedBuilder, type InteractionReplyOptions } from "discord.js";

export const ResponseTypes = {
  Error: {
    color: Colors.Red,
    name: "Error",
  },
  Success: {
    color: Colors.Green,
    name: "Success",
  },
  Info: {
    color: Colors.Blurple,
    name: "Info",
  },
} as const;

type ObjectValues<T> = T[keyof T];

export type ResponseTypes = ObjectValues<typeof ResponseTypes>;

export function responseEmbed(
  type: ResponseTypes,
  title?: string,
  description?: string,
) {
  return new EmbedBuilder({
    title: title ?? type.name,
    description,
    color: type.color,
  });
}

export function response(
  type: ResponseTypes,
  ephemeral: boolean = true,
  title?: string,
  description?: string,
): InteractionReplyOptions {
  return {
    embeds: [responseEmbed(type, title, description)],
    ephemeral,
  };
}
