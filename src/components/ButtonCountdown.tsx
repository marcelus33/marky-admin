import React, { useState, useEffect } from "react";
import { Button, Typography, ButtonProps, Box } from "@mui/material";

interface SubmitButtonWithCountdownProps extends ButtonProps {
  onSubmit: () => void; // Custom submit function prop
  interval?: number; // Optional interval prop
  isValid?: boolean;
}

const SubmitButtonWithCountdown: React.FC<SubmitButtonWithCountdownProps> = ({
  onSubmit,
  children,
  interval = 30, // Default value of 30 seconds
  isValid,
  disabled,
  ...props
}) => {
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(interval);

  const handleClick = () => {
    console.log("isValid", isValid);
    if (isValid !== undefined && isValid !== true) {
      return;
    }
    onSubmit(); // Call the custom submit function
    setIsDisabled(true);
    setCountdown(interval); // Reset countdown to the passed interval value
  };

  useEffect(() => {
    let timer: NodeJS.Timer;

    if (isDisabled) {
      timer = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown <= 1) {
            setIsDisabled(false);
            clearInterval(timer);
            return interval; // Reset countdown after reaching 0
          }
          return prevCountdown - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer); // Cleanup timer on unmount
  }, [isDisabled, interval]); // Add interval as a dependency

  return (
    <Button
      onClick={handleClick}
      disabled={isDisabled || disabled}
      {...props} // Spread any additional button props
    >
      {!isDisabled && children}
      {isDisabled && (
        <Box display={"flex"} gap={2}>
          <Typography variant="subtitle2">¿No te llegó?</Typography>
          <Typography variant="body2">
            Por favor espere {countdown} segundos.
          </Typography>
        </Box>
      )}
    </Button>
  );
};

export default SubmitButtonWithCountdown;
