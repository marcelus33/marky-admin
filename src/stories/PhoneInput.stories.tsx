// src/components/PhoneInput.stories.tsx

import React from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";
import { Box } from "@mui/material";

export default {
  title: "Components/PhoneInput",
  component: PhoneInput,
};

const Template = (args: any) => (
  <Box sx={{ width: 300 }}>
    <PhoneInput {...args} />
  </Box>
);

export const Default = Template.bind({});
//@ts-ignore
Default.args = {
  country: "py",
  value: "",
  onChange: (phone: string) => console.log(phone),
  placeholder: "Ingresa tu número de teléfono",
};

export const WithValue = Template.bind({});
//@ts-ignore
WithValue.args = {
  country: "py",
  value: "+595123456789",
  onChange: (phone: string) => console.log(phone),
  placeholder: "Ingresa tu número de teléfono",
};

export const ErrorState = Template.bind({});
//@ts-ignore
ErrorState.args = {
  country: "py",
  value: "",
  onChange: (phone: string) => console.log(phone),
  placeholder: "Ingresa tu número de teléfono",
};

// Para simular un error, puedes usar un estado local en el Story
//@ts-ignore
ErrorState.decorators = [
  //@ts-ignore
  (Story) => {
    const [phone, setPhone] = React.useState("");

    const handleChange = (value: string) => {
      setPhone(value);
      if (!value) {
        console.error("Campo requerido");
      }
    };

    return (
      <Box sx={{ width: 300 }}>
        <PhoneInput
          country="py"
          value={phone}
          onChange={handleChange}
          placeholder="Ingresa tu número de teléfono"
          inputStyle={{
            borderColor: phone ? "#ccc" : "red", // Cambiar el borde a rojo si no hay valor
          }}
        />
        {!phone && <span style={{ color: "red" }}>Campo requerido</span>}
      </Box>
    );
  },
];
