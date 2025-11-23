import React, { useState } from "react";
import {
  Box,
  Typography,
  Switch,
  FormControlLabel,
  TextField,
  Button,
  Grid,
  IconButton,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { Field, FieldArray, FormikProps, getIn } from "formik";
import NumberInput from "../../../components/NumberInput";

interface ExtrasSectionProps extends FormikProps<any> {
  maxItems?: number;
}

const ExtrasSection: React.FC<ExtrasSectionProps> = ({
  values,
  errors,
  touched,
  maxItems = 10,
}) => {
  const [showExtras, setShowExtras] = useState(true);

  return (
    <Box>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Adicionales o extras
      </Typography>
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
                    border: "1px solid #e0e0e0",
                    borderRadius: 1,
                    p: 2,
                    mb: 2,
                  }}
                >
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs>
                      <Field
                        as={TextField}
                        name={`addons[${index}].name`}
                        label="Nombre de adicional o extra"
                        fullWidth
                        margin="normal"
                        required
                        error={
                          getIn(touched, `addons[${index}].name`) &&
                          Boolean(getIn(errors, `addons[${index}].name`))
                        }
                        helperText={
                          getIn(touched, `addons[${index}].name`) &&
                          getIn(errors, `addons[${index}].name`)
                        }
                      />
                      <Field
                        name={`addons[${index}].price`}
                        component={NumberInput}
                        label="Precio"
                        required
                        fullWidth
                        margin="normal"
                      />
                    </Grid>
                    <Grid item>
                      <IconButton onClick={() => remove(index)}>
                        <Delete />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Box>
              ))}
              <Button
                startIcon={<Add />}
                onClick={() => push({ id: Date.now(), name: "", price: "" })}
                disabled={values.addons.length >= maxItems}
              >
                Añadir otro extra
              </Button>
            </Box>
          )}
        </FieldArray>
      )}
    </Box>
  );
};

export default ExtrasSection;
