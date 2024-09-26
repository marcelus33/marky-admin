import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import Link from "../components/Link";

export default {
  title: "Components/Link", // Título que aparecerá en Storybook
  component: Link,
  argTypes: {
    variant: {
      control: {
        type: "select",
        options: ["primary", "secondary"], // Variaciones disponibles
      },
    },
    size: {
      control: {
        type: "select",
        options: ["large", "medium", "small"], // Tamaños disponibles
      },
    },
  },
} as Meta;

const Template: StoryFn<{
  variant?: "primary" | "secondary";
  size?: "large" | "medium" | "small";
  //@ts-ignore
}> = (args) => <Link {...args}>Este es un enlace de ejemplo.</Link>;

export const PrimaryLarge = Template.bind({});
PrimaryLarge.args = {
  variant: "primary",
  size: "large",
};

export const PrimaryMedium = Template.bind({});
PrimaryMedium.args = {
  variant: "primary",
  size: "medium",
};

export const PrimarySmall = Template.bind({});
PrimarySmall.args = {
  variant: "primary",
  size: "small",
};

export const SecondaryLarge = Template.bind({});
SecondaryLarge.args = {
  variant: "secondary",
  size: "large",
};

export const SecondaryMedium = Template.bind({});
SecondaryMedium.args = {
  variant: "secondary",
  size: "medium",
};

export const SecondarySmall = Template.bind({});
SecondarySmall.args = {
  variant: "secondary",
  size: "small",
};
