import React from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Slider,
} from "@mui/material";
import Cropper from "react-easy-crop";
import { Point } from "react-easy-crop/types";

interface ImageCropModalProps {
  open: boolean;
  onClose: () => void;
  onApply: () => void;
  image: string;
  crop: Point;
  zoom: number;
  onCropChange: (point: Point) => void;
  onZoomChange: (zoom: number) => void;
  onCropComplete: (croppedArea: any, croppedAreaPixels: any) => void;
  handleZoomChange: (event: Event, newValue: number | number[]) => void;
}

const ImageCropModal: React.FC<ImageCropModalProps> = ({
  open,
  onClose,
  onApply,
  image,
  crop,
  zoom,
  onCropChange,
  onZoomChange,
  onCropComplete,
  handleZoomChange,
}) => {
  if (!image) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogContent>
        <Box sx={{ position: "relative", width: "100%", height: 400 }}>
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={onCropChange}
            onZoomChange={onZoomChange}
            onCropComplete={onCropComplete}
          />
        </Box>
        <Box sx={{ mt: 2 }}>
          <Typography gutterBottom>Zoom</Typography>
          <Slider
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            aria-labelledby="Zoom"
            onChange={handleZoomChange}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={onApply} variant="contained" color="primary">
          Aplicar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ImageCropModal;
