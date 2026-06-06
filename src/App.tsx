import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
//import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NotFound from "./pages/NotFound";
import { publicRoutes } from "./routes/publicRoutes";
import { CustomThemeProvider } from "./themes/ThemeContext";
import { protectedRoutes } from "./routes/protectedRoutes";
import { useSessionStore } from "./stores/sessionStore";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ROUTES } from "./routes/paths";
import { CssBaseline } from "@mui/material";
import { LoadingProvider } from "./contexts/LoadingContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const App = () => {
  const isAuthenticated = useSessionStore((state: any) =>
    state.isAuthenticated()
  );
  const { user } = useSessionStore();

  return (
    <QueryClientProvider client={queryClient}>
      <CustomThemeProvider>
        <LoadingProvider>
          <CssBaseline />
          <BrowserRouter>
            <Routes>
              {/* Loop over public routes */}
              {publicRoutes.map(({ path, component: Component }) => (
                <Route
                  key={path}
                  path={path}
                  element={
                    isAuthenticated ? (
                      !user?.has_configuration &&
                      path !== ROUTES.CONFIGURATION ? (
                        <Navigate to={`${ROUTES.CONFIGURATION}`} />
                      ) : (
                        <Navigate to="/home" />
                      )
                    ) : (
                      <Component />
                    )
                  }
                />
              ))}

              {/* Loop over private routes */}

              {protectedRoutes.map(({ path, component: Component }) => (
                <Route
                  key={path}
                  path={path}
                  element={
                    isAuthenticated ? (
                      !user?.has_configuration &&
                      path !== ROUTES.CONFIGURATION &&
                      path !== ROUTES.LOGOUT ? (
                        <Navigate to={`${ROUTES.CONFIGURATION}`} />
                      ) : user?.has_configuration &&
                        path === ROUTES.CONFIGURATION ? (
                        <Navigate to="/home" />
                      ) : (
                        <Component />
                      )
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
              ))}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <ToastContainer />
          </BrowserRouter>
        </LoadingProvider>
      </CustomThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
