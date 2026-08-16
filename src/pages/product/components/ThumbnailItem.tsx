import React, { useEffect, useState } from "react";
import { Avatar, IconButton } from "@mui/material";
import { Product } from "../../../types/product";
import { VideoThumbnail } from "./VideoThumbnail";

interface ThumbnailItemProps {
  item: NonNullable<Product["media"]>[0];
  onClick: () => void;
  isSelected: boolean;
}

export const ThumbnailItem = ({
  item,
  onClick,
  isSelected,
}: ThumbnailItemProps) => {
  const [fileUrl, setFileUrl] = useState<string | undefined>();

  useEffect(() => {
    const url =
      typeof item.file === "object"
        ? URL.createObjectURL(item.file as File)
        : item.file;

    setFileUrl(url);

    return () => {
      if (url && url.startsWith("blob:")) {
        URL.revokeObjectURL(url);
      }
    };
  }, [item.file]);

  return (
    <IconButton onClick={onClick} sx={{ p: 0, mb: 1, position: "relative" }}>
      {item.media_type === "video" ? (
        <VideoThumbnail
          url={fileUrl || ""}
          width={56}
          height={56}
          border={isSelected ? "2px solid" : "none"}
        />
      ) : (
        <Avatar
          variant="rounded"
          src={fileUrl}
          sx={{
            width: 56,
            height: 56,
            border: isSelected ? "2px solid" : "none",
            borderColor: "primary.main",
          }}
        />
      )}
    </IconButton>
  );
};
