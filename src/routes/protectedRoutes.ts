import AccountConfigurationPage from "../pages/account/AccountConfigurationPage";
import Configuration from "../pages/Configuration";
import Home from "../pages/home";
import ProductDetailPage from "../pages/product/ProductDetailPage";
import ProductFormPage from "../pages/product/ProductFormPage";

import Logout from "../pages/Logout";
import { ROUTES } from "./paths";

export const protectedRoutes = [
  { path: ROUTES.LOGOUT, component: Logout },
  { path: ROUTES.CONFIGURATION, component: Configuration },
  {
    path: ROUTES.ACCOUNT_CONFIGURATION,
    component: AccountConfigurationPage,
  },
  { path: ROUTES.HOME, component: Home },
  { path: ROUTES.PRODUCT_DETAIL, component: ProductDetailPage },
  { path: ROUTES.PRODUCT_EDIT, component: ProductFormPage },
  { path: ROUTES.PRODUCT_CREATE, component: ProductFormPage },
];
