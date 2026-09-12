import { Box, Button, Grid, Typography } from "@mui/material";
import React from "react";
import { ChannelKey } from "../../../../types/channel";
import {
  ALL_CHANNEL_KEYS,
  CHANNEL_META,
  MAX_SELECTED_CHANNELS,
} from "./channels.constants";

interface ChannelSelectStepProps {
  selectedChannels: ChannelKey[];
  onToggle: (key: ChannelKey) => void;
}

const ChannelSelectStep: React.FC<ChannelSelectStepProps> = ({
  selectedChannels,
  onToggle,
}) => {
  const atLimit = selectedChannels.length >= MAX_SELECTED_CHANNELS;

  return (
    <Box py={2}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: 4,
          gap: 2,
        }}
      >
        <Typography sx={{ color: "grey.700" }}>
          Elige hasta {MAX_SELECTED_CHANNELS} canales. Prioriza los que más
          ayudan a tus clientes para conocerte y contactase con tu negocio.
        </Typography>
        <Typography variant="body2" color="textSecondary" whiteSpace="nowrap">
          {selectedChannels.length}/{MAX_SELECTED_CHANNELS} seleccionados
        </Typography>
      </Box>
      <Grid container spacing={2}>
        {ALL_CHANNEL_KEYS.map((chan) => {
          const selected = selectedChannels.includes(chan);
          const disabled = !selected && atLimit;
          const { label, icon: IconComponent } = CHANNEL_META[chan];
          return (
            <Grid item xs={12} key={chan}>
              <Button
                fullWidth
                disabled={disabled}
                onClick={() => onToggle(chan)}
                sx={{
                  paddingY: 4,
                  borderWidth: selected ? 2 : 1,
                  borderColor: selected ? "primary.main" : "grey.500",
                  gap: 1,
                }}
                variant="outlined"
                color="inherit"
              >
                <IconComponent />
                <Typography variant="body2">{label}</Typography>
              </Button>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default ChannelSelectStep;
