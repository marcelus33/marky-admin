import {
  Box,
  Button,
  FormControlLabel,
  FormLabel,
  Grid,
  InputAdornment,
  Step,
  StepConnector,
  stepConnectorClasses,
  StepLabel,
  Stepper,
  Switch,
  Typography,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { ReactComponent as LogoMarkyBlack } from "../assets/icons/logo-marky-black.svg";
import { ReactComponent as LoginImage } from "../assets/images/login.svg";
import { ReactComponent as CoffeeIcon } from "../assets/icons/coffee.svg";
import { ReactComponent as ExchangeIcon } from "../assets/icons/exchange.svg";
import BusinessTypeSelectorField from "../components/BusinessTypeSelectorField";
import CategorySelectionList from "../components/CategorySelectionList";
import CustomSelectorField from "../components/CustomSelector";
import Input from "../components/Input";
import Link from "../components/Link";
import CustomModal from "../components/Modal";
import NumberInput from "../components/NumberInput";
import Paragraph from "../components/Paragraph";
import SearchInput from "../components/SearchInput";
import { useCategories } from "../hooks/useCategories";
import { useCities } from "../hooks/useCities";
import { useCountries } from "../hooks/useCountries";
import { useCurrencies } from "../hooks/useCurrencies";
import { ROUTES } from "../routes/paths";
import {
  createBusinessProfile,
  validateBusinessName,
} from "../services/businessService";
import { Category } from "../services/categoriesService";
import { useSessionStore } from "../stores/sessionStore";
import colors from "../themes/utils/colors";
import { ShowNotification } from "../utils/utils";

interface CategoryOption {
  value: number | string;
  label: string;
}

const CustomConnector = styled(StepConnector)(({ theme }) => ({
  // Default connector line style
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: theme.palette.grey[300],
    borderWidth: 3,
  },
  // When the connector is active (next to the active step)
  [`&.Mui-active .${stepConnectorClasses.line}`]: {
    borderColor: theme.palette.primary.main,
  },
  // When the connector is completed (i.e., before the current step)
  [`&.Mui-completed .${stepConnectorClasses.line}`]: {
    borderColor: theme.palette.primary.main,
  },
}));

const initialValues = {
  business_id: "",
  categories: [],
  country: [],
  city: [],
  business_type: "",
  primary_currency: [],
  enable_exchange_rate: false,
  secondary_currency: [],
  exchange_rate: "",
  is_primary_to_secondary: true,
};

const Configuration = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const formikRef = useRef(null);
  const { user } = useSessionStore();
  const [openCategoriesModal, setOpenCategoriesModal] = useState(false);
  const [openCountriesModal, setOpenCountriesModal] = useState(false);
  const [openCitiesModal, setOpenCitiesModal] = useState(false);
  const [openPrimaryCurrencyModal, setOpenPrimaryCurrencyModal] =
    useState(false);
  const [openSecondaryCurrencyModal, setOpenSecondaryCurrencyModal] =
    useState(false);

  const [activeStep, setActiveStep] = useState(0);
  // Definir las validaciones de los pasos con Yup
  const validationSchema = [
    Yup.object({
      business_id: Yup.string()
        .required("Este campo es obligatorio")
        .matches(
          /^[a-z0-9\-_]+$/,
          "Solo se permiten letras minúsculas, guiones (-) y guiones bajos (_)"
        )
        .min(4, "No puede tener menos de 4 caracteres")
        .max(22, "No puede tener más de 22 caracteres")
        .test(
          "unique-business-id",
          "Este nombre de negocio ya existe",
          async function (value: string) {
            if (!value) return true;
            try {
              const result = await validateBusinessName(value);
              return !result.is_taken;
            } catch (error) {
              //@ts-ignore
              return this.createError({
                message: "Error al validar el nombre",
              });
            }
          }
        ),
    }),
    Yup.object({
      categories: Yup.array().required(
        "Debe seleccionar al menos una categoría"
      ),
    }),
    Yup.object({
      country: Yup.array()
        .of(
          Yup.object({
            id: Yup.string().required("El id es obligatorio"),
            name: Yup.string().required("El nombre es obligatorio"),
          })
        )
        .min(1, "Debes seleccionar al menos un país")
        .required("Este campo es obligatorio"),
      city: Yup.array()
        .of(
          Yup.object({
            id: Yup.string().required("El id es obligatorio"),
            name: Yup.string().required("El nombre es obligatorio"),
          })
        )
        .min(1, "Debes seleccionar al menos una ciudad")
        .required("Este campo es obligatorio"),
      business_type: Yup.string()
        .oneOf(
          ["commercial", "entrepreneur"],
          "Tipo de negocio inválido. Las opciones válidas son Comercial o Emprendedor."
        )
        .required("Este campo es obligatorio"),
    }),
    Yup.object({
      primary_currency: Yup.string().required("Este campo es obligatorio"),
      exchange_rate: Yup.number(),
    }),
  ];
  //
  const {
    categories = [],
    isLoading: isLoadingCategories,
    isError: isErrorCategories,
  } = useCategories();
  const [localCategories, setLocalCategories] = useState(categories);
  const [localCountries, setLocalCountries] = useState([]);
  const [localCities, setLocalCities] = useState([]);
  const [localPrimaryCurrencies, setLocalPrimaryCurrencies] = useState([]);
  const [localSecondaryCurrencies, setLocalSecondaryCurrencies] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const {
    countries,
    isLoading: isLoadingCountries,
    isError: isErrorCountries,
  } = useCountries();
  const {
    cities,
    isLoading: isLoadingCities,
    isError: isErrorCities,
  } = useCities(selectedCountry);

  const {
    currencies,
    isLoading: isLoadingCurrencies,
    isError: isErrorCurrencies,
  } = useCurrencies();

  //
  const steps = [
    { title: "Identidad del negocio", subtitle: "Nombre del comercio" },
    { title: "Ubicación y tipo de negocio", subtitle: "¿Dónde te encuentras?" },
    { title: "Expresión monetaria", subtitle: "Tipo de moneda" },
  ];

  // Función para avanzar al siguiente paso
  const handleNext = (setFieldTouched: any) => {
    setFieldTouched("all", true);
    const nextStep = activeStep + 1;
    if (nextStep < steps.length) {
      setActiveStep((prevStep) => prevStep + 1);
    } else if (nextStep === steps.length) {
      //@ts-ignore
      if (formikRef.current) {
        //@ts-ignore
        formikRef.current?.submitForm();
      }
    }
  };

  const handlePrevious = (setFieldTouched: any) => {
    setFieldTouched("all", true);
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async (values: any) => {
    const payload = {
      business_id: values.business_id,
      categories: values.categories.map((cat: any) => cat.id),
      city: values.city[0].id,
      primary_currency: values.primary_currency[0].id,
      secondary_currency: values.enable_exchange_rate
        ? values.secondary_currency[0].id
        : null,
      exchange_rate: values.enable_exchange_rate
        ? values.exchange_rate.replace(".", "").replace(",", ".")
        : null,
    };
    console.log("Form payload", payload);
    // return;
    try {
      const response = await createBusinessProfile(payload);
      ShowNotification({
        message: "Configuración creada con éxito",
        type: "success",
      });
      useSessionStore.getState().updateUserConfiguration(true);
      navigate(ROUTES.HOME);
    } catch (error: any) {
      ShowNotification({ message: error.message, type: "error" });
    }
  };

  const isStepValid = (step: number, values: any) => {
    switch (step) {
      case 0:
        return !!values.business_id && values.categories?.length > 0;
      case 1:
        return (
          values.country.length > 0 &&
          values.city.length > 0 &&
          !!values.business_type
        );
      case 2:
        return (
          values.primary_currency.length > 0 &&
          !(!(values.secondary_currency.length < 1) && !values.exchange_rate)
        );
      default:
        return false;
    }
  };

  const [selected, setSelected] = useState<Category[]>([]);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);
  const [selectedPrimaryCurrencies, setSelectedPrimaryCurrencies] = useState(
    []
  );
  const [selectedSecondaryCurrencies, setSelectedSecondaryCurrencies] =
    useState([]);

  const phoneNumber = useSessionStore((state: any) => state.user?.phone_number);

  const isParaguayan = phoneNumber?.startsWith("595");

  useEffect(() => {
    setLocalCategories(categories);
  }, [categories]);

  useEffect(() => {
    setLocalCountries(countries);
  }, [countries]);

  useEffect(() => {
    setLocalCities(cities);
  }, [cities]);

  useEffect(() => {
    setLocalPrimaryCurrencies(currencies);
    setLocalSecondaryCurrencies(currencies);
  }, [currencies]);

  useEffect(() => {
    //@ts-ignore
    const primaryCurrency = formikRef.current?.values?.primary_currency[0];
    console.log("primaryCurrency", primaryCurrency);
    if (primaryCurrency && currencies)
      setLocalSecondaryCurrencies(
        currencies.filter((curr: any) => curr.id !== primaryCurrency.id)
      );
    //@ts-ignore
  }, [formikRef.current?.values?.primary_currency, currencies]);

  useEffect(() => {
    //@ts-ignore
    console.log("formikRef.current?.values?", formikRef.current?.values);
    //@ts-ignore
  }, [formikRef.current?.values]);

  useEffect(() => {
    //@ts-ignore
    if (formikRef.current?.values?.categories)
      //@ts-ignore
      setSelected(formikRef.current?.values?.categories);
    //@ts-ignore
  }, [formikRef.current?.values?.categories]);

  useEffect(() => {
    // handles country auto completion from phone number
    if (phoneNumber && countries && countries.length > 0) {
      // Si el campo "country" aún está vacío
      //@ts-ignore
      if (
        //@ts-ignore
        !formikRef.current?.values.country ||
        //@ts-ignore
        formikRef.current?.values.country.length === 0
      ) {
        const autoCountry = isParaguayan
          ? countries.find((c: any) => c.name.toLowerCase() === "paraguay")
          : countries.find((c: any) => c.name.toLowerCase() === "venezuela");
        if (autoCountry) {
          //@ts-ignore
          formikRef.current?.setFieldValue("country", [autoCountry]);
          setSelectedCountry(autoCountry?.id);
          // Opcional: reiniciar el campo de ciudad
          //@ts-ignore
          formikRef.current?.setFieldValue("city", []);
        }
      }
    }
  }, [phoneNumber, countries, isParaguayan]);

  useEffect(() => {
    //@ts-ignore
    const selectedPrimaryCurrency = formikRef.current?.values?.primary_currency;
    setLocalSecondaryCurrencies((prevState) =>
      prevState?.filter((currency) =>
        !!selectedPrimaryCurrency
          ? //@ts-ignore
            currency.id !== selectedPrimaryCurrency.id
          : currencies
      )
    );
    //@ts-ignore
  }, [currencies, formikRef.current?.values?.primary_currency]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid
          item
          xs={12}
          md={4}
          sx={{
            display: {
              xs: "none",
              md: "block",
              backgroundColor: theme.palette.primary.main + "1A",
            },
            paddingLeft: { md: `${theme.spacing(15)} !important` },
            paddingRight: { md: `${theme.spacing(15)} !important` },
            paddingTop: { md: `${theme.spacing(12)} !important` },
          }}
        >
          <Box
            display={"flex"}
            flexDirection={"column"}
            minHeight="100vh"
            sx={{ padding: 2 }}
          >
            <LogoMarkyBlack style={{ marginBottom: theme.spacing(6) }} />
            <Typography variant="h1" sx={{ marginBottom: theme.spacing(4) }}>
              <Box sx={{ marginBottom: theme.spacing(2) }}>
                Configuración para tu cuenta
              </Box>
              {user.business_name && (
                <span style={{ color: theme.palette.primary.main }}>
                  {user.business_name}
                </span>
              )}
            </Typography>
            <Typography variant="body2" gutterBottom>
              Estamos orgullosos de formar parte de tu crecimiento
            </Typography>
            <Box
              display="flex"
              justifyContent="center"
              sx={{ marginTop: theme.spacing(24) }}
            >
              <LoginImage />
            </Box>
          </Box>
        </Grid>
        {/* ==================================================== */}
        <Grid
          item
          xs={12}
          md={8}
          sx={{
            paddingTop: { md: `${theme.spacing(6)} !important` },
            paddingRight: { md: theme.spacing(9) },
          }}
        >
          {/*  */}
          <Box
            display={"flex"}
            justifyContent={"end"}
            width={"100%"}
            sx={{
              paddingBottom: { md: `${theme.spacing(24)} !important` },
              // paddingRight: { md: theme.spacing(9) },
            }}
          >
            {/* DESKTOP HEADER */}
            <Box
              gap={2}
              sx={{
                display: {
                  xs: "none",
                  md: "flex",
                },
              }}
            >
              <Link to={`${ROUTES.LOGOUT}`}>
                <Typography variant="link">Cerrar sesión</Typography>
              </Link>
            </Box>
            {/* MOBILE HEADER */}
            <Box
              sx={{
                width: "100%",
                padding: theme.spacing(2.75, 4, 2, 4),
                gap: 0,
                boxShadow: "0px 1px 0px 0px #E8E9EB",
                display: {
                  xs: "flex",
                  md: "none",
                },
              }}
              justifyContent={"flex-start"}
            >
              <Box>
                <LogoMarkyBlack />
              </Box>
            </Box>
          </Box>
          {/*  */}
          <Box
            sx={{
              width: { xs: "100%", md: "72%" },
              margin: "auto",
            }}
          >
            <Stepper
              activeStep={activeStep}
              alternativeLabel
              connector={<CustomConnector />}
            >
              {steps.map((step, idx) => (
                <Step key={`step-${idx}`}>
                  <StepLabel sx={{ fontWeight: "bold" }} />
                </Step>
              ))}
            </Stepper>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                marginTop: theme.spacing(8),
                width: {
                  xs: "100%",
                  md: "50%",
                },
              }}
            >
              <Formik
                innerRef={formikRef}
                initialValues={initialValues}
                validationSchema={validationSchema[activeStep]}
                onSubmit={handleSubmit}
              >
                {({
                  setFieldTouched,
                  values,
                  errors,
                  touched,
                  setFieldValue,
                  setFieldError,
                  handleChange,
                  handleBlur,
                  isValid,
                  dirty,
                }) => (
                  <Form>
                    <Typography
                      variant="h2"
                      sx={{
                        textAlign: { xs: "center", md: "left" },
                        marginBottom: theme.spacing(8),
                      }}
                    >
                      {steps[activeStep].title}
                    </Typography>

                    <Box>
                      {/* =================== PASO 1 =================== */}
                      {activeStep === 0 && (
                        <>
                          <Field
                            name="business_id"
                            component={Input}
                            maxLength={24}
                            placeholder="Escribe tu usuario..."
                            label="Nombre del comercio"
                            required
                            value={values.business_id}
                            onChange={(e: React.ChangeEvent<any>) => {
                              setFieldValue("business_id", e.target.value);
                            }}
                            onBlur={handleBlur}
                            // onBlur={async (
                            //   e: React.FocusEvent<HTMLInputElement>
                            // ) => {
                            //   handleBlur(e);
                            //   if (e.target.value) {
                            //     try {
                            //       const result = await validateBusinessName(
                            //         e.target.value
                            //       );
                            //       if (result.is_taken) {
                            //         console.log(
                            //           "IS TAKEN!!!!!",
                            //           touched.business_id
                            //         );
                            //         setFieldError(
                            //           "business_id",
                            //           "Este nombre de negocio ya existe"
                            //         );
                            //         setFieldTouched("business_id", true);
                            //       }
                            //     } catch (error) {
                            //       console.error(
                            //         "Error validating business name",
                            //         error
                            //       );
                            //     }
                            //   }
                            // }}
                            fullWidth
                            variant="outlined"
                            margin="normal"
                            error={
                              !!touched.business_id &&
                              Boolean(errors.business_id)
                            }
                            helperText={
                              !!touched.business_id && errors.business_id
                            }
                          />
                          {/*  */}
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "stretch",
                              justifyContent: "flex-start",
                              border: `1px solid ${colors.light.grey[800]}`,
                              borderRadius: theme.spacing(1),
                              paddingX: theme.spacing(10),
                              paddingY: theme.spacing(4),
                              marginTop: theme.spacing(4),
                            }}
                          >
                            <Typography
                              variant="h5"
                              sx={{ marginBottom: theme.spacing(2) }}
                            >
                              Tipo de negocio
                            </Typography>
                            <Paragraph>
                              Ayudará a las personas a encontrar comercios como
                              el tuyo.
                              <br />
                              Ej. Panadería
                            </Paragraph>
                            <Field
                              component={CustomSelectorField}
                              label="Categoría"
                              name="categories"
                              onOpen={() => setOpenCategoriesModal(true)}
                              required
                              value={values.categories}
                              maxSelected={3}
                              placeholder="Seleccionar categoría comercial"
                              options={categories?.map((cat: any) => ({
                                value: cat.id,
                                label: cat.name,
                              }))}
                              onChange={handleChange}
                              fullWidth
                              variant="outlined"
                              margin="normal"
                              error={!!dirty && values.categories.length === 0}
                              helperText={<ErrorMessage name="categories" />}
                              maxSelectable={2}
                              sx={{
                                marginTop: theme.spacing(3),
                                marginBottom: theme.spacing(3),
                              }}
                            />
                          </Box>
                        </>
                      )}
                      {/* =================== PASO 2 =================== */}
                      {activeStep === 1 && (
                        <>
                          <Field
                            component={CustomSelectorField}
                            displayAsInput={true}
                            label="País"
                            name="country"
                            onOpen={() => setOpenCountriesModal(true)}
                            required
                            value={values.country}
                            maxSelected={1}
                            placeholder="Selecciona tu país"
                            options={countries?.map((cat: any) => ({
                              value: cat.id,
                              label: cat.name,
                            }))}
                            onChange={handleChange}
                            fullWidth
                            variant="outlined"
                            margin="normal"
                            error={touched?.country && Boolean(errors?.country)}
                            helperText={<ErrorMessage name="country" />}
                            maxSelectable={2}
                            sx={{
                              marginTop: theme.spacing(3),
                              marginBottom: theme.spacing(3),
                            }}
                          />
                          <Field
                            component={CustomSelectorField}
                            label="Ciudad"
                            name="city"
                            onOpen={() => setOpenCitiesModal(true)}
                            required
                            value={values.city}
                            maxSelected={1}
                            placeholder="Selecciona tu ciudad"
                            options={cities?.map((cat: any) => ({
                              value: cat.id,
                              label: cat.name,
                            }))}
                            onChange={handleChange}
                            fullWidth
                            variant="outlined"
                            margin="normal"
                            error={touched.city && Boolean(errors?.city)}
                            helperText={<ErrorMessage name="city" />}
                            maxSelectable={2}
                            sx={{
                              marginTop: theme.spacing(3),
                              marginBottom: theme.spacing(3),
                            }}
                          />

                          {/* ========================== */}
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "stretch",
                              justifyContent: "flex-start",
                              border: `1px solid ${colors.light.grey[800]}`,
                              borderRadius: theme.spacing(1),
                              paddingX: theme.spacing(6),
                              paddingY: theme.spacing(4),
                              marginTop: theme.spacing(4),
                            }}
                          >
                            <FormLabel
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                                marginBottom: 2,
                              }}
                            >
                              <CoffeeIcon />
                              Tipo de negocio
                            </FormLabel>
                            <Field
                              name="business_type"
                              component={BusinessTypeSelectorField}
                              // label="Tipo de negocio"
                              required
                              options={[
                                {
                                  value: "commercial",
                                  label: "Comercial",
                                  description:
                                    "Tu negocio dispone de sucursal para recibir clientes o comensales",
                                },
                                {
                                  value: "entrepreneur",
                                  label: "Emprendedor",
                                  description:
                                    "Tu negocio aun no cuenta con sucursal. Opera desde un centro de producción.",
                                },
                              ]}
                              sx={{ marginTop: 2, marginBottom: 2 }}
                            />
                          </Box>
                          {/* ========================== */}
                        </>
                      )}
                      {/* =================== PASO 3 =================== */}
                      {activeStep === 2 && (
                        <>
                          <Field
                            component={CustomSelectorField}
                            label="Moneda de uso"
                            name="primary_currency"
                            onOpen={() => setOpenPrimaryCurrencyModal(true)}
                            required
                            value={values.primary_currency}
                            maxSelected={1}
                            placeholder="Selecciona tu moneda"
                            options={currencies?.map((cat: any) => ({
                              value: cat.id,
                              label: cat.name,
                            }))}
                            onChange={handleChange}
                            fullWidth
                            variant="outlined"
                            margin="normal"
                            error={
                              !!values.primary_currency &&
                              values.primary_currency.length === 0
                            }
                            helperText={
                              <ErrorMessage name="primary_currency" />
                            }
                            maxSelectable={1}
                            sx={{
                              marginTop: theme.spacing(3),
                              marginBottom: theme.spacing(3),
                            }}
                          />
                          <Typography
                            id="modal-description"
                            variant="body2"
                            sx={{ mt: 2, mb: 4 }}
                          >
                            Expresión en la que se mostrarán los precios de tus
                            productos.
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "stretch",
                              justifyContent: "flex-start",
                              border: `1px solid ${colors.light.grey[800]}`,
                              borderRadius: theme.spacing(1),
                              paddingX: theme.spacing(4),
                              paddingY: theme.spacing(4),
                              marginTop: theme.spacing(4),
                            }}
                          >
                            <FormLabel>Precios con tasa de cambio</FormLabel>
                            <FormControlLabel
                              control={
                                <Switch
                                  checked={values.enable_exchange_rate}
                                  onChange={(e) => {
                                    const checkedValue = e.target.checked;
                                    setFieldValue(
                                      "enable_exchange_rate",
                                      checkedValue
                                    );
                                    if (!checkedValue) {
                                      setFieldValue("secondary_currency", "");
                                      setFieldValue("exchange_rate", "");
                                    }
                                  }}
                                />
                              }
                              label="Activar"
                            />
                            <Typography
                              id="modal-description"
                              variant="body2"
                              sx={{ mt: 2, mb: 4 }}
                            >
                              Se mostrará el valor de cambio en tus productos.
                            </Typography>
                            {values.enable_exchange_rate && (
                              <>
                                <Field
                                  component={CustomSelectorField}
                                  label="Moneda Secundaria"
                                  name="secondary_currency"
                                  onOpen={() =>
                                    setOpenSecondaryCurrencyModal(true)
                                  }
                                  required
                                  value={values.secondary_currency}
                                  maxSelected={1}
                                  placeholder="Selecciona moneda secundaria"
                                  options={currencies
                                    ?.filter(
                                      (curr: any) =>
                                        //@ts-ignore
                                        curr.id !== values.primary_currency?.id
                                    )
                                    .map((cat: any) => ({
                                      value: cat.id,
                                      label: cat.name,
                                    }))}
                                  onChange={handleChange}
                                  fullWidth
                                  variant="outlined"
                                  margin="normal"
                                  error={
                                    !!values.secondary_currency &&
                                    values.secondary_currency.length === 0
                                  }
                                  helperText={
                                    <ErrorMessage name="secondary_currency" />
                                  }
                                  maxSelectable={1}
                                  sx={{
                                    marginTop: theme.spacing(3),
                                    marginBottom: theme.spacing(3),
                                  }}
                                />

                                {values.secondary_currency.length > 0 && (
                                  <Box>
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 2,
                                        width: "100%",
                                      }}
                                    >
                                      <Box
                                        sx={{
                                          width: "15%",
                                          backgroundColor: "#FFF4E8",
                                          paddingX: 2,
                                          paddingY: 4,
                                          borderRadius: 2,
                                          textAlign: "center",
                                        }}
                                      >
                                        <Typography
                                          id="modal-description"
                                          variant="body2"
                                        >
                                          {/* @ts-ignore */}
                                          {values.is_primary_to_secondary
                                            ? // @ts-ignore
                                              `1 ${values.primary_currency[0].code}`
                                            : // @ts-ignore
                                              `1 ${values.secondary_currency[0].code}`}
                                        </Typography>
                                      </Box>

                                      <Box sx={{ width: "20%" }}>
                                        <Typography
                                          id="modal-description"
                                          variant="body2"
                                        >
                                          es igual a:
                                        </Typography>
                                      </Box>

                                      <Field
                                        component={NumberInput}
                                        name="exchange_rate"
                                        value={values.exchange_rate}
                                        onChange={handleChange}
                                        variant="outlined"
                                        margin="normal"
                                        InputProps={{
                                          endAdornment: (
                                            <InputAdornment position="end">
                                              <Typography variant="body2">
                                                {values.is_primary_to_secondary
                                                  ? values.secondary_currency[0] //@ts-ignore
                                                      ?.code
                                                  : values.primary_currency[0] //@ts-ignore
                                                      ?.code}
                                              </Typography>
                                            </InputAdornment>
                                          ),
                                        }}
                                      />

                                      <Button
                                        variant="outlined"
                                        sx={{
                                          border: 0,
                                          backgroundColor:
                                            colors.light.grey[400],
                                        }}
                                        onClick={() => {
                                          setFieldValue(
                                            "is_primary_to_secondary",
                                            !values.is_primary_to_secondary
                                          );
                                          setFieldValue("exchange_rate", 0);
                                        }}
                                      >
                                        <ExchangeIcon />
                                      </Button>
                                    </Box>
                                    <Box sx={{ marginTop: 4 }}>
                                      <Typography
                                        variant="caption"
                                        sx={{
                                          color: colors.light.grey[900],
                                        }}
                                      >
                                        Podrás ajustar esto en cualquier otro
                                        momento
                                      </Typography>
                                    </Box>
                                  </Box>
                                )}
                              </>
                            )}
                          </Box>
                        </>
                      )}
                    </Box>
                    <Box
                      sx={{
                        marginTop: theme.spacing(7),
                        width: "100%",
                        display: "flex",
                        gap: 3,
                      }}
                    >
                      {activeStep > 0 && (
                        <Button
                          variant="contained"
                          color="inherit"
                          sx={{
                            color: "#4B4B4B",
                            boxShadow: "unset",
                          }}
                          onClick={() => handlePrevious(setFieldTouched)}
                        >
                          Volver
                        </Button>
                      )}
                      <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={() => handleNext(setFieldTouched)}
                        disabled={
                          !isValid || !dirty || !isStepValid(activeStep, values)
                        }
                      >
                        {activeStep === steps.length - 1
                          ? "Finalizar"
                          : " Siguiente"}
                      </Button>
                    </Box>
                  </Form>
                )}
              </Formik>
            </Box>
          </Box>
        </Grid>
      </Grid>
      {/* ================ MODAL CATEGORIAS =================== */}
      <CustomModal
        sx={{
          width: {
            xs: "90%",
            md: "50%",
          },
        }}
        open={openCategoriesModal}
        primaryActionLabel="Aplicar"
        title="¿Cuál categoría te identifica?"
        onClose={() => setOpenCategoriesModal(false)}
        primaryActionParams={selected}
        primaryAction={(selectedCategories) => {
          //@ts-ignore
          formikRef.current?.setFieldValue("categories", selectedCategories);
          setOpenCategoriesModal(false);
        }}
      >
        <SearchInput
          placeholder="Buscar por nombre"
          sx={{ width: "100%" }}
          onChange={(event: any) => {
            const searchTerm = event.target.value;
            const filteredCategories = categories.filter((cat: any) =>
              cat.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setLocalCategories(filteredCategories);
          }}
        />
        <Typography
          id="modal-description"
          variant="body2"
          sx={{ mt: 2, mb: 4 }}
        >
          Puedes seleccionar hasta 3 categorías para tu negocio.
        </Typography>
        <FormLabel sx={{ fontSize: "16px" }}>Lista de categorías</FormLabel>
        {/*  */}
        <CategorySelectionList
          categories={localCategories}
          maxSelectable={3}
          initialSelected={[]}
          selected={selected}
          setSelected={setSelected}
        />
      </CustomModal>
      {/* ================ MODAL PAISES =================== */}
      <CustomModal
        sx={{
          width: {
            xs: "90%",
            md: "50%",
          },
        }}
        open={openCountriesModal}
        primaryActionLabel="Aplicar"
        title="¿En cuál país te encuentras?"
        onClose={() => setOpenCountriesModal(false)}
        primaryActionParams={selectedCountries}
        primaryAction={(selectedCountries) => {
          console.log("selectedCountries ====", selectedCountries);
          //@ts-ignore
          formikRef.current?.setFieldValue("country", selectedCountries);
          //@ts-ignore
          formikRef.current?.setFieldValue("city", "");
          //@ts-ignore
          setSelectedCountry(selectedCountries[0]?.id);
          setOpenCountriesModal(false);
        }}
      >
        <SearchInput
          placeholder="Buscar por nombre"
          sx={{ width: "100%", mb: 4 }}
          onChange={(event: any) => {
            const searchTerm = event.target.value;
            const filteredIems = countries.filter((cat: any) =>
              cat.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setLocalCountries(filteredIems);
          }}
        />
        <FormLabel sx={{ fontSize: "16px" }}>
          Lista de países disponibles
        </FormLabel>
        {/*  */}
        {countries?.length > 0 && (
          <CategorySelectionList
            categories={localCountries}
            maxSelectable={1}
            initialSelected={[]}
            selected={selectedCountries}
            setSelected={setSelectedCountries}
          />
        )}
      </CustomModal>
      {/* ================ MODAL CIUDADES =================== */}
      <CustomModal
        sx={{
          width: {
            xs: "90%",
            md: "50%",
          },
        }}
        open={openCitiesModal}
        primaryActionLabel="Aplicar"
        title="¿En cuál ciudad te encuentras?"
        onClose={() => setOpenCitiesModal(false)}
        primaryActionParams={selectedCities}
        primaryAction={(selectedCities) => {
          console.log("selectedCities ====", selectedCities);
          //@ts-ignore
          formikRef.current?.setFieldValue("city", selectedCities);
          setOpenCitiesModal(false);
        }}
      >
        <SearchInput
          placeholder="Buscar por nombre"
          sx={{ width: "100%", mb: 4 }}
          onChange={(event: any) => {
            const searchTerm = event.target.value;
            const filteredIems = cities.filter((cat: any) =>
              cat.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setLocalCities(filteredIems);
          }}
        />
        <FormLabel sx={{ fontSize: "16px" }}>Lista de ciudades</FormLabel>
        {/*  */}
        <CategorySelectionList
          categories={localCities}
          maxSelectable={1}
          initialSelected={[]}
          selected={selectedCities}
          setSelected={setSelectedCities}
        />
      </CustomModal>
      {/* ================ MODAL MONEDAS =================== */}
      <CustomModal
        sx={{
          width: {
            xs: "90%",
            md: "50%",
          },
        }}
        open={openPrimaryCurrencyModal}
        primaryActionLabel="Aplicar"
        title="¿Cuál es tu expresión monetaria?"
        onClose={() => setOpenPrimaryCurrencyModal(false)}
        primaryActionParams={selectedPrimaryCurrencies}
        primaryAction={(selectedPrimaryCurrencies) => {
          console.log(
            "selectedPrimaryCurrencies ====",
            selectedPrimaryCurrencies
          );
          //@ts-ignore
          formikRef.current?.setFieldValue(
            "primary_currency",
            selectedPrimaryCurrencies
          );
          setOpenPrimaryCurrencyModal(false);
        }}
      >
        <SearchInput
          placeholder="Buscar por nombre"
          sx={{ width: "100%", mb: 4 }}
          onChange={(event: any) => {
            const searchTerm = event.target.value;
            const filteredIems = currencies.filter((cat: any) =>
              cat.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setLocalPrimaryCurrencies(filteredIems);
          }}
        />
        <FormLabel sx={{ fontSize: "16px" }}>
          Lista de monedas disponibles
        </FormLabel>
        {/*  */}
        <CategorySelectionList
          categories={localPrimaryCurrencies}
          maxSelectable={1}
          initialSelected={[]}
          selected={selectedPrimaryCurrencies}
          setSelected={setSelectedPrimaryCurrencies}
        />
      </CustomModal>
      {/* ================ MODAL MONEDAS SECUNDARIAS =================== */}
      <CustomModal
        sx={{
          width: {
            xs: "90%",
            md: "50%",
          },
        }}
        open={openSecondaryCurrencyModal}
        primaryActionLabel="Aplicar"
        title="¿Cuál es tu expresión monetaria?"
        onClose={() => setOpenSecondaryCurrencyModal(false)}
        primaryActionParams={selectedSecondaryCurrencies}
        primaryAction={(selectedSecondaryCurrencies) => {
          console.log(
            "selectedSecondaryCurrencies ====",
            selectedSecondaryCurrencies
          );
          //@ts-ignore
          formikRef.current?.setFieldValue(
            "secondary_currency",
            selectedSecondaryCurrencies
          );
          setOpenSecondaryCurrencyModal(false);
        }}
      >
        <SearchInput
          placeholder="Buscar por nombre"
          sx={{ width: "100%", mb: 4 }}
          onChange={(event: any) => {
            const searchTerm = event.target.value;
            const filteredIems = currencies.filter(
              (cat: any) =>
                cat.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
                //@ts-ignore
                formikRef.current?.values?.primary_currency.id !== cat.id
            );
            setLocalPrimaryCurrencies(filteredIems);
          }}
        />
        <FormLabel sx={{ fontSize: "16px" }}>
          Lista de monedas disponibles
        </FormLabel>
        {/*  */}
        <CategorySelectionList
          categories={localSecondaryCurrencies}
          maxSelectable={1}
          initialSelected={[]}
          selected={selectedSecondaryCurrencies}
          setSelected={setSelectedSecondaryCurrencies}
        />
      </CustomModal>
    </Box>
  );
};

export default Configuration;
