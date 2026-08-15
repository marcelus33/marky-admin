// src/pages/Logout.tsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSessionStore } from "../stores/sessionStore";
import { resetSessionExpiredNotice } from "../services/axiosConfig";

const Logout: React.FC = () => {
  const navigate = useNavigate();
  const clearSession = useSessionStore((state: any) => state.clearSession);

  useEffect(() => {
    // Clear the session from the store
    clearSession();
    // Permite que una futura expiración real vuelva a notificar.
    resetSessionExpiredNotice();
    // Redirect to the login page (or wherever you prefer)
    navigate("/login");
  }, [clearSession, navigate]);

  return null;
};

export default Logout;
