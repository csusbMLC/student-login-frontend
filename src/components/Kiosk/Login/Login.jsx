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
  Select,
  Group,
  Stack,
} from "@mantine/core";
import { isEmptyObject } from "@utilities/student";
import { getStudent, studentLogin } from "@src/services/apiServices";

export default function Login() {
  const [student, setStudent] = useState({});
  const [selectedClass, setSelectedClass] = useState("");
  const [inputVal, setInputVal] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("username", e.target.username.value);
      const { success, student } = await getStudent(e.target.username.value);
      if (success) {
        console.log("student", student);
        setStudent(student);
        setSelectedClass(student.lastClass);
        const { lastLogin, lastLogout } = student;
        if (!lastLogin || !lastLogout) {
          console.log("missing login or logout");
        } else if (lastLogin === lastLogout) {
          console.log("logout student");
        } else {
          console.log("login student");
        }
      } else {
        console.error("Failed to get student");
      }
    } catch (error) {
      console.error("Error getting student:", error);
    }
  };

  return (
    <Container>
      <Title>MLC iPad Login</Title>
      <form onSubmit={handleSubmit}>
        <TextInput
          mt={"lg"}
          label="Student ID"
          placeholder="Enter your student ID"
          required
          name="id"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          inputMode="numeric"
          pattern="[0-9]{9}"
        />
        <Button type="submit" mt={"lg"} fullWidth>
          Login
        </Button>
      </form>
    </Container>
  );
}
