import { useEffect, useState } from "react";
import EditStudentForm from "@components/Admin/EditStudentForm/EditStudentForm";
import AddStudentForm from "@src/components/Admin/AddStudentForm/AddStudentForm";
import TimeLogForm from "@src/components/Admin/TimeLogForm/TimeLogForm";
import ImportStudents from "@src/components/Admin/ImportStudents/ImportStudents";
import StudentTable from "@src/components/Admin/StudentTable/StudentTable";
import Header from "@components/Admin/Header/Header";
import { Box, Container, Center, Loader, Title, Stack } from "@mantine/core";

import "./Dashboard.css";
import { useQuery } from "@tanstack/react-query";
import { useDebouncedValue } from "@mantine/hooks";
import { useDisplayState } from "@src/hooks/useDisplayState";
import { useStudentData } from "@src/hooks/useStudentData";
import { useAuth } from "@src/hooks/useAuth";
import SearchAndActions from "@components/Admin/SearchAndActions/SearchAndActions";
import ChangePassword from "@components/Admin/ChangePassword/ChangePassword";
import { getStudents } from "@src/services/apiServices";
import ErrorPage from "@src/components/Error/error-page";

const LoadingScreen = ({ ...props }) => {
  return (
    <Center w={"100%"} h={"100%"}>
      <Stack justify="space-around" align="center">
        {props.children}
        <Loader mt={"xl"} size="xl" />
      </Stack>
    </Center>
  );
};

/**
 * Renders the dashboard component which is the root component for the admin section.
 *
 * @returns {JSX.Element} The dashboard component.
 */
function Dashboard() {
  // const { students } = useLoaderData();
  const query = useQuery({ queryKey: ["students"], queryFn: getStudents });

  const {
    data,
    setData,
    handleAddStudent,
    handleDeleteStudent,
    handleUpdateStudent,
    filterStudents,
  } = useStudentData(query?.data?.students || []);

  const [
    {
      showDashboard,
      showAddStudentForm,
      showEditStudentForm,
      showImportStudentsForm,
      showTimeLogForm,
      showChangePassword,
    },
    handleDisplay,
  ] = useDisplayState();
  const [selectedStudent, setSelectedStudent] = useState("");
  const [searchVal, setSearchVal] = useState("");
  const [debounced] = useDebouncedValue(searchVal, 200);
  const { user, handleLogout } = useAuth();

  const handleEdit = (studentId) => {
    setSelectedStudent(studentId);
    handleDisplay("showEditStudentForm");
  };

  const handleTimeLog = (studentId) => {
    setSelectedStudent(studentId);
    handleDisplay("showTimeLogForm");
  };

  // refresh data for useStudent hook to work with react-query
  useEffect(() => {
    if (query?.data) {
      setData(query.data.students);
    }
  }, [query.data, setData, query.isFetched]);

  // loading screen while waiting for data fetch
  if (query.isLoading)
    return (
      <LoadingScreen>
        <Title>Loading Admin Dashboard</Title>
      </LoadingScreen>
    );
  if (query.error) return <ErrorPage />;

  return (
    <Container size="xl">
      <Box>
        <Header
          user={user}
          handleLogout={handleLogout}
          handleDisplay={handleDisplay}
        />
        {showDashboard && (
          <Box>
            <SearchAndActions
              searchVal={searchVal}
              setSearchVal={setSearchVal}
              handleDisplay={handleDisplay}
              data={data}
            />
            <StudentTable
              studentData={filterStudents(debounced) || []}
              handleTimeLog={handleTimeLog}
              handleEdit={handleEdit}
              handleDelete={handleDeleteStudent}
            />
            {filterStudents(debounced).length === 0 && (
              <Box ta={"center"} mt="xl">
                No students found
              </Box>
            )}
          </Box>
        )}
        {showTimeLogForm && (
          <TimeLogForm
            student={data.find(
              (student) => student.studentId === selectedStudent
            )}
            onSave={handleUpdateStudent}
            onCancel={handleDisplay}
          />
        )}
        {showEditStudentForm && (
          <EditStudentForm
            student={data.find(
              (student) => student.studentId === selectedStudent
            )}
            onSave={handleUpdateStudent}
            onCancel={handleDisplay}
          />
        )}
        {showAddStudentForm && (
          <AddStudentForm
            onSubmit={handleAddStudent}
            onCancel={handleDisplay}
          />
        )}
        {showImportStudentsForm && (
          <ImportStudents students={data} onCancel={handleDisplay} />
        )}
        {showChangePassword && (
          <ChangePassword onCancel={handleDisplay} user={user} />
        )}
      </Box>
    </Container>
  );
}

export default Dashboard;
