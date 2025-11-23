export const ROUTES = {
  // HOME: "/",
  LOGIN: "/login",
  LOGOUT: "/logout",
  REGISTER: "/register",
  VERIFY_EMAIL_SEND: "/verify-email/",
  VERIFY_EMAIL: "/verify-email/:token",
  RECOVER_PASSWORD: "/recover-password",
  NEW_PASSWORD: "/reset-password/:uid/:token",
  // protected routes
  CONFIGURATION: "/configuration",
  HOME: "/home",
  PRODUCT_DETAIL: "/product/:id",
  PRODUCT_EDIT: "/product/edit/:id",
  PRODUCT_CREATE: "/product/create",
};
