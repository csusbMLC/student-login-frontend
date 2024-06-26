// src/hooks/useAuth.js
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { URL } from "@src/constants";

export const useAuth = () => {
  const [user, setUser] = useState("");
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    navigate("/admin/login");
  }, [navigate]);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/admin/login");
        return;
      }
      try {
        const { data } = await axios.post(
          `${URL}/auth/`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const { status, username } = data;
        if (status) {
          setUser(username);
        } else {
          handleLogout();
        }
      } catch (error) {
        console.error("Error verifying token:", error);
        handleLogout();
      }
    };
    verifyToken();
  }, [handleLogout, navigate]);

  return { user, handleLogout };
};
