/**
 * Renders a table of student data with various actions.
 *
 * @component
 * @param {Object[]} studentData - An array of student data objects.
 * @param {string} studentData[].studentName - The name of the student.
 * @param {string} studentData[].studentId - The ID of the student.
 * @param {string[]} studentData[].classes - An array of classes the student is enrolled in.
 * @param {Object[]} studentData[].loginTimestamps - An array of login timestamps for the student.
 * @param {string} studentData[].loginTimestamps[].className - The name of the class.
 * @param {number} studentData[].loginTimestamps[].totalTime - The total time logged for the class in seconds.
 * @param {Function} handleTimeLog - A function to handle time log action for a student.
 * @param {Function} handleEdit - A function to handle edit action for a student.
 * @param {Function} handleDelete - A function to handle delete action for a student.
 * @returns {JSX.Element} The rendered StudentTable component.
 */
import { useState } from "react";
import {
  Table,
  Button,
  Group,
  Text,
  List,
  UnstyledButton,
  Center,
  rem,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { secondsToHoursMinutesSeconds } from "@src/utilities/time";
import {
  IconSelector,
  IconChevronDown,
  IconChevronUp,
} from "@tabler/icons-react";

function Th({ children, reversed = false, sorted, onSort }) {
  const Icon = sorted
    ? reversed
      ? IconChevronUp
      : IconChevronDown
    : IconSelector;
  return (
    <Table.Th>
      <UnstyledButton onClick={onSort} px={"3"} py={"2"}>
        <Group justify="space-between">
          <Text fw={500} fz="sm">
            {children}
          </Text>
          <Center>
            <Icon style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
          </Center>
        </Group>
      </UnstyledButton>
    </Table.Th>
  );
}

export default function StudentTable({
  studentData,
  handleTimeLog,
  handleEdit,
  handleDelete,
}) {
  const [sortBy, setSortBy] = useState("");
  const [reversed, setReversed] = useState(false);

  function sortStudentsBy(sortBy = "", reversed = false) {
    if (sortBy === "name") {
      return reversed
        ? studentData.sort((a, b) => b.studentName.localeCompare(a.studentName))
        : studentData.sort((a, b) =>
            a.studentName.localeCompare(b.studentName)
          );
    } else if (sortBy === "id") {
      return !reversed
        ? studentData.sort((a, b) => a.studentId - b.studentId)
        : studentData.sort((a, b) => b.studentId - a.studentId);
    }
    return !reversed ? studentData : studentData.slice().reverse();
  }

  function setSorting(sortBy) {
    const isReversed = sortBy === sortBy && !reversed;
    console.log(sortBy, isReversed);
    setSortBy(sortBy);
    setReversed(isReversed);
  }

  const openDeleteModal = (studentId) =>
    modals.openConfirmModal({
      title: "Delete Student",
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete {studentId} student?
        </Text>
      ),
      labels: { cancel: "Cancel", confirm: "Delete" },
      confirmProps: {
        color: "red",
        variant: "filled",
        autoContrast: true,
        className: "btn-std",
      },
      cancelProps: {
        color: "red",
        variant: "light",
        autoContrast: true,
        className: "btn-std",
      },
      onCancel: () => console.log("canceled"),
      onConfirm: () => handleDelete(studentId),
    });
  const rows = sortStudentsBy(sortBy, reversed).map((item) => {
    const { studentName, studentId, classes, loginTimestamps } = item;
    let timePerClassMap = new Map();
    loginTimestamps.forEach((timestamp) => {
      if (timePerClassMap.has(timestamp.className)) {
        timePerClassMap.set(
          timestamp.className,
          timePerClassMap.get(timestamp.className) + timestamp.totalTime
        );
      } else {
        timePerClassMap.set(timestamp.className, timestamp.totalTime);
      }
    });
    const formattedTimePerClass = Array.from(timePerClassMap).map(
      ([className, totalTime]) => {
        return `${className}: ${secondsToHoursMinutesSeconds(totalTime)}`;
      }
    );

    return (
      <Table.Tr key={studentId} id={studentId}>
        <Table.Td>{studentName}</Table.Td>
        <Table.Td>{studentId}</Table.Td>
        <Table.Td>
          {
            <List size="sm" spacing={"sm"} listStyleType={"none"}>
              {classes.map((className, index) => (
                <List.Item key={index}>{className}</List.Item>
              ))}
            </List>
          }
        </Table.Td>
        {/*<td>{((loginTimestamps.reduce((acc, curr) => curr.totalTime + acc, 0) / 3600)).toFixed(2)}</td>*/}
        <Table.Td>
          {formattedTimePerClass.length ? (
            <List size="sm" spacing={"sm"} listStyleType={"none"}>
              {formattedTimePerClass.map((formattedString, index) => (
                <List.Item key={index}>{formattedString}</List.Item>
              ))}
            </List>
          ) : (
            "No Time Logged"
          )}
        </Table.Td>
        <Table.Td>
          <Group justify="center" wrap={"nowrap"} className="mobile-flex-wrap">
            <Button
              onClick={() => handleTimeLog(studentId)}
              className="btn-view-log btn-std"
              color="blue"
              variant="filled"
              autoContrast
            >
              Time
            </Button>
            <Button
              onClick={() => handleEdit(studentId)}
              className="btn-edit btn-std"
              color="yellow"
              variant="filled"
              autoContrast
            >
              Classes
            </Button>
            <Button
              onClick={() => {
                openDeleteModal(studentId);
              }}
              className="btn-delete btn-std"
              color="red"
              variant="filled"
              autoContrast
            >
              Delete
            </Button>
          </Group>
        </Table.Td>
      </Table.Tr>
    );
  });

  return (
    <Table striped stickyHeader>
      <Table.Thead>
        <Table.Tr>
          <Th
            reversed={reversed}
            sorted={sortBy === "name"}
            onSort={() => setSorting("name")}
          >
            Name
          </Th>
          <Th
            sorted={sortBy === "id"}
            onSort={() => setSorting("id")}
            reversed={reversed}
          >
            Student ID
          </Th>
          <Table.Th fw={500} fz={"sm"}>
            Classes
          </Table.Th>
          <Table.Th fw={500} fz={"sm"}>
            Total Time
          </Table.Th>
          <Table.Th fw={500} fz={"sm"}>
            Actions
          </Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody className="students-body">{rows}</Table.Tbody>
    </Table>
  );
}
