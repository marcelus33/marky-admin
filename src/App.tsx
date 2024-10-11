import { BrowserRouter, Route, Routes } from "react-router-dom";
//import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NotFound from "./pages/NotFound";
import { publicRoutes } from "./routes/publicRoutes";
import { CustomThemeProvider } from "./themes/ThemeContext";

const App = () => {
  return (
    <CustomThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* Loop over public routes */}
          {publicRoutes.map(({ path, component: Component }) => (
            <Route key={path} path={path} element={<Component />} />
          ))}

          {/* Loop over private routes */}
          {/* {privateRoutes.map(({ path, component: Component }) => (
          <Route
            key={path}
            path={path}
            element={isAuthenticated ? <Component /> : <Navigate to="/login" />}
          />
        ))} */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </CustomThemeProvider>
  );
};

export default App;
