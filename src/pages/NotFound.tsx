import React from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../routes/paths";

const NotFound: React.FC = () => {
  return (
    <div>
      <h1>404 - Página no encontrada.</h1>
      <p>La página que buscas no existe.</p>
      <Link to={ROUTES.LOGIN}>Ir al login</Link>
    </div>
  );
};

export default NotFound;
