import { useState } from "react";
import EditStudentForm from "@components/Admin/EditStudentForm/EditStudentForm";
import AddStudentForm from "@src/components/Admin/AddStudentForm/AddStudentForm";
import TimeLogForm from "@src/components/Admin/TimeLogForm/TimeLogForm";
import ImportStudents from "@src/components/Admin/ImportStudents/ImportStudents";
import StudentTable from "@src/components/Admin/StudentTable/StudentTable";
import Header from "@components/Admin/Header/Header";
import { Box, Container } from "@mantine/core";

import "./Dashboard.css";

import { useDebouncedValue } from "@mantine/hooks";
import { useLoaderData } from "react-router-dom";
import { useDisplayState } from "@src/hooks/useDisplayState";
import { useStudentData } from "@src/hooks/useStudentData";
import { useAuth } from "@src/hooks/useAuth";
import SearchAndActions from "@components/Admin/SearchAndActions/SearchAndActions";
import ChangePassword from "@components/Admin/ChangePassword/ChangePassword";

/**
 * Renders the dashboard component which is the root component for the admin section.
 *
 * @returns {JSX.Element} The dashboard component.
 */
function Dashboard() {
  const { students } = useLoaderData();
  const {
    data,
    handleAddStudent,
    handleDeleteStudent,
    handleUpdateStudent,
    filterStudents,
  } = useStudentData(students);
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

  return (
    <Container size="xl">
      <Box sx={{ padding: "20px" }}>
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
              studentData={filterStudents(debounced)}
              handleTimeLog={handleTimeLog}
              handleEdit={handleEdit}
              handleDelete={handleDeleteStudent}
            />
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
