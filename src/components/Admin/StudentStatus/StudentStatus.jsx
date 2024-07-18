import { Box, Table, Text, Title } from "@mantine/core";
import { formatDate } from "@src/utilities/time";

export default function StudentStatus({ data }) {
  const isLoggedIn = (student) => {
    const { lastLogin, lastLogout } = student;
    if (lastLogin === 0) return false;
    return lastLogin === lastLogout;
  };

  const loggedInStudentsArr = (studentsArr = []) => {
    return studentsArr
      .filter((student) => isLoggedIn(student))
      .sort((a, b) => b.lastLogin - a.lastLogin);
  };

  const rows = (students = []) => {
    return students.map((student) => {
      return (
        <Table.Tr key={student.studentId} justify="space-around" wrap="no-wrap">
          <Table.Td>{student.studentName}</Table.Td>
          <Table.Td>{student.studentId}</Table.Td>
          <Table.Td>{formatDate(new Date(student.lastLogin))}</Table.Td>
        </Table.Tr>
      );
    });
  };

  // console.log(data);
  // console.log(loggedInStudentsArr(data));
  // console.log(rows(loggedInStudentsArr(data)));

  return (
    <Box>
      <Title ta={"center"} mb={"xl"}>
        Logged In Students
      </Title>
      <Table striped>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>
              <Text>Name</Text>
            </Table.Th>
            <Table.Th>
              <Text>ID</Text>
            </Table.Th>
            <Table.Th>
              <Text>Login Time</Text>
            </Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows(loggedInStudentsArr(data))}</Table.Tbody>
      </Table>
    </Box>
  );
}
