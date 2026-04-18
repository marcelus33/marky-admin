import React, { useEffect } from "react";
import { Dialog, DialogContent } from "@mui/material";
import XButton from "./XButton";
import { Formik, Form, useFormikContext } from "formik";
import * as Yup from "yup";
import {
  Box,
  Typography,
  FormControlLabel,
  Switch,
  Radio,
  TextField,
  InputAdornment,
  Button,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import Input from "./Input";
import { ProductGridItem } from "../types/product";
import useUpdateProductPromotion from "../hooks/useUpdateProductPromotion";

interface Props {
  open: boolean;
  product?: ProductGridItem | null;
  onClose: () => void;
}

const initialValues = {
  isPromotionActive: false,
  promotionOption: "",
  discountPercentage: undefined,
  multibuyOption: "",
  countdownActive: false,
  promotionDateStart: "",
  promotionTimeStart: "",
  promotionDateEnd: "",
  promotionTimeEnd: "",
};

const validationSchema = Yup.object({
  isPromotionActive: Yup.boolean(),
  promotionOption: Yup.string().when("isPromotionActive", {
    is: true,
    then: (schema) =>
      schema.required("Debe seleccionar 'descuento' u 'oferta'"),
    otherwise: (schema) => schema.notRequired(),
  }),
  discountPercentage: Yup.number()
    .transform((value, original) =>
      String(original).trim() === "" ? null : value,
    )
    .when("promotionOption", {
      is: "descuento",
      then: (schema) =>
        schema
          .required("Debe ingresar un porcentaje")
          .min(1, "Mínimo 1%")
          .max(100, "Máximo 100%"),
      otherwise: (schema) => schema.nullable(),
    }),
  multibuyOption: Yup.string().when("promotionOption", {
    is: "oferta",
    then: (schema) => schema.required("Debe seleccionar una opción de oferta"),
    otherwise: (schema) => schema.notRequired(),
  }),
  countdownActive: Yup.boolean(),
  promotionDateStart: Yup.string().when("countdownActive", {
    is: true,
    then: (schema) => schema.required("Debe ingresar la fecha de inicio"),
    otherwise: (schema) => schema.nullable(),
  }),
  promotionTimeStart: Yup.string().when("countdownActive", {
    is: true,
    then: (schema) => schema.required("Debe ingresar la hora de inicio"),
    otherwise: (schema) => schema.nullable(),
  }),
  promotionDateEnd: Yup.string().when("countdownActive", {
    is: true,
    then: (schema) => schema.required("Debe ingresar la fecha de fin"),
    otherwise: (schema) => schema.nullable(),
  }),
  promotionTimeEnd: Yup.string().when("countdownActive", {
    is: true,
    then: (schema) => schema.required("Debe ingresar la hora de fin"),
    otherwise: (schema) => schema.nullable(),
  }),
}).test(
  "fecha-valida",
  "La fecha y hora de fin deben ser posteriores al inicio",
  function (values) {
    const {
      countdownActive,
      promotionDateStart,
      promotionTimeStart,
      promotionDateEnd,
      promotionTimeEnd,
    } = values as any;

    if (!countdownActive) return true;

    if (
      promotionDateStart &&
      promotionTimeStart &&
      promotionDateEnd &&
      promotionTimeEnd
    ) {
      const start = new Date(`${promotionDateStart}T${promotionTimeStart}`);
      const end = new Date(`${promotionDateEnd}T${promotionTimeEnd}`);
      return end > start;
    }

    return true;
  },
);

const ProductInitializer: React.FC<{ product?: ProductGridItem | null }> = ({
  product,
}) => {
  const { setFieldValue } = useFormikContext<any>();

  useEffect(() => {
    if (!product) return;

    const hasPromotion = !!(
      product.multibuyOption || (product.discountPercent ?? 0) !== 0
    );

    if (hasPromotion) {
      setFieldValue("isPromotionActive", true);

      if (product.multibuyOption) {
        setFieldValue("promotionOption", "oferta");
        setFieldValue("multibuyOption", product.multibuyOption);
      } else if (product.discountPercent && product.discountPercent !== 0) {
        setFieldValue("promotionOption", "descuento");
        setFieldValue("discountPercentage", Number(product.discountPercent));
      }

      if (
        (product as any).promotionStartsAt &&
        (product as any).promotionEndsAt
      ) {
        const [startDate, startTime] = (product as any).promotionStartsAt
          .split("T")
          .map((v: string, i: number) => (i === 1 ? v.slice(0, 5) : v));
        const [endDate, endTime] = (product as any).promotionEndsAt
          .split("T")
          .map((v: string, i: number) => (i === 1 ? v.slice(0, 5) : v));

        setFieldValue("countdownActive", true);
        setFieldValue("promotionDateStart", startDate);
        setFieldValue("promotionTimeStart", startTime);
        setFieldValue("promotionDateEnd", endDate);
        setFieldValue("promotionTimeEnd", endTime);
      }
    }
  }, [product, setFieldValue]);

  return null;
};

const ProductPromotionModal: React.FC<Props> = ({ open, product, onClose }) => {
  const updateProductPromotion = useUpdateProductPromotion();

  const onSubmitLocal = (values: any) => {
    let dataToSubmit = { ...values };

    if (!values.isPromotionActive) {
      dataToSubmit = {
        isPromotionActive: false,
        promotionOption: "",
        discountPercentage: null,
        multibuyOption: "",
        countdownActive: false,
        promotionDateStart: "",
        promotionTimeStart: "",
        promotionDateEnd: "",
        promotionTimeEnd: "",
      };
    } else if (values.countdownActive) {
      const start = `${values.promotionDateStart}T${values.promotionTimeStart}`;
      const end = `${values.promotionDateEnd}T${values.promotionTimeEnd}`;

      dataToSubmit.promotionStartsAt = start;
      dataToSubmit.promotionEndsAt = end;
    }

    delete dataToSubmit.promotionDateStart;
    delete dataToSubmit.promotionTimeStart;
    delete dataToSubmit.promotionDateEnd;
    delete dataToSubmit.promotionTimeEnd;

    let promotionPayload: any;

    if (!values.isPromotionActive) {
      promotionPayload = {
        discount_percentage: "0",
        multibuy_option: null,
        promotion_starts_at: null,
        promotion_ends_at: null,
      };
    } else {
      promotionPayload = {
        discount_percentage:
          dataToSubmit.promotionOption === "descuento"
            ? String(dataToSubmit.discountPercentage)
            : "0",
        multibuy_option:
          dataToSubmit.promotionOption === "oferta"
            ? dataToSubmit.multibuyOption
            : null,
        promotion_starts_at: dataToSubmit.promotionStartsAt ?? null,
        promotion_ends_at: dataToSubmit.promotionEndsAt ?? null,
      };
    }

    if (product?.id) {
      updateProductPromotion.mutate(
        { id: Number(product.id), promotion: promotionPayload },
        {
          onSuccess: () => {
            onClose();
          },
        },
      );
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        if (!(updateProductPromotion as any).isLoading) onClose();
      }}
      fullWidth
      maxWidth="sm"
    >
      <>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            borderBottom: "1px solid lightgrey",
          }}
        >
          <Box display={"flex"} alignItems="center">
            <Box sx={{ pl: 1, display: "flex", alignItems: "center" }}>
              <Box component="h2" sx={{ m: 0, fontSize: 18 }}>
                Promoción del producto
              </Box>
            </Box>
          </Box>
          <Box display={"flex"} sx={{ py: 1 }}>
            <XButton onClick={() => onClose()} sx={{ marginRight: 2 }} />
          </Box>
        </Box>
        <DialogContent>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmitLocal}
            enableReinitialize
          >
            {({ values, setFieldValue, isValid }) => (
              <Form>
                <ProductInitializer product={product} />
                <Box sx={{ p: 2 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        name="isPromotionActive"
                        checked={values.isPromotionActive}
                        onChange={(e) =>
                          setFieldValue("isPromotionActive", e.target.checked)
                        }
                      />
                    }
                    label="Activar promoción"
                  />

                  {values.isPromotionActive && (
                    <Box
                      ml={0}
                      mt={2}
                      sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                    >
                      <FormControlLabel
                        control={
                          <Radio
                            name="promotionOption"
                            value="descuento"
                            checked={values.promotionOption === "descuento"}
                            onChange={() =>
                              setFieldValue("promotionOption", "descuento")
                            }
                          />
                        }
                        label="Descuento"
                      />
                      {values.promotionOption === "descuento" && (
                        <TextField
                          placeholder="Porcentaje de descuento (0-100)"
                          type="number"
                          name="discountPercentage"
                          variant="outlined"
                          size="small"
                          value={values.discountPercentage || ""}
                          onChange={(e) =>
                            setFieldValue(
                              "discountPercentage",
                              Number(e.target.value),
                            )
                          }
                          inputProps={{
                            max: 100,
                            min: 0,
                            style: { padding: 12 },
                          }}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <Typography>%</Typography>
                              </InputAdornment>
                            ),
                          }}
                          sx={{ mb: 2, width: { xs: "100%", md: "50%" } }}
                        />
                      )}

                      <FormControlLabel
                        control={
                          <Radio
                            name="promotionOption"
                            value="oferta"
                            checked={values.promotionOption === "oferta"}
                            onChange={() =>
                              setFieldValue("promotionOption", "oferta")
                            }
                          />
                        }
                        label="Oferta"
                      />
                      {values.promotionOption === "oferta" && (
                        <FormControl
                          size="small"
                          sx={{ mb: 2, width: { xs: "100%", md: "50%" } }}
                        >
                          <Select
                            value={values.multibuyOption}
                            onChange={(e) =>
                              setFieldValue("multibuyOption", e.target.value)
                            }
                          >
                            <MenuItem value="2x1">2x1</MenuItem>
                            <MenuItem value="3x2">3x2</MenuItem>
                          </Select>
                        </FormControl>
                      )}

                      <Box mt={2}>
                        <FormControlLabel
                          control={
                            <Switch
                              name="countdownActive"
                              checked={values.countdownActive}
                              onChange={(e) =>
                                setFieldValue(
                                  "countdownActive",
                                  e.target.checked,
                                )
                              }
                            />
                          }
                          label="Activar cuenta regresiva"
                        />

                        {values.countdownActive && (
                          <Box
                            display="flex"
                            flexDirection="column"
                            gap={2}
                            mt={1}
                          >
                            <Box display="flex" gap={2}>
                              <Input
                                type="date"
                                value={values.promotionDateStart}
                                onChange={(e: any) =>
                                  setFieldValue(
                                    "promotionDateStart",
                                    e.target.value,
                                  )
                                }
                                label="Fecha Inicio"
                                sx={{ flex: 2 }}
                              />
                              <Input
                                type="time"
                                value={values.promotionTimeStart}
                                onChange={(e: any) =>
                                  setFieldValue(
                                    "promotionTimeStart",
                                    e.target.value,
                                  )
                                }
                                label="Hora inicio"
                                sx={{ flex: 1 }}
                              />
                            </Box>
                            <Box display="flex" gap={2}>
                              <Input
                                type="date"
                                value={values.promotionDateEnd}
                                onChange={(e: any) =>
                                  setFieldValue(
                                    "promotionDateEnd",
                                    e.target.value,
                                  )
                                }
                                label="Fecha fin"
                                sx={{ flex: 2 }}
                              />
                              <Input
                                type="time"
                                value={values.promotionTimeEnd}
                                onChange={(e: any) =>
                                  setFieldValue(
                                    "promotionTimeEnd",
                                    e.target.value,
                                  )
                                }
                                label="Hora Fin"
                                sx={{ flex: 1 }}
                              />
                            </Box>
                          </Box>
                        )}
                      </Box>
                    </Box>
                  )}

                  <Box mt={4}>
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      fullWidth
                      disabled={
                        !isValid || (updateProductPromotion as any).isLoading
                      }
                    >
                      {(updateProductPromotion as any).isLoading
                        ? "Guardando..."
                        : "Guardar/Crear"}
                    </Button>
                  </Box>
                </Box>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </>
    </Dialog>
  );
};

export default ProductPromotionModal;
