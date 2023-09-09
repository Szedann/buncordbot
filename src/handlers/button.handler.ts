import {
  ButtonBuilder,
  ButtonInteraction,
  Events,
  InteractionButtonComponentData,
} from "discord.js";
import { Handler } from "./_handlers";
import { BaseSchema, Output, parse } from "valibot";
import { error } from "console";

// This code might be a crime against humanity
// at least I think it works and gives you types and runtime validation

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const buttonMap = new Map<string, Button<BaseSchema<any, any>>>();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class Button<ArgsType extends BaseSchema<any, any>> {
  id: string;
  args?: ArgsType;
  _onPress?: (interaction: ButtonInteraction, args: ArgsType) => unknown;
  constructor(id: string) {
    this.id = id;
    if (buttonMap.has(id)) throw Error(`Button ${id} is already defined`);
    buttonMap.set(id, this as unknown as Button<BaseSchema<any, any>>);
  }
  setArgs(args: ArgsType) {
    this.args = args;
    return this;
  }
  onPress(
    handler: (interaction: ButtonInteraction, args: Output<ArgsType>) => unknown
  ) {
    this._onPress = handler;
    return this;
  }

  button(
    data: Partial<InteractionButtonComponentData>,
    args: Output<ArgsType>
  ): ButtonBuilder {
    const button = new ButtonBuilder({
      ...data,
      customId: JSON.stringify({ id: this.id, args }),
    });
    return button;
  }
}

export const buttonHandler: Handler = (client) => {
  client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isButton()) return;
    const data = JSON.parse(interaction.customId);
    const args = data.args;
    if (!data.id) return;
    if (!buttonMap.has(data.id)) return;
    const button = buttonMap.get(data.id);
    if (!button?.args) throw error("No args set in button");
    const parsedArgs = parse(button.args, args);
    if (!button._onPress) return;
    button._onPress(interaction, parsedArgs);
  });
};

require("../buttons/_buttons");
