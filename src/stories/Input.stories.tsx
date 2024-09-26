// Input.stories.tsx
import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import Input from "../components/Input";

export default {
  title: "Components/Input",
  component: Input,
  argTypes: {
    label: { control: "text" },
    placeholder: { control: "text" },
    type: { control: "text" },
    helperText: { control: "text" },
    error: { control: "boolean" },
    disabled: { control: "boolean" },
    required: { control: "boolean" },
  },
} as Meta;

// Define types for the Input component props
interface InputProps {
  label: string;
  placeholder: string;
  type?: string;
  helperText?: string;
  error?: boolean;
  disabled?: boolean;
  required?: boolean;
}

// Explicitly type the args in StoryFn
const Template: StoryFn<InputProps> = (args) => (
  <Input {...args} type={args.type || "text"} />
);

export const Default = Template.bind({});
Default.args = {
  label: "Nombre",
  placeholder: "Ingresa tu nombre",
};

export const WithHelperText = Template.bind({});
WithHelperText.args = {
  label: "Nombre",
  placeholder: "Ingresa tu nombre",
  helperText: "Este es tu nombre completo",
};

export const WithError = Template.bind({});
WithError.args = {
  label: "Nombre",
  placeholder: "Ingresa tu nombre",
  error: true,
  helperText: "Nombre requerido",
};

export const Disabled = Template.bind({});
Disabled.args = {
  label: "Nombre",
  placeholder: "Ingresa tu nombre",
  disabled: true,
};

export const Required = Template.bind({});
Required.args = {
  label: "Nombre",
  placeholder: "Ingresa tu nombre",
  required: true,
  helperText: "Este campo es obligatorio",
};

export const EmailInput = Template.bind({});
EmailInput.args = {
  label: "Email",
  type: "email",
  placeholder: "Introduce tu email",
  required: true,
};

export const PasswordInput = Template.bind({});
PasswordInput.args = {
  label: "Contraseña",
  type: "password",
  placeholder: "Introduce tu contraseña",
  required: true,
};
