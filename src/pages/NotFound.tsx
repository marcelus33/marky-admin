import React from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../routes/paths";

const NotFound: React.FC = () => {
  return (
    <div>
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for does not exist.</p>
      <Link to={ROUTES.LOGIN}>Go to Login</Link>
    </div>
  );
};

export default NotFound;
