import Configuration from "../pages/Configuration";
import Home from "../pages/home";

import Logout from "../pages/Logout";
import { ROUTES } from "./paths";

export const protectedRoutes = [
  { path: ROUTES.LOGOUT, component: Logout },
  { path: ROUTES.CONFIGURATION, component: Configuration },
  { path: ROUTES.HOME, component: Home },
];
