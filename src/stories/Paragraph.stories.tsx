import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import Paragraph from "../components/Paragraph";

export default {
  title: "Components/Paragraph", // El título que aparecerá en Storybook
  component: Paragraph,
  argTypes: {
    variant: {
      control: {
        type: "select",
        options: ["lead", "tiny"], // Variaciones disponibles
      },
    },
  },
} as Meta;
//@ts-ignore
const Template: StoryObj<{ variant?: "lead" | "tiny" }> = (args) => (
  <Paragraph {...args}>Este es un párrafo de ejemplo.</Paragraph>
);
//@ts-ignore
export const Lead = Template.bind({});
Lead.args = {
  variant: "lead",
};
//@ts-ignore
export const Normal = Template.bind({});
Normal.args = {
  variant: undefined,
};
//@ts-ignore
export const Tiny = Template.bind({});
Tiny.args = {
  variant: "tiny",
};
