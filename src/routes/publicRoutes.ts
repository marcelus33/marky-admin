import Login from "../pages/Login";
import Register from "../pages/Register";
import { ROUTES } from "./paths";

export const publicRoutes = [
  { path: ROUTES.LOGIN, component: Login },
  { path: ROUTES.HOME, component: Login },
  { path: ROUTES.REGISTER, component: Register },
];
