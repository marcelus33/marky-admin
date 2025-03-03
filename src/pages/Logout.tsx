// src/pages/Logout.tsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSessionStore } from "../stores/sessionStore";

const Logout: React.FC = () => {
  const navigate = useNavigate();
  const clearSession = useSessionStore((state: any) => state.clearSession);

  useEffect(() => {
    // Clear the session from the store
    clearSession();
    // Redirect to the login page (or wherever you prefer)
    navigate("/login");
  }, [clearSession, navigate]);

  return null;
};

export default Logout;
