import { useContext, useEffect, useState } from "react";
import { AdminAuthContext } from "@src/main";
import { useNavigate } from "react-router-dom";
import {
  TextInput,
  PasswordInput,
  Checkbox,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Button,
} from "@mantine/core";
import { URL } from "@src/constants";
import axios from "axios";
import { useCookies } from "react-cookie";

export default function AdminLogin() {
  const { setUser } = useContext(AdminAuthContext);
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [cookies, setCookie] = useCookies([]);

  const handleLogin = async (e) => {
    e.preventDefault();
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
        setUser("admin");
        localStorage.setItem("token", token);
        // console.log('user:', user);
        // setCookie("token", token);
        console.log(localStorage);
        navigate("/admin");
      } else {
        console.log("failed auth message", message);
      }
    } catch (error) {
      console.log("auth error", error);
    }
  };

  const handleUsername = (e) => {
    setUsername(e.target.value);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

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
        />
        <Button fullWidth mt="xl" onClick={handleLogin}>
          Sign in
        </Button>
      </Paper>
    </Container>
  );
}
