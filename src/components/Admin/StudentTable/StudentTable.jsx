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
import { Table, Button, Group, Text, List } from "@mantine/core";
import { modals } from "@mantine/modals";
import { secondsToHoursMinutesSeconds } from "@src/utilities/time";

export default function StudentTable({
  studentData,
  handleTimeLog,
  handleEdit,
  handleDelete,
}) {
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
  const rows = studentData.map((item) => {
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
          <Table.Th>Name</Table.Th>
          <Table.Th>Student ID</Table.Th>
          <Table.Th>Classes</Table.Th>
          <Table.Th>Total Time</Table.Th>
          <Table.Th>Actions</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody className="students-body">{rows}</Table.Tbody>
    </Table>
  );
}
