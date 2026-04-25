import { Box, Button, Modal, Typography } from "@mui/material";
import React from "react";
import colors from "../themes/utils/colors";

interface CustomModalProps {
  open: boolean;
  onClose: () => void;
  secondaryAction?: () => void;
  primaryAction?: (args: object | undefined) => void;
  secondaryActionLabel?: string;
  primaryActionLabel?: string;
  children: React.ReactNode;
  title?: string;
  primaryActionParams?: object;
  // Opcional: permite sobreescribir o extender los estilos por defecto
  sx?: object;
  // Oculta el footer predeterminado (útil cuando el contenido ya maneja botones)
  hideFooter?: boolean;
}

const CustomModal: React.FC<CustomModalProps> = ({
  open,
  title = "Insert title here",
  onClose,
  secondaryAction,
  primaryAction,
  secondaryActionLabel = "Cancelar",
  primaryActionLabel = "Aceptar",
  children,
  primaryActionParams,
  sx,
  hideFooter = false,
}) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          boxShadow: 24,
          borderRadius: 1, // Opcional, para redondear esquinas
          ...sx, // Permite extender o sobreescribir los estilos predeterminados
        }}
      >
        <Box sx={{ borderBottom: "1px solid lightgray" }}>
          <Typography
            id="modal-title"
            variant="h6"
            component="h2"
            sx={{ p: 4 }}
          >
            {title}
          </Typography>
        </Box>
        {/*  */}
        <Box
          sx={{
            p: 4,
          }}
        >
          {children}
        </Box>
        {/*  */}
        <Box
          sx={{
            borderTop: "1px solid lightgray",
            display: "flex",
            p: 4,
            justifyContent: "flex-end",
            gap: 4,
          }}
        >
          {!hideFooter && (
            <>
              <Button
                onClick={secondaryAction ? secondaryAction : onClose}
                type="button"
                variant="contained"
                sx={{
                  backgroundColor: colors.light.grey[600],
                  color: colors.light.text.secondary,
                  paddingX: "1rem",
                }}
              >
                {secondaryActionLabel}
              </Button>
              {primaryAction && (
                <Button
                  onClick={() => primaryAction(primaryActionParams)}
                  type="button"
                  variant="contained"
                  color="primary"
                  sx={{
                    paddingX: "1rem",
                  }}
                >
                  {primaryActionLabel}
                </Button>
              )}
            </>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default CustomModal;
