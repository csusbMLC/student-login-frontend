import { useState } from "react";
import { studentLogin, studentLogout } from "@src/services/apiServices";

/**
 * Custom hook for student authentication.
 *
 * @param {string} studentId - The ID of the student.
 * @param {Function} onLogin - Callback function to be called after successful login.
 * @param {Function} onLogout - Callback function to be called after successful logout.
 * @returns {Object} - An object containing the current login status and login/logout functions.
 */
export const useStudentAuth = (studentId, onLogin, onLogout) => {
  const [loggedIn, setLoggedIn] = useState(false);

  /**
   * Handles the login process for the student.
   *
   * @param {string} classToSend - The class to send during login.
   */
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

  /**
   * Handles the logout process for the student.
   */
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
