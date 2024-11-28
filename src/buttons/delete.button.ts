import { nullType } from "valibot";
import { Button } from "../handlers/button.handler";

const inter = nullType();

export const deleteButton = new Button<typeof inter>("delete")
  .setArgs(inter)
  .onPress(interaction => {
    if (interaction.user.id != interaction.message.interaction?.user.id) return;
    interaction.message.delete();
  });
