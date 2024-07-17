import { useState } from "react";
import {
  TextInput,
  Title,
  Text,
  Container,
  Button,
  Notification,
  Select,
} from "@mantine/core";
import { modals } from "@mantine/modals";
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
        <Login
          setStudent={setStudent}
          setError={setError}
          setSuccess={setSuccess}
        />
      ) : (
        <ClassSelect
          student={student}
          setStudent={setStudent}
          setSuccess={setSuccess}
          setError={setError}
        />
      )}
      {success && isEmptyObject(student) && (
        <Notification
          mt={10}
          title="Success"
          color="green"
          onClose={() => setSuccess("")}
        >
          <Text>{success}</Text>
        </Notification>
      )}
      {error && isEmptyObject(student) && (
        <Notification
          mt={10}
          color="red"
          title="Error"
          onClose={() => setError("")}
        >
          <Text>{error}</Text>
        </Notification>
      )}
    </Container>
  );
}

function Login({ setStudent, setError, setSuccess }) {
  const [inputVal, setInputVal] = useState("");

  const handleLogout = async (studentId) => {
    console.log("logout student");
    const res = await studentLogout(studentId);
    if (res.success) {
      setError("");
      setSuccess("You have been logged out.");
      console.log("logged out student");
      window.alert("You have been logged out.");
      setInputVal("");
    } else {
      setSuccess("");
      setError("Failed to logout student");
      console.error("Failed to logout student");
      window.alert("Failed to logout. Please try again.");
    }
  };

  const openLogoutModal = (studentId) =>
    modals.openConfirmModal({
      title: "Confirm Logout",
      centered: true,
      children: (
        <Text size="sm">
          You will be logged out. If you are not logged in, please contact lab
          for assistance.
        </Text>
      ),
      labels: { cancel: "Cancel", confirm: "Logout" },
      confirmProps: {
        color: "blue",
        variant: "filled",
        autoContrast: true,
        className: "btn-std",
      },
      cancelProps: {
        color: "blue",
        variant: "light",
        autoContrast: true,
        className: "btn-std",
      },
      onCancel: () => console.log("canceled"),
      onConfirm: () => handleLogout(studentId),
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("Loading student...");
    setError("");
    try {
      console.log("username", inputVal);
      const { success, student } = await getStudent(inputVal);
      if (success) {
        console.log("student", student);
        const { lastLogin, lastLogout, studentId } = student;
        console.log(isNewStudent(student), lastLogin, lastLogout);
        if (isNewStudent(student) || lastLogin !== lastLogout) {
          console.log("login student");
          setError("");
          setSuccess("Student found. Loading classes.");
          setStudent(student);
        } else if (lastLogin === lastLogout) {
          openLogoutModal(studentId);
        } else {
          setSuccess("");
          setError("Invalid student, please contact lab assistance.");
          console.error("Invalid student state");
          window.alert("Invalid student state. Please contact lab assistance.");
        }
      } else {
        setSuccess("");
        setError("Failed to get student");
        console.error("Failed to get student");
      }
    } catch (error) {
      setSuccess("");
      setError("Error getting student");
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

function ClassSelect({ student, setStudent, setError, setSuccess }) {
  const { studentId, studentName, classes, lastClass } = student;

  const [selectedClass, setSelectedClass] = useState(lastClass);

  const handleLogin = async () => {
    try {
      const { success, error } = await studentLogin(studentId, selectedClass);
      if (success) {
        console.log("Logged in successfully");
        window.alert("You have been logged in.");
        setStudent({});
        setSuccess("");
        setError("");
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
