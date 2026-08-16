import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  DeleteOutline,
  DragIndicator as DragIndicatorIcon,
  ModeEditOutline,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { VideoThumbnail } from "./VideoThumbnail";

interface SortableImageItemProps {
  item: {
    id: string;
    name: string;
    type: "image" | "video";
    url: string;
    file?: any;
  };
  onDelete: (id: string) => void;
  onOpenCropModal: (id: string) => void;
}

export const SortableImageItem = ({
  item,
  onDelete,
  onOpenCropModal,
}: SortableImageItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });
  const [thumbnail, setThumbnail] = useState<string | undefined>();

  useEffect(() => {
    let objectUrl: string | null = null;

    const createUrl = () => {
      const file = item.file || item.url;
      const isFile = file && typeof file === "object" && "name" in file;

      if (isFile) {
        objectUrl = URL.createObjectURL(file as File);
        return objectUrl;
      }
      return typeof file === "string" ? file : "";
    };

    setThumbnail(createUrl());

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [item.url, item.type, item.file]);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <ListItem
      ref={setNodeRef}
      style={style}
      sx={{
        border: "1px solid",
        borderColor: "grey.400",
        backgroundColor: "grey.50",
        p: 3,
        borderRadius: 2,
        flex: 1,
        maxHeight: "80px",
        display: "flex",
      }}
      {...attributes}
      // divider
      secondaryAction={
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "80px",
          }}
        >
          {item.type === "image" && (
            <IconButton
              edge="end"
              aria-label="crop"
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                onOpenCropModal(item.id);
              }}
              sx={{
                backgroundColor: "grey.400",
                borderRadius: 1,
                p: 2,
              }}
            >
              <ModeEditOutline />
            </IconButton>
          )}
          <IconButton
            edge="end"
            aria-label="delete"
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              onDelete(item.id);
            }}
            sx={{
              backgroundColor: "grey.400",
              borderRadius: 1,
              p: 2,
            }}
          >
            <DeleteOutline />
          </IconButton>
        </Box>
      }
    >
      <IconButton edge="start" sx={{ mr: 1 }} {...listeners}>
        <DragIndicatorIcon />
      </IconButton>
      <ListItemAvatar sx={{ position: "relative" }}>
        {item.type === "video" ? (
          <VideoThumbnail url={thumbnail || ""} width={50} height={50} />
        ) : (
          <Avatar
            variant="rounded"
            src={thumbnail || undefined}
            alt={item.name}
            sx={{ width: "50px", height: "50px" }}
          />
        )}
      </ListItemAvatar>
      <ListItemText
        primary={item.name}
        sx={{
          flex: 1,
          minWidth: 0,
          pr: "96px", // reserve space so text doesn't go under the secondary action buttons
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
        primaryTypographyProps={{ noWrap: true }}
      />
    </ListItem>
  );
};
