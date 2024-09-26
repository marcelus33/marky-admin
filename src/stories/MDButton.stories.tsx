import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import Button, { ButtonProps } from "@mui/material/Button";
import GoogleIcon from "@mui/icons-material/Google";

// Define the story metadata
export default {
  title: "Material UI/Button",
  component: Button,
  argTypes: {
    onClick: { action: "clicked" },
  },
} as Meta<typeof Button>;

// Template for the Button component stories
const Template: StoryFn<ButtonProps> = (args) => (
  <Button {...args}>Acceder a mi cuenta comercial</Button>
);

// Primary button story
export const Primary = Template.bind({});
Primary.args = {
  variant: "contained",
  color: "primary",
};

// Secondary button story
export const Secondary = Template.bind({});
Secondary.args = {
  variant: "contained",
  color: "secondary",
};

export const SecondaryWithIcon = () => (
  <Button variant="contained" color="secondary" startIcon={<GoogleIcon />}>
    Accede con Google
  </Button>
);
