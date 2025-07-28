import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
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
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  title,
  content,
  onClose,
  onConfirm,
  cancelText = "Cancelar",
  confirmText = "Aceptar",
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {typeof content === "string" ? (
          <Typography>{content}</Typography>
        ) : (
          content
        )}
      </DialogContent>
      <DialogActions sx={{ display: "flex", gap: 2 }}>
        <CancelButton onClick={onClose} sx={{ paddingX: 2, paddingY: 2 }}>
          Cancelar
        </CancelButton>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="primary"
          sx={{ paddingX: 2, paddingY: 2, boxShadow: 0 }}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
