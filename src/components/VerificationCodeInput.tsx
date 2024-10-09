import React, { useState, useRef, useEffect } from "react";
import { Box, TextField, BoxProps } from "@mui/material";

interface VerificationCodeInputProps extends BoxProps {
  length: number; // Número de inputs para el código
  onComplete?: (code: string) => void; // Se llama cuando el código está completo
  onChangeCode?: (isComplete: boolean) => void; // Se llama cada vez que cambia el estado de completo
}

const VerificationCodeInput: React.FC<VerificationCodeInputProps> = ({
  length,
  onComplete,
  onChangeCode,
  ...boxProps // Aquí heredamos los props de Box
}) => {
  const [values, setValues] = useState<string[]>(Array(length).fill(""));
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Función para manejar cambios de input
  const handleChange = (value: string, index: number) => {
    const newValues = [...values];
    newValues[index] = value;

    setValues(newValues);

    // Mover al siguiente input si el valor ingresado es un número
    if (value && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }

    // Verificar si el código está completo
    const isComplete = newValues.every((val) => val !== "");

    // Llamar a la función onChange para indicar si está completo
    if (onChangeCode) {
      onChangeCode(isComplete);
    }

    // Si el código está completo, llamar a onComplete
    if (isComplete && onComplete) {
      onComplete(newValues.join(""));
    }
  };

  // Función para manejar el evento de tecla
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLDivElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !values[index] && index > 0) {
      // Mover al input anterior en caso de que esté vacío y se presione "Backspace"
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      gap={2}
      {...boxProps} // Pasamos los props al Box de MUI
    >
      {values.map((value, index) => (
        <TextField
          key={index}
          value={value}
          inputRef={(el) => (inputsRef.current[index] = el)}
          onChange={(e) => handleChange(e.target.value, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          inputProps={{
            maxLength: 1, // Limita cada input a un carácter
            style: {
              textAlign: "center",
              fontSize: "24px",
              width: "40px", // Ajustar el tamaño según tu preferencia
              height: "40px",
            },
          }}
          variant="outlined"
        />
      ))}
    </Box>
  );
};

export default VerificationCodeInput;
