import React from "react";
import { Box } from "@mui/material";
import { PlayCircleOutline } from "@mui/icons-material";

interface VideoThumbnailProps {
  url: string;
  width: number | string;
  height: number | string;
  borderRadius?: number;
  border?: string;
}

export const VideoThumbnail = ({
  url,
  width,
  height,
  borderRadius = 4,
  border = "none",
}: VideoThumbnailProps) => {
  return (
    <Box
      sx={{
        position: "relative",
        width,
        height,
        borderRadius: `${borderRadius}px`,
        overflow: "hidden",
        display: "flex",
        border,
        borderColor: "primary.main",
        boxSizing: "border-box",
      }}
    >
      <video
        src={url}
        muted
        preload="metadata"
        playsInline
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      <PlayCircleOutline
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          color: "white",
          fontSize: "1.5rem",
        }}
      />
    </Box>
  );
};
