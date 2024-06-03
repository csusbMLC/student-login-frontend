import { useEffect, useState } from "react";
import {
  addMinutesToDate,
  secondsToHoursMinutesSeconds,
} from "@src/utilities/time";
import {
  Title,
  Text,
  Button,
  Select,
  Box,
  Stack,
  Modal,
  Divider,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useLoaderData, useParams, useNavigate } from "react-router-dom";
import { studentLogin, studentLogout } from "@src/services/apiServices";

function Classes({ setStudent = null }) {
  const { studentId } = useParams();
  const { classes, studentName } = useLoaderData();
  const [selectedClass, setSelectedClass] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [timer, setTimer] = useState(0);
  const [startTimer, setStartTimer] = useState(false);
  const [displayTimer, setDisplayTimer] = useState(0);
  const [openedIdleChecker, { open, close }] = useDisclosure(false);
  const navigate = useNavigate();

  useEffect(() => {
    let interval = null;

    if (startTimer) {
      interval = setInterval(() => {
        setTimer((timer) => timer + 1);
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [startTimer]);

  useEffect(() => {
    setDisplayTimer(secondsToHoursMinutesSeconds(timer));
  }, [timer]);

  useEffect(() => {
    if (timer === 30) {
      open();
    }
  }, [timer, open]);

  const handleLogin = (classToSend) => {
    studentLogin(studentId, classToSend)
      .then(() => {
        setLoggedIn(true);
        setStartTimer(true);
      })
      .catch((error) => {
        console.error("Error logging in:", error);
      });
  };

  const handleLogout = () => {
    studentLogout(studentId)
      .then(() => {
        setStartTimer(false);
        setLoggedIn(false);
        navigate("/", { replace: true });
      })
      .catch((error) => {
        console.error("Error logging out:", error);
      });
  };

  return (
    <Box sx={{ maxWidth: 400 }} mx="auto">
      <Stack spacing="md">
        <Title order={1}>Classes</Title>
        <Title order={2}>Hi, {studentName}!</Title>

        {classes.length === 0 && (
          <Stack spacing="sm">
            <Text>No classes found, please contact lab assistance.</Text>
            <Button onClick={() => setStudent({})}>Logout</Button>
          </Stack>
        )}

        {classes.length > 0 && (
          <Select
            disabled={loggedIn}
            label="Select a class"
            placeholder="Select a class"
            value={selectedClass}
            onChange={setSelectedClass}
            data={classes.map((cls) => ({ value: cls, label: cls }))}
          />
        )}

        {selectedClass && (
          <Box>
            {loggedIn ? (
              <Stack spacing="sm">
                <Text>Logged in to {selectedClass}</Text>
                <Text>Time Spent: {displayTimer} (hours:minutes:seconds)</Text>
                <Button onClick={handleLogout}>Logout</Button>
              </Stack>
            ) : (
              <Button onClick={() => handleLogin(selectedClass)}>Login</Button>
            )}
          </Box>
        )}
      </Stack>
      {/* <Button onClick={open}>Idle Checker</Button> */}
      <Modal
        opened={openedIdleChecker}
        onClose={close}
        title="Do you want to continue your session?"
        size="sm"
        centered
      >
        {/* <Title>Do you want to continue your session?</Title> */}
        <Text>
          For security reasons, your session will timeout at{" "}
          {String(addMinutesToDate(undefined, 2))} unless you continue.
        </Text>
        <Divider my="md" />
        <Button onClick={close} fullWidth>
          Continue Session
        </Button>
      </Modal>
    </Box>
  );
}

export default Classes;
