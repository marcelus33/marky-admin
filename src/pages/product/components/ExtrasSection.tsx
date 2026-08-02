import React, { useState } from "react";
import {
  Box,
  Typography,
  Switch,
  FormControlLabel,
  Button,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { Field, FieldArray, FormikProps, getIn } from "formik";
import NumberInput from "../../../components/NumberInput";
import Input from "../../../components/Input";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import { useBusinessAccountInfo } from "../../../hooks/useBusinessAccountInfo";

interface ExtrasSectionProps extends FormikProps<any> {
  maxItems?: number;
}

const ExtrasSection: React.FC<ExtrasSectionProps> = ({
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
  maxItems = 10,
}) => {
  const { data: businessAccountInfo } = useBusinessAccountInfo();
  const currencyCode = businessAccountInfo?.primary_currency_code;
  const [showExtras, setShowExtras] = useState(true);

  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: "grey.100",
        borderRadius: 2,
        p: 4,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <LocalOfferIcon />
        <Typography variant="h6" fontWeight="bold">
          Adicionales o extras
        </Typography>
      </Box>

      <FormControlLabel
        control={
          <Switch
            checked={showExtras}
            onChange={(e) => setShowExtras(e.target.checked)}
          />
        }
        label="Activar productos adicionales"
      />
      {showExtras && (
        <FieldArray name="addons">
          {({ push, remove }) => (
            <Box mt={2}>
              {values.addons.map((addon: any, index: number) => (
                <Box
                  key={index}
                  sx={{
                    border: "1px solid",
                    borderColor: "grey.100",
                    borderRadius: 1,
                    p: 3,
                    mb: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 3,
                    backgroundColor: "grey.50",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      flex: 1,
                      gap: 2,
                    }}
                  >
                    <Input
                      name={`addons[${index}].name`}
                      label="Nombre de adicional o extra"
                      placeholder="Nombre de adicional o extra"
                      value={addon.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      error={
                        getIn(touched, `addons[${index}].name`) &&
                        Boolean(getIn(errors, `addons[${index}].name`))
                      }
                      helperText={
                        getIn(touched, `addons[${index}].name`)
                          ? getIn(errors, `addons[${index}].name`)
                          : undefined
                      }
                      InputProps={{
                        sx: {
                          backgroundColor: "white",
                        },
                      }}
                    />
                    <Field
                      name={`addons[${index}].price`}
                      component={NumberInput}
                      label="Precio"
                      required
                      fullWidth
                      margin="normal"
                      InputProps={{
                        sx: {
                          backgroundColor: "white",
                        },
                        endAdornment: currencyCode ? (
                          <InputAdornment position="end">
                            <Typography variant="body2">{`[${currencyCode}]`}</Typography>
                          </InputAdornment>
                        ) : undefined,
                      }}
                    />
                  </Box>
                  <Box>
                    <IconButton onClick={() => remove(index)}>
                      <Delete />
                    </IconButton>
                  </Box>
                </Box>
              ))}
              <Box sx={{ display: "flex", alignItems: "center", marginTop: 4 }}>
                <Box
                  sx={{
                    px: 2,
                    py: 1,
                    backgroundColor: "#DBE9F9",
                    borderRadius: 2,
                    mr: 2,
                  }}
                >
                  <Add fontSize="large" color="primary" sx={{ mt: 1 }} />
                </Box>
                <Button
                  onClick={() => push({ id: Date.now(), name: "", price: "" })}
                  disabled={values.addons.length >= maxItems}
                >
                  Añadir otro extra
                </Button>
              </Box>
            </Box>
          )}
        </FieldArray>
      )}
    </Box>
  );
};

export default ExtrasSection;
