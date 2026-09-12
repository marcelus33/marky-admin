import { Box, IconButton, InputAdornment } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Field, getIn, useFormikContext } from "formik";
import React from "react";
import FormikPhoneInput from "../../../../components/FormikPhoneInput";
import Input from "../../../../components/Input";
import { ChannelKey } from "../../../../types/channel";
import { CHANNEL_META, LABEL_MAX_LENGTH } from "./channels.constants";
import { ChannelsFormValues } from "./ChannelWizardModal";

interface ChannelEntryRowProps {
  channel: ChannelKey;
  index: number;
  onRemove?: () => void;
}

const ChannelEntryRow: React.FC<ChannelEntryRowProps> = ({
  channel,
  index,
  onRemove,
}) => {
  const { values, errors, touched, setFieldValue, handleBlur } =
    useFormikContext<ChannelsFormValues>();
  const meta = CHANNEL_META[channel];
  const basePath = `channels.${channel}[${index}]`;
  const entry = getIn(values, basePath);

  const urlFieldName = `${basePath}.url`;
  const labelFieldName = `${basePath}.label`;

  const urlError = getIn(touched, urlFieldName)
    ? getIn(errors, urlFieldName)
    : undefined;
  const labelError = getIn(touched, labelFieldName)
    ? getIn(errors, labelFieldName)
    : undefined;

  const deleteButton = onRemove ? (
    <IconButton
      onClick={onRemove}
      aria-label={`Eliminar ${meta.entryNoun || "entrada"} ${index + 1}`}
      sx={{
        backgroundColor: "grey.400",
        borderRadius: "6px",
        p: 2,
        flexShrink: 0,
        "&:hover": { backgroundColor: "grey.400" },
      }}
    >
      <DeleteOutlineIcon />
    </IconButton>
  ) : null;

  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: "grey.400",
        borderRadius: 1,
        p: 3,
        mb: 2,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        backgroundColor: "grey.50",
        position: "relative",
      }}
    >
      {meta.multiEntry && (
        <Input
          label={`Nombre para ${meta.entryNoun} ${index + 1}`}
          placeholder={`Nombre para ${meta.entryNoun} ${index + 1}`}
          value={entry?.label || ""}
          onChange={(e) => setFieldValue(labelFieldName, e.target.value)}
          onBlur={handleBlur}
          name={labelFieldName}
          maxLength={LABEL_MAX_LENGTH}
          counterFormat="fraction"
          counterPosition="label"
          required
          error={!!labelError}
          helperText={labelError}
        />
      )}

      <Box sx={{ display: "flex", gap: 2 }}>
        <Box flex={1} minWidth={0}>
          {channel === "whatsapp" ? (
            <Field
              name={urlFieldName}
              component={FormikPhoneInput}
              label={meta.urlFieldLabel || meta.label}
              required
              placeholder={meta.urlPlaceholder}
              sx={{ marginBottom: 0 }}
            />
          ) : (
            <Input
              label={meta.urlFieldLabel || meta.label}
              placeholder={meta.urlPlaceholder}
              value={entry?.url || ""}
              onChange={(e) => setFieldValue(urlFieldName, e.target.value)}
              onBlur={handleBlur}
              name={urlFieldName}
              type="text"
              required
              error={!!urlError}
              helperText={urlError}
              InputProps={
                meta.urlPrefix
                  ? {
                      startAdornment: (
                        <InputAdornment position="start">
                          {meta.urlPrefix}
                        </InputAdornment>
                      ),
                    }
                  : undefined
              }
            />
          )}
        </Box>
        <Box display={"flex"} alignItems={"flex-end"}>
          {deleteButton}
        </Box>
      </Box>
    </Box>
  );
};

export default ChannelEntryRow;
