import React, { useEffect, useState } from "react";
import { Avatar, IconButton } from "@mui/material";
import { PlayCircleOutline } from "@mui/icons-material";
import { generateThumbnail } from "../../../utils/media";
import { Product } from "../../../types/product";

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
  const [thumbnail, setThumbnail] = useState<string | undefined>();

  useEffect(() => {
    let isMounted = true;
    const fileUrl =
      typeof item.file === "object"
        ? URL.createObjectURL(item.file as File)
        : item.file;

    if (item.media_type === "video") {
      generateThumbnail(fileUrl).then((thumb) => {
        if (isMounted) {
          setThumbnail(thumb);
        }
      });
    } else {
      setThumbnail(fileUrl);
    }

    return () => {
      isMounted = false;
      if (fileUrl && fileUrl.startsWith("blob:")) {
        URL.revokeObjectURL(fileUrl);
      }
    };
  }, [item.file, item.media_type]);

  return (
    <IconButton onClick={onClick} sx={{ p: 0, mb: 1, position: "relative" }}>
      <Avatar
        variant="rounded"
        src={thumbnail}
        sx={{
          width: 56,
          height: 56,
          border: isSelected ? "2px solid" : "none",
          borderColor: "primary.main",
        }}
      />
      {item.media_type === "video" && (
        <PlayCircleOutline
          sx={{
            position: "absolute",
            color: "white",
            fontSize: "1.5rem",
          }}
        />
      )}
    </IconButton>
  );
};
