import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import { Box, Button, IconButton, Modal, Typography } from "@mui/material";
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
  // Muestra un botón de volver (flecha) a la izquierda del título
  onBack?: () => void;
  // Muestra un botón de cerrar (X) a la derecha del título
  showCloseButton?: boolean;
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
  onBack,
  showCloseButton = false,
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
        <Box
          sx={{
            borderBottom: "1px solid lightgray",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            paddingRight: onBack || showCloseButton ? 3 : 0,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {onBack && (
              <IconButton onClick={onBack} sx={{ marginLeft: 1 }}>
                <ArrowBackIcon />
              </IconButton>
            )}
            <Typography
              id="modal-title"
              variant="h6"
              component="h2"
              sx={{ p: 4, paddingLeft: onBack ? 1 : 4 }}
            >
              {title}
            </Typography>
          </Box>
          {showCloseButton && (
            <IconButton
              onClick={onClose}
              sx={{
                backgroundColor: colors.light.grey[400],
                borderRadius: "50%",
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
        {/*  */}
        <Box
          id="modal-description"
          sx={{
            p: 4,
          }}
        >
          {children}
        </Box>
        {/*  */}
        {!hideFooter && (
          <Box
            sx={{
              borderTop: "1px solid lightgray",
              display: "flex",
              p: 4,
              justifyContent: "flex-end",
              gap: 4,
            }}
          >
            {
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
            }
          </Box>
        )}
      </Box>
    </Modal>
  );
};

export default CustomModal;
