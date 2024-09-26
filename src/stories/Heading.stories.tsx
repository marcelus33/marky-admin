import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import Typography from "@mui/material/Typography";

export default {
  title: "Components/Heading",
  component: Typography,
} as Meta;

const H1Template: StoryFn = (args) => (
  <Typography variant="h1" {...args}>
    Este es un encabezado H1
  </Typography>
);
export const H1Story = H1Template.bind({});

const H2Template: StoryFn = (args) => (
  <Typography variant="h2" {...args}>
    Este es un encabezado H2
  </Typography>
);
export const H2Story = H2Template.bind({});

const H3Template: StoryFn = (args) => (
  <Typography variant="h3" {...args}>
    Este es un encabezado H3
  </Typography>
);
export const H3Story = H3Template.bind({});

const H4Template: StoryFn = (args) => (
  <Typography variant="h4" {...args}>
    Este es un encabezado H4
  </Typography>
);
export const H4Story = H4Template.bind({});

const H5Template: StoryFn = (args) => (
  <Typography variant="h5" {...args}>
    Este es un encabezado H5
  </Typography>
);
export const H5Story = H5Template.bind({});
