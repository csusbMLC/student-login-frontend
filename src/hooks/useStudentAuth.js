import { useState } from "react";
import { studentLogin, studentLogout } from "@src/services/apiServices";

export const useStudentAuth = (studentId, onLogin, onLogout) => {
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = (classToSend) => {
    studentLogin(studentId, classToSend)
      .then(() => {
        setLoggedIn(true);
        if (onLogin) {
          onLogin();
        }
      })
      .catch((error) => {
        console.error("Error logging in:", error);
      });
  };

  const handleLogout = () => {
    studentLogout(studentId)
      .then(() => {
        setLoggedIn(false);
        if (onLogout) {
          onLogout();
        }
      })
      .catch((error) => {
        console.error("Error logging out:", error);
      });
  };

  return { loggedIn, handleLogin, handleLogout };
};
