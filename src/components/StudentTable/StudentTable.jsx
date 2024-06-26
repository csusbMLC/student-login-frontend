import { Table, Button, Group } from "@mantine/core";

export default function StudentTable({
  studentData,
  handleTimeLog,
  handleEdit,
  openDeleteModal,
}) {
  const rows = studentData.map((item, index) => {
    const { studentName, studentId, classes, loginTimestamps } = item;
    let timePerClassMap = new Map();
    loginTimestamps.forEach((timestamp) => {
      // console.log('timestamp', timestamp);
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
        return `${className}: ${(totalTime / 3600).toFixed(2)}`;
      }
    );
    return (
      <Table.Tr key={studentId} id={studentId}>
        <Table.Td>{studentName}</Table.Td>
        <Table.Td>{studentId}</Table.Td>
        <Table.Td>{classes.join(", ")}</Table.Td>
        {/*<td>{((loginTimestamps.reduce((acc, curr) => curr.totalTime + acc, 0) / 3600)).toFixed(2)}</td>*/}
        <Table.Td>
          {formattedTimePerClass.length
            ? formattedTimePerClass.join(", ")
            : "No Time Logged"}
        </Table.Td>
        <Table.Td>
          <Group>
            <Button
              onClick={() => handleTimeLog(index)}
              className="btn-view-log"
              color="blue"
              variant="filled"
              autoContrast
            >
              Time Log
            </Button>
            <Button
              onClick={() => handleEdit(index)}
              className="btn-edit"
              color="yellow"
              variant="filled"
              autoContrast
            >
              Edit Student
            </Button>
            {/* <Button onClick={() => handleDelete(index)}>Delete</Button> */}
            <Button
              onClick={(e) => {
                console.log(studentId);
                openDeleteModal(studentId);
              }}
              className="btn-delete"
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
          <Table.Th>Total Time Logged (hours)</Table.Th>
          <Table.Th>Actions</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody className="students-body">{rows}</Table.Tbody>
    </Table>
  );
}
