import React, { useState } from "react";
import { Meta, StoryFn } from "@storybook/react";
import CheckboxWithLabel from "../components/CheckboxWithLabel";

export default {
  title: "Components/CheckboxWithLabel",
  component: CheckboxWithLabel,
} as Meta;

const Template: StoryFn = (args) => {
  const [checked, setChecked] = useState(args.checked);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  return (
    //@ts-ignore
    <CheckboxWithLabel {...args} checked={checked} onChange={handleChange} />
  );
};

export const Default = Template.bind({});
Default.args = {
  label: "Recordar contraseña",
  checked: false,
};
