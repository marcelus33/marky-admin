import React from "react";
import { Badge, Box, Typography } from "@mui/material";
import { ALL_CHANNEL_KEYS, CHANNEL_META } from "./channels/channels.constants";
import { ChannelsByKey } from "../../../types/channel";

interface SocialMediaInfoProps {
  socialMedia: ChannelsByKey;
  onOpen: () => void;
}

const SocialMediaInfo: React.FC<SocialMediaInfoProps> = ({
  socialMedia,
  onOpen,
}) => {
  const filledChannels = ALL_CHANNEL_KEYS.map((key) => ({
    key,
    entries: (socialMedia?.[key] || []).filter(
      (entry) => entry.url && entry.url.trim() !== "",
    ),
  })).filter(({ entries }) => entries.length > 0);

  const isEmpty = filledChannels.length === 0;

  return (
    <Box
      onClick={onOpen}
      sx={{
        border: isEmpty ? "1px dashed #B8CDF5" : "none",
        backgroundColor: isEmpty ? "#FAFCFF" : "transparent",
        borderRadius: isEmpty ? "6px" : 0,
        py: isEmpty ? 4 : 0,
        px: isEmpty ? 3 : 0,
        cursor: "pointer",
      }}
    >
      {isEmpty ? (
        <Typography
          sx={{
            color: "#2563EB",
            fontWeight: 700,
            fontSize: 14,
            lineHeight: "22px",
            textAlign: "center",
          }}
        >
          Agrega tus canales
        </Typography>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          gap={3}
          sx={{ justifyContent: "center" }}
        >
          {filledChannels.map(({ key, entries }) => {
            const IconComponent = CHANNEL_META[key].icon;
            return (
              <Badge
                key={key}
                badgeContent={entries.length > 1 ? entries.length : undefined}
                color="primary"
              >
                <Box
                  sx={{
                    width: 42,
                    height: 42,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: (theme) => `1px solid ${theme.palette.grey[800]}`,
                    borderRadius: 1,
                  }}
                >
                  <IconComponent style={{ width: 26, height: 26 }} />
                </Box>
              </Badge>
            );
          })}
        </Box>
      )}
    </Box>
  );
};

export default SocialMediaInfo;
