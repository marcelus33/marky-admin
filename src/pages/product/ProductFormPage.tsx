import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Form, Formik, FormikHelpers, FormikProps } from "formik";
import { useEffect, useRef, useState } from "react";
import {
  useNavigate,
  useParams,
  useLocation,
  // unstable hook used to block in-app navigation when the form is dirty.
  // This exists in react-router v6 as an unstable API and is commonly
  // re-exported by react-router-dom. We cast to any where necessary to
  // avoid type issues.
} from "react-router-dom";
import * as Yup from "yup";
import { Header } from "../../components/Header";
import {
  useCreateProduct,
  useUpdateProduct,
} from "../../hooks/useProductMutations";
import { ROUTES } from "../../routes/paths";
import { getProductById } from "../../services/productService";
import { Category } from "../../types/category";
import { Product } from "../../types/product";
import { objectToFormData } from "../../utils/formData";
import AssignCategoryModal from "./components/AssignCategoryModal";
import ExtrasSection from "./components/ExtrasSection";
import HighlightSection from "./components/HighlightSection";
import ProductFormHeader from "./components/ProductFormHeader";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import useDeleteProduct from "../../hooks/useDeleteProduct";
import ProductSection from "./components/ProductSection";
import SubmitSection from "./components/SubmitSection";
import VariationsSection from "./components/VariationsSection";
import { ReactComponent as ProductoMenuIcon } from "../../assets/icons/product-form/producto-menu.svg";
import { ReactComponent as VariacionesMenuIcon } from "../../assets/icons/product-form/variaciones-menu.svg";
import { ReactComponent as AdicionalesProductoMenuIcon } from "../../assets/icons/product-form/adicionales-menu.svg";
import { ReactComponent as DestacarMenuIcon } from "../../assets/icons/product-form/destacar-menu.svg";

// unstable_useBlocker is exported from react-router (not react-router-dom) in
// some versions. Import it dynamically and cast to any to avoid type errors
// when typings are not present.
// NOTE: We intentionally avoid react-router's unstable useBlocker here
// because it's not available in all versions and caused runtime errors.
// We'll implement a local navigation guard (pendingNavigationRef +
// document click / popstate interception) instead.

const validationSchema = Yup.object().shape({
  name: Yup.string().required("El nombre del producto es requerido"),
  description: Yup.string().required("La descripción es requerida"),
  price: Yup.number()
    .required("El precio es requerido")
    .positive("El precio debe ser un número positivo"),
  category: Yup.number().nullable().required("La categoría es requerida"),
  variants: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required("El nombre de la presentación es requerido"),
      description: Yup.string(),
      price: Yup.number()
        .required("El precio es requerido")
        .positive("El precio debe ser un número positivo"),
    }),
  ),
  addons: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required("El nombre del adicional es requerido"),
      price: Yup.number()
        .required("El precio es requerido")
        .positive("El precio debe ser un número positivo"),
    }),
  ),
  stopper: Yup.string(),
  isPromotionActive: Yup.boolean(),
  promotionOption: Yup.string(),
  discountPercentage: Yup.number().min(0).max(100),
  multibuyOption: Yup.string().nullable(),
  countdownActive: Yup.boolean(),
  promotionStartDate: Yup.string().when("countdownActive", {
    is: true,
    then: (schema) => schema.required("La fecha de inicio es requerida"),
    otherwise: (schema) => schema.nullable(),
  }),
  promotionStartTime: Yup.string().when("countdownActive", {
    is: true,
    then: (schema) => schema.required("La hora de inicio es requerida"),
    otherwise: (schema) => schema.nullable(),
  }),
  promotionEndDate: Yup.string().when("countdownActive", {
    is: true,
    then: (schema) => schema.required("La fecha de fin es requerida"),
    otherwise: (schema) => schema.nullable(),
  }),
  promotionEndTime: Yup.string().when("countdownActive", {
    is: true,
    then: (schema) => schema.required("La hora de fin es requerida"),
    otherwise: (schema) => schema.nullable(),
  }),
});

const parseDateTime = (dateTimeStr: string | undefined) => {
  if (!dateTimeStr) return { date: "", time: "" };
  const date = new Date(dateTimeStr);
  const dateStr = date.toISOString().split("T")[0];
  const timeStr = date.toTimeString().split(" ")[0].substring(0, 5);
  return { date: dateStr, time: timeStr };
};

const ProductFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState("Producto");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const deleteMutation = useDeleteProduct();
  const isDeleting =
    (deleteMutation as any).isLoading ||
    (deleteMutation as any).status === "loading";

  const [initialValues, setInitialValues] = useState<Product>({
    name: "",
    description: "",
    price: 0,
    category: null,
    is_active: true,
    is_available: true,
    variants: [],
    addons: [],
    stopper: "",
    isPromotionActive: false,
    promotionOption: "",
    discountPercentage: 0,
    multibuyOption: "",
    countdownActive: false,
    promotionStartDate: "",
    promotionStartTime: "",
    promotionEndDate: "",
    promotionEndTime: "",
    media: [],
  });

  const formikRef = useRef<FormikProps<Product>>(null);
  const location = useLocation();
  // track a lightweight "dirty" flag for the page. We'll set this to true
  // whenever the form DOM changes (via <Form onChange>), and reset on
  // successful submit. This is intentionally simple and covers the common
  // cases (input changes, selects, file inputs triggering change events).
  const [isFormDirty, setIsFormDirty] = useState(false);

  // Dialog state for the "leave with unsaved changes" confirmation.
  const [openExitDialog, setOpenExitDialog] = useState(false);

  // pendingNavigationRef holds a function that, when executed, performs the
  // navigation the user attempted (clicking a link, navigating programmatically,
  // or using the back button). We set it when we intercept a navigation and
  // call it if the user confirms they want to leave.
  const pendingNavigationRef = useRef<(() => void) | null>(null);

  // Attempt a navigation action; if the form is dirty, store the action and
  // show the confirmation dialog. Otherwise execute immediately.
  const attemptNavigate = (action: () => void) => {
    if (isFormDirty) {
      pendingNavigationRef.current = action;
      setOpenExitDialog(true);
    } else {
      action();
    }
  };

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const product = await getProductById(Number(id));
          const {
            promotionStartDate: promotionStartsAt,
            promotionEndDate: promotionEndsAt,
            multibuyOption,
            discountPercentage,
          } = product;

          const { date: promotionStartDate, time: promotionStartTime } =
            parseDateTime(promotionStartsAt);
          const { date: promotionEndDate, time: promotionEndTime } =
            parseDateTime(promotionEndsAt);

          const isPromotionActive =
            !!multibuyOption ||
            (!!discountPercentage && Number(discountPercentage) > 0);
          const promotionOption = multibuyOption
            ? "oferta"
            : discountPercentage
              ? "descuento"
              : "";
          const { category, ...productTemp } = product;
          //
          const mappedMedia =
            product.media?.map((m: any) => ({
              id: m.id,
              file: m.file, // keep URL string, not File
              originalFile: m.file,
              media_type: m.media_type,
              product: m.product,
              order: m.order,
              _delete: false,
            })) ?? [];

          const mappedVariants =
            product.variants?.map((v: any) => ({
              id: v.id,
              name: v.name,
              price: Number(v.price),
              description: v.description,
              image: v.image, // URL string for existing
            })) ?? [];
          //
          const initialValues: Product = {
            ...productTemp,
            // map backend availability to both fields for compatibility
            is_available:
              (product as any).is_available ?? productTemp.is_active,
            //
            media: mappedMedia,
            variants: mappedVariants,
            addons:
              product.addons?.map((a: any) => ({
                id: a.id,
                name: a.name,
                price: Number(a.price),
              })) ?? [],
            //
            isPromotionActive,
            promotionOption,
            multibuyOption: multibuyOption,
            discountPercentage: discountPercentage,
            countdownActive: !!promotionStartsAt,
            promotionStartDate,
            promotionStartTime,
            promotionEndDate,
            promotionEndTime,
            //@ts-ignore
            category: product.category?.id,
          };
          setInitialValues(initialValues);
          if (product.category) {
            setSelectedCategory({
              id: product.category.id,
              label: product.category.name,
              name: product.category.name,
              order: 0,
            });
          }
        } catch (error) {
          console.error("Failed to fetch product", error);
        }
      };
      fetchProduct();
    }
    // if there's a duplicated product passed via navigation state (create from duplicate)
    if (!id && (location.state as any)?.duplicatedProduct) {
      const dp = (location.state as any).duplicatedProduct as Product;
      setInitialValues(dp);
      if (dp.category) {
        // dp.category may be a number or an object; normalize to id
        const categoryId =
          typeof dp.category === "object"
            ? (dp.category as any).id
            : (dp.category as unknown as number);
        if (categoryId) {
          setSelectedCategory({
            id: categoryId,
            label: "",
            name: "",
            order: 0,
          });
        }
      }
    }
    // location.state is intentionally omitted: this effect must only run when
    // `id` changes. The duplicate-product state is read once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Reset dirty state when initial values are loaded/changed (e.g. after
  // fetching existing product or duplicating). This prevents showing the
  // prompt immediately after the form is initialized.
  useEffect(() => {
    setIsFormDirty(false);
  }, [initialValues]);

  // We handle in-app navigation prompts by using attemptNavigate helper
  // below which sets pendingNavigationRef and opens the dialog when the
  // form is dirty. No unstable react-router hooks required.

  // Browser-level refresh / tab close: show native confirmation when dirty.
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isFormDirty) return;
      // Standard way to trigger browser confirmation dialog
      e.preventDefault();
      // Some browsers require setting returnValue to a non-empty string
      e.returnValue = "";
      return "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isFormDirty]);

  const handleDrawerClose = () => {
    setMobileOpen(false);
  };

  const handleSectionSelect = (sectionName: string) => {
    setSelectedSection(sectionName);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const sections = [
    {
      name: "Producto",
      icon: <ProductoMenuIcon />,
      component: (props: any) => (
        <ProductSection
          formik={props}
          onOpenModal={() => setIsModalOpen(true)}
          selectedCategory={selectedCategory}
        />
      ),
    },
    {
      name: "Variaciones",
      icon: <VariacionesMenuIcon />,
      component: (props: any) => <VariationsSection {...props} />,
    },
    {
      name: "Adicionales o extras",
      icon: <AdicionalesProductoMenuIcon />,
      component: (props: any) => <ExtrasSection {...props} />,
    },
    {
      name: "Destacar producto",
      icon: <DestacarMenuIcon />,
      component: (props: any) => <HighlightSection {...props} />,
    },
  ];

  const selectedComponent = sections.find(
    (section) => section.name === selectedSection,
  )?.component;

  return (
    <Formik
      innerRef={formikRef}
      initialValues={initialValues}
      enableReinitialize
      validationSchema={validationSchema}
      onSubmit={async (
        values: Product,
        { setSubmitting }: FormikHelpers<Product>,
      ) => {
        console.log("submitting.....", values);

        // 1) Build promotion ISO strings as before
        const {
          promotionStartDate,
          promotionStartTime,
          promotionEndDate,
          promotionEndTime,
        } = values;

        const promotionStartsAt =
          promotionStartDate && promotionStartTime
            ? new Date(
                `${promotionStartDate}T${promotionStartTime}`,
              ).toISOString()
            : null;
        const promotionEndsAt =
          promotionEndDate && promotionEndTime
            ? new Date(`${promotionEndDate}T${promotionEndTime}`).toISOString()
            : null;

        // 2) Basic cleaned copy (map category to id if object)
        const submissionValues: any = {
          ...values,
          media: values.media?.map((item: any) => {
            if (item.isNew) {
              const { id, ...rest } = item; // remove temporary id for new files
              return rest;
            }
            return item; // existing items keep id
          }),
          category:
            values.category && typeof values.category === "object"
              ? ((values.category as any).id ?? null)
              : (values.category ?? null),
          promotion_starts_at: promotionStartsAt,
          promotion_ends_at: promotionEndsAt,
          // coerce discount safely
          discount_percentage:
            values.discountPercentage &&
            !isNaN(Number(values.discountPercentage))
              ? Number(values.discountPercentage)
              : 0,
          // coerce multibuy_option to a plain string (pick first if array)
          multibuy_option:
            Array.isArray(values.multibuyOption) &&
            values.multibuyOption.length > 0
              ? String(values.multibuyOption[0])
              : values.multibuyOption
                ? String(values.multibuyOption)
                : "",
        };

        // 3) Prevent duplicate camelCase + snake_case fields being sent:
        //    remove camelCase variants so objectToFormData only sees snake_case keys.
        delete submissionValues.multibuyOption;
        delete submissionValues.discountPercentage;
        delete submissionValues.promotionStartDate;
        delete submissionValues.promotionEndDate;
        delete submissionValues.promotionStartTime;
        delete submissionValues.promotionEndTime;
        delete submissionValues.isPromotionActive;
        delete submissionValues.promotionOption;
        delete submissionValues.countdownActive;

        // 4) Variants: only include `image` if it's an actual File/Blob.
        //    If image is a URL string (existing image), remove `image` from that variant.
        if (Array.isArray(submissionValues.variants)) {
          submissionValues.variants = submissionValues.variants.map(
            (v: any) => {
              const { image, ...rest } = v ?? {};
              if (image instanceof File || image instanceof Blob) {
                return { ...rest, image };
              }
              // if variant had no id (new) and image was string, ignore the image;
              // typically new variants will provide File objects anyway.
              return rest;
            },
          );
        }

        // 5) Media: keep objects but allow _delete, keep id for existing, send file for File objects
        if (Array.isArray(submissionValues.media)) {
          submissionValues.media = submissionValues.media
            .map((m: any) => {
              // if marked for deletion and has id, keep { id, _delete: true }
              if (m && m._delete && m.id) {
                return { id: m.id, _delete: true };
              }
              // if File => send it (optionally keep id to indicate replacement)
              if (m && (m.file instanceof File || m.file instanceof Blob)) {
                return {
                  ...(m.id ? { id: m.id } : {}),
                  file: m.file,
                  media_type: m.media_type,
                  order: typeof m.order !== "undefined" ? m.order : null,
                };
              }
              // if existing media (url + id) and not deleted, send only id to be explicit
              if (m && m.id) {
                return {
                  id: m.id,
                  media_type: m.media_type,
                  order: m.order ?? null,
                };
              }
              // otherwise ignore
              return null;
            })
            .filter(Boolean);
        }

        console.log("submissionValues (clean):", submissionValues);

        // 6) build FormData using the improved helper
        const formData = objectToFormData(submissionValues);

        // debug helper: iterate and show formData entries in console
        // (use only in dev)
        if (process.env.NODE_ENV !== "production") {
          // eslint-disable-next-line no-restricted-syntax
          for (const pair of (formData as any).entries()) {
            console.log("FormData entry:", pair[0], pair[1]);
          }
        }

        // 7) submit using your existing mutations
        const handleSuccess = () => {
          setSubmitting(false);
          // clear dirty flag after successful submit
          setIsFormDirty(false);
          navigate(ROUTES.HOME);
        };

        if (id) {
          updateProductMutation.mutate(
            { id: Number(id), product: formData },
            { onSuccess: handleSuccess, onError: () => setSubmitting(false) },
          );
        } else {
          createProductMutation.mutate(formData, {
            onSuccess: handleSuccess,
            onError: () => setSubmitting(false),
          });
        }
      }}
    >
      {(formikProps: FormikProps<Product>) => {
        console.log("Formik values:", formikProps.values);
        console.log("Formik errors:", formikProps.errors);
        return (
          <>
            <Header />
            <Form
              // Capture DOM change events to set the dirty flag. This is a
              // simple heuristic that works for most input types. We also
              // mark the form pristine when Formik reports not dirty.
              onChange={() => {
                // If Formik says the form is dirty, trust it; otherwise set
                // based on DOM changes.
                if (!formikProps.dirty) {
                  setIsFormDirty(true);
                }
              }}
            >
              <AssignCategoryModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                selectedCategory={selectedCategory}
                onSelectCategory={(category: Category | null) => {
                  // Update local selected category and formik field only when
                  // the user confirms the selection via the modal button.
                  setSelectedCategory(category);
                  formikProps.setFieldValue(
                    "category",
                    category ? category.id : null,
                  );
                  setIsModalOpen(false);
                }}
              />
              {/* Exit confirmation dialog (unsaved changes) */}
              <ConfirmationDialog
                open={Boolean(openExitDialog)}
                title={"Salir sin guardar"}
                content={
                  "Tienes cambios sin guardar. ¿Estás seguro que quieres salir y perder los cambios?"
                }
                onClose={() => {
                  setOpenExitDialog(false);
                  pendingNavigationRef.current = null;
                }}
                onConfirm={() => {
                  setOpenExitDialog(false);
                  setIsFormDirty(false);
                  const next = pendingNavigationRef.current;
                  pendingNavigationRef.current = null;
                  try {
                    if (next) next();
                  } catch (e) {
                    // as a last resort try history.back()
                    try {
                      window.history.back();
                    } catch (_e) {
                      // ignore
                    }
                  }
                }}
              />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <ProductFormHeader
                  formik={formikProps}
                  onDeleteClick={() => setOpenDeleteDialog(true)}
                  onDuplicateClick={() => {
                    // build duplicated product from current form values
                    const values = formikProps.values as any;
                    const duplicated: Product = {
                      ...values,
                      // clear top-level id if present
                      id: undefined as any,
                      // set name with suffix
                      name: `${values.name} (copia)`,
                      // remove media entirely to avoid URL/file complications
                      media: [],
                      // duplicates should not keep DB ids for variants/addons
                      variants: (values.variants || []).map((v: any) => ({
                        name: v.name,
                        description: v.description,
                        price: Number(v.price) || 0,
                        image: undefined,
                      })),
                      addons: (values.addons || []).map((a: any) => ({
                        name: a.name,
                        price: Number(a.price) || 0,
                      })),
                    };

                    // ensure category is an id (it might be object)
                    if (
                      duplicated.category &&
                      typeof duplicated.category === "object"
                    ) {
                      duplicated.category = (duplicated.category as any).id;
                    }

                    attemptNavigate(() =>
                      navigate(ROUTES.PRODUCT_CREATE, {
                        state: { duplicatedProduct: duplicated },
                      }),
                    );
                  }}
                  onBack={() => attemptNavigate(() => navigate(-1))}
                />
                {/*  */}
                <Box sx={{ display: "flex" }}>
                  {isMobile ? (
                    <Drawer
                      variant="temporary"
                      open={mobileOpen}
                      onClose={handleDrawerClose}
                      ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                      }}
                      sx={{
                        display: { xs: "block", md: "none" },
                        "& .MuiDrawer-paper": {
                          boxSizing: "border-box",
                          width: 240,
                        },
                      }}
                    >
                      <Box>
                        <List>
                          {sections.map((section) => (
                            <ListItemButton
                              key={section.name}
                              selected={selectedSection === section.name}
                              onClick={() => handleSectionSelect(section.name)}
                              sx={{
                                borderRadius: 2,
                                mb: 1,
                                "&.Mui-selected": {
                                  backgroundColor: "rgba(0, 0, 0, 0.08)",
                                },
                                "&.Mui-selected:hover": {
                                  backgroundColor: "rgba(0, 0, 0, 0.12)",
                                },
                              }}
                            >
                              <ListItemIcon>{section.icon}</ListItemIcon>
                              <ListItemText primary={section.name} />
                            </ListItemButton>
                          ))}
                        </List>
                      </Box>
                    </Drawer>
                  ) : (
                    <Box
                      sx={{
                        width: 280,
                        flexShrink: 0,
                        pl: 10,
                        mr: 10,
                        // borderRight: "1px solid #e0e0e0",
                      }}
                    >
                      <Typography
                        variant="h5"
                        sx={{ marginBottom: theme.spacing(2) }}
                      >
                        Información
                      </Typography>
                      <List>
                        {sections.map((section) => (
                          <ListItemButton
                            key={section.name}
                            selected={selectedSection === section.name}
                            onClick={() => handleSectionSelect(section.name)}
                            sx={{
                              borderRadius: 2,
                              mb: 1,
                              "&.Mui-selected": {
                                backgroundColor: "grey.400",
                              },
                              "&.Mui-selected:hover": {
                                backgroundColor: "grey.400",
                              },
                            }}
                          >
                            <ListItemIcon>{section.icon}</ListItemIcon>
                            <ListItemText primary={section.name} />
                          </ListItemButton>
                        ))}
                      </List>
                    </Box>
                  )}
                  <Box
                    component="main"
                    sx={{
                      p: 3,
                      width: {
                        xs: "100%",
                        md: `calc(100% - 240px)`,
                        lg: "75%",
                      },
                      pb: 12, // Add padding to the bottom to avoid overlap with the submit section
                      mb: 12,
                    }}
                  >
                    {selectedComponent && selectedComponent(formikProps)}
                  </Box>
                  <SubmitSection onSectionSelect={handleSectionSelect} />
                </Box>
              </Box>

              {/* confirmation dialog for deleting product */}
              <ConfirmationDialog
                open={Boolean(openDeleteDialog)}
                title={"Eliminar producto"}
                content={
                  "¿Estás seguro que deseas eliminar este producto? Esta acción no se puede deshacer."
                }
                onClose={() => setOpenDeleteDialog(false)}
                onConfirm={() => {
                  if (id) {
                    deleteMutation.mutate(Number(id), {
                      onSuccess: () => setOpenDeleteDialog(false),
                      onError: () => setOpenDeleteDialog(false),
                    });
                    // keep dialog open while deleting; ConfirmationDialog will be disabled via isLoading
                  }
                }}
                isLoading={isDeleting}
              />
            </Form>
          </>
        );
      }}
    </Formik>
  );
};

export default ProductFormPage;
