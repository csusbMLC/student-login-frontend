import { useContext, useState } from "react";
import { AdminAuthContext } from "@src/main";
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

export default function AdminLogin() {
  const { setUser } = useContext(AdminAuthContext);
  const navigate = useNavigate();
  const [loginStatus, setLoginStatus] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLoginStatus = (status) => {
    setLoginStatus(status);
    setTimeout(() => {
      setLoginStatus("");
    }, 3000);
  };

  const handleLogin = async () => {
    setLoginStatus("Logging in...");
    if (username === "" || password === "") {
      handleLoginStatus("Please enter a username and password.");
      return;
    }
    try {
      const { data, headers } = await axios.post(
        `${URL}/auth/login`,
        {
          username,
          password,
        }
        // { withCredentials: true }
      );
      console.log("auth login data", data, headers);
      const { success, message, token } = data;
      if (success) {
        // console.log('username:', username);
        handleLoginStatus("Login successful");
        setUser("admin");
        localStorage.setItem("token", token);
        // console.log('user:', user);
        // setCookie("token", token);
        console.log(localStorage);
        setTimeout(() => {
          navigate("/admin");
        }, 500);
      } else {
        console.log("failed auth message", message);
        handleLoginStatus("Login failed. Please try again.");
      }
    } catch (error) {
      console.log("auth error", error);
      handleLoginStatus("Error logging in. Please try again.");
    }
  };

  const handleUsername = (e) => {
    setUsername(e.target.value);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      handleLogin();
    }
  }

  // return (
  //     <div>
  //         <h1>Admin Login</h1>
  //         <form onSubmit={handleLogin}>
  //             <input value={username} onChange={(e) => handleUsername(e)} type="text" placeholder="Username" />
  //             <input value={password} onChange={(e) => handlePassword(e)} type="password" placeholder="Password" />
  //             <button type="submit">Login</button>
  //         </form>
  //     </div>
  // );

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
