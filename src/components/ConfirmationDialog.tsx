import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import CancelButton from "./CancelButton";

interface ConfirmationDialogProps {
  open: boolean;
  title: string;
  content: string | React.ReactNode;
  onClose: () => void;
  onConfirm: () => void;
  cancelText?: string;
  confirmText?: string;
  isLoading?: boolean;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  title,
  content,
  onClose,
  onConfirm,
  cancelText = "Cancelar",
  confirmText = "Aceptar",
  isLoading = false,
}) => {
  return (
    <Dialog
      open={open}
      onClose={(_ev, reason) => {
        // prevent closing while an action is in progress
        if (!isLoading) onClose();
      }}
      disableEscapeKeyDown={isLoading}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {typeof content === "string" ? (
          <Typography>{content}</Typography>
        ) : (
          content
        )}
      </DialogContent>
      <DialogActions sx={{ display: "flex", gap: 2 }}>
        <CancelButton
          onClick={onClose}
          sx={{ paddingX: 2, paddingY: 2 }}
          disabled={isLoading}
        >
          {cancelText}
        </CancelButton>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="primary"
          disabled={isLoading}
          sx={{ paddingX: 2, paddingY: 2, boxShadow: 0 }}
        >
          {isLoading ? (
            <CircularProgress size={18} color="inherit" />
          ) : (
            confirmText
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
