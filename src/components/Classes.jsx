import { useState, useMemo } from "react";
import { secondsToHoursMinutesSeconds } from "@src/utilities/time";
import { Title, Text, Button, Select, Box, Stack } from "@mantine/core";
import { useLoaderData, useParams, useNavigate } from "react-router-dom";
import { useTimer } from "@src/hooks/useTimer";
import { useStudentAuth } from "@src/hooks/useStudentAuth";

/**
 * Renders the logged-in section of the application.
 *
 * @param {Object} props - The component props.
 * @param {string} props.selectedClass - The selected class.
 * @param {number} props.timer - The timer value.
 * @param {Function} props.handleLogout - The logout handler function.
 * @returns {JSX.Element} The rendered component.
 */
function LoggedInSection({ selectedClass, timer, handleLogout }) {
  return (
    <Stack spacing="sm">
      <Text>Logged in to {selectedClass}</Text>
      <Text>
        Time Spent: {secondsToHoursMinutesSeconds(timer)}{" "}
        (hours:minutes:seconds)
      </Text>
      <Button onClick={handleLogout}>Logout</Button>
    </Stack>
  );
}

/**
 * Renders the logged out section of the application.
 *
 * @param {Function} handleLogin - The function to handle the login action.
 * @returns {JSX.Element} The rendered logged out section.
 */
function LoggedOutSection({ handleLogin }) {
  return <Button onClick={handleLogin}>Login</Button>;
}

/**
 * Renders the Classes component that holds the main logic for the classes page.
 *
 * @param {Object} props - The component props.
 * @param {Function} props.setStudent - The function to set the student data in the parent component.
 * @returns {JSX.Element} The rendered component.
 */
function Classes({ setStudent = null }) {
  const { studentId } = useParams();
  const { classes, studentName } = useLoaderData();
  const [selectedClass, setSelectedClass] = useState("");
  const { timer, startTimer, stopTimer } = useTimer(0);
  const navigate = useNavigate();
  const { loggedIn, handleLogin, handleLogout } = useStudentAuth(
    studentId,
    () => {
      startTimer();
    },
    () => {
      stopTimer();
      navigate(`/students/${studentId}/loggedout`, { replace: true });
    }
  );

  // useMemo for transforming classes data
  const selectData = useMemo(
    () => classes.map((cls) => ({ value: cls, label: cls })),
    [classes]
  );

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
            data={selectData}
          />
        )}

        {selectedClass && (
          <Box>
            {loggedIn ? (
              <LoggedInSection
                selectedClass={selectedClass}
                timer={timer}
                handleLogout={handleLogout}
              />
            ) : (
              <LoggedOutSection
                handleLogin={() => handleLogin(selectedClass)}
              />
            )}
          </Box>
        )}
      </Stack>
    </Box>
  );
}

export default Classes;
