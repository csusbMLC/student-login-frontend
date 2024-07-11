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
import {
  getStudent,
  studentLogin,
  studentLogout,
} from "@src/services/apiServices";

const isNewStudent = (student) => {
  const { lastLogin, lastLogout, lastClass } = student;
  return lastLogin === 0 && lastLogout === 0 && lastClass === "";
};

export default function Dashboard() {
  const [student, setStudent] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  return (
    <Container>
      <Title order={1}>MLC Login</Title>
      {isEmptyObject(student) ? (
        <Login setStudent={setStudent} />
      ) : (
        <ClassSelect student={student} setStudent={setStudent} />
      )}
      <Notification mt={10} title="Instructions">
        <Text>
          Please enter your student ID to login. If you are already logged in,
          select your class to logout.
        </Text>
      </Notification>
    </Container>
  );
}

function Login({ setStudent }) {
  const [inputVal, setInputVal] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("username", inputVal);
      const { success, student } = await getStudent(inputVal);
      if (success) {
        console.log("student", student);
        const { lastLogin, lastLogout, studentId } = student;
        if (isNewStudent(student) || lastLogin !== lastLogout) {
          console.log("login student");
          setStudent(student);
        } else if (lastLogin === lastLogout) {
          console.log("logout student");
          const res = await studentLogout(studentId);
          if (res.success) {
            console.log("logged out student");
            window.alert("You have been logged out.");
            setInputVal("");
          } else {
            console.error("Failed to logout student");
            window.alert("Failed to logout. Please try again.");
          }
        } else {
          console.error("Invalid student state");
          window.alert("Invalid student state. Please contact lab assistance.");
        }
      } else {
        console.error("Failed to get student");
      }
    } catch (error) {
      console.error("Error getting student:", error);
    }
  };

  return (
    <>
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
          Login/Logout
        </Button>
      </form>
    </>
  );
}

function ClassSelect({ student, setStudent }) {
  const { studentId, studentName, classes, lastClass } = student;

  const [selectedClass, setSelectedClass] = useState(lastClass);

  const handleLogin = async () => {
    try {
      const { success, error } = await studentLogin(studentId, selectedClass);
      if (success) {
        console.log("Logged in successfully");
        window.alert("You have been logged in.");
        setStudent({});
      } else {
        console.error("Error logging in:", error.message);
        window.alert("Error logging in. Please try again.");
      }
    } catch (error) {
      console.error("Error logging in:", error.message);
      window.alert("Error logging in. Please try again.");
    }
  };

  return (
    <>
      <Title order={2}>Welcome {studentName}</Title>
      {classes.length === 0 && (
        <>
          <Text mt={10}>No classes found, please contact lab assistance.</Text>
          <Button mt={10} fullWidth onClick={() => setStudent({})}>
            Logout
          </Button>
        </>
      )}
      {classes.length > 0 && (
        <>
          <Text>Please select a class to login</Text>
          <Select
            mt={10}
            label="Classes"
            placeholder="Select your class"
            data={classes}
            value={selectedClass}
            onChange={(value) => setSelectedClass(value)}
          />
          <Button mt={10} fullWidth onClick={handleLogin}>
            Login
          </Button>
        </>
      )}
    </>
  );
}
