import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextInput,
  PasswordInput,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Button,
  Notification,
} from "@mantine/core";
import { URL } from "@src/constants";
import axios from "axios";

/**
 * Login component for the admin page.
 * Allows users to log in with a username and password.
 */
export default function Login() {
  const navigate = useNavigate();
  const [loginStatus, setLoginStatus] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  /**
   * Sets the login status message and clears it after a delay.
   * @param {string} status - The login status message.
   */
  const handleLoginStatus = (status) => {
    setLoginStatus(status);
    setTimeout(() => {
      setLoginStatus("");
    }, 3000);
  };

  /**
   * Handles the login process.
   * Sends a POST request to the server with the username and password.
   * If successful, sets the login status to "Login successful" and navigates to the admin page.
   * If unsuccessful, sets the login status to "Login failed. Please try again."
   */
  const handleLogin = async () => {
    setLoginStatus("Logging in...");
    if (username === "" || password === "") {
      handleLoginStatus("Please enter a username and password.");
      return;
    }
    try {
      const { data } = await axios.post(
        `${URL}/auth/login`,
        {
          username,
          password,
        }
        // { withCredentials: true }
      );
      const { success, message, token } = data;
      if (success) {
        handleLoginStatus("Login successful");
        localStorage.setItem("token", token);
        setTimeout(() => {
          navigate("/admin");
        }, 500);
      } else {
        handleLoginStatus("Login failed. Please try again.");
        console.log("Login failed:", message);
      }
    } catch (error) {
      handleLoginStatus("Error logging in. Please try again.");
      console.log("Error logging in:", error.message);
    }
  };

  /**
   * Handles changes to the username input field.
   * @param {object} e - The event object.
   */
  const handleUsername = (e) => {
    setUsername(e.target.value);
  };

  /**
   * Handles changes to the password input field.
   * @param {object} e - The event object.
   */
  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  /**
   * Handles the keydown event on the password input field.
   * If the Enter key is pressed, calls the handleLogin function.
   * @param {object} e - The event object.
   */
  function handleKeyDown(e) {
    if (e.key === "Enter") {
      handleLogin();
    }
  }

  return (
    <Container size={420} my={40}>
      <Title ta="center">MLC Admin</Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Student?{" "}
        <Anchor size="sm" component="button" onClick={() => navigate("/")}>
          Login Here
        </Anchor>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <TextInput
          label="Username"
          required
          value={username}
          onChange={handleUsername}
        />
        <PasswordInput
          label="Password"
          required
          mt="md"
          value={password}
          onChange={handlePassword}
          onKeyDown={handleKeyDown}
        />
        <Button
          fullWidth
          mt="xl"
          onClick={handleLogin}
          disabled={
            loginStatus === "Logging in..." ||
            loginStatus === "Login successful"
          }
        >
          Sign in
        </Button>
      </Paper>
      {loginStatus && (
        <Notification
          color={
            loginStatus.includes("Error") || loginStatus.includes("Failed")
              ? "red"
              : loginStatus.includes("successful")
              ? "green"
              : "blue"
          }
          onClose={() => setLoginStatus("")}
        >
          {loginStatus}
        </Notification>
      )}
    </Container>
  );
}
