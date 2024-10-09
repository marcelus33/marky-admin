import EmailVerification from "../pages/EmailVerification";
import Login from "../pages/Login";
import NewPassword from "../pages/NewPassword";
import RecoverPassword from "../pages/RecoverPassword";
import Register from "../pages/Register";
import { ROUTES } from "./paths";

export const publicRoutes = [
  { path: ROUTES.LOGIN, component: Login },
  { path: ROUTES.HOME, component: Login },
  { path: ROUTES.REGISTER, component: Register },
  { path: ROUTES.VERIFY_EMAIL, component: EmailVerification },
  { path: ROUTES.RECOVER_PASSWORD, component: RecoverPassword },
  { path: ROUTES.NEW_PASSWORD, component: NewPassword },
];
