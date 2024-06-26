import { useCallback, useEffect, useState } from "react";
import EditStudentForm from "@components/EditStudentForm/EditStudentForm";
import AddStudentForm from "@components/AddStudentForm/AddStudentForm";
import TimeLogForm from "@components/TimeLogForm/TimeLogForm";
import {
  Button,
  Title,
  Box,
  Modal,
  Group,
  Text,
  Container,
  TextInput,
  UnstyledButton,
} from "@mantine/core";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import ImportStudents from "@components/ImportStudents/ImportStudents";
import { IconSearch } from "@tabler/icons-react";

import "./Dashboard.css";
import ExportStudents from "@components/ExportStudents/ExportStudents";
import { useLoaderData, useNavigate } from "react-router-dom";
import {
  addStudent,
  deleteStudent,
  updateStudent,
} from "@src/services/apiServices";
import { URL } from "@src/constants";
import axios from "axios";
import StudentTable from "@components/StudentTable/StudentTable";
import { useDisplayState } from "@src/hooks/useDisplayState";
import { useStudentData } from "@src/hooks/useStudentData";

function Dashboard() {
  const navigate = useNavigate();
  const { students } = useLoaderData();
  const [opened, { open, close }] = useDisclosure(false);
  const {
    data,
    setData,
    filteredData,
    setFilteredData,
    handleAddStudent,
    handleDeleteStudent,
  } = useStudentData(students);
  // const [data, setData] = useState([]);
  // const [filteredData, setFilteredData] = useState([]);
  const [
    {
      showDashboard,
      showAddStudentForm,
      showEditStudentForm,
      showImportStudentsForm,
      showTimeLogForm,
    },
    handleDisplay,
  ] = useDisplayState();
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchVal, setSearchVal] = useState("");
  const [debounced] = useDebouncedValue(searchVal, 200);
  const [user, setUser] = useState("");

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    navigate("/admin/login");
  }, [navigate]);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/admin/login");
      }
      const { data } = await axios.post(
        `${URL}/auth/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { status, username } = data;
      setUser(username);
      if (status) {
        console.log("verified");
      } else {
        handleLogout();
      }
    };
    verifyToken();
  }, [handleLogout, navigate]);

  // useEffect(() => {
  //   console.log("students", students);
  //   setData(students);
  //   setFilteredData(students);
  // }, [students]);

  const handleEdit = (index) => {
    setSelectedStudent(filteredData[index]);
    handleDisplay("showEditStudentForm");
  };

  const handleTimeLog = (index) => {
    setSelectedStudent(filteredData[index]);
    // setShowTimeLogForm(true);
    handleDisplay("showTimeLogForm");
  };

  const handleSave = (updatedStudent) => {
    const newData = [...data];
    const index = newData.findIndex(
      (student) => student.studentId === updatedStudent.studentId
    );
    newData[index] = updatedStudent;
    // send the updated data to the server
    updateStudent(updatedStudent.studentId, updatedStudent)
      .then((data) => {
        console.log("success", data);
        setData(newData);
        window.alert(data.message);
        handleDisplay();
      })
      .catch((error) => {
        console.log(error);
        window.alert("Failed to update student");
      });
  };

  // const handleDelete = (studentId) => {
  //   const newData = data.filter((student) => student.studentId !== studentId);
  //   // delete the student from the server
  //   deleteStudent(studentId)
  //     .then((data) => {
  //       console.log("success", studentId, data);
  //       setData(newData);
  //       window.alert(data.message);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //       alert("Failed to delete student");
  //     });
  // };

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
      confirmProps: { color: "red", variant: "filled", autoContrast: true },
      cancelProps: { color: "black", variant: "default", autoContrast: true },
      onCancel: () => console.log("canceled"),
      onConfirm: () => handleDeleteStudent(studentId),
    });

  const handleSearch = useCallback(() => {
    if (debounced) {
      setFilteredData(
        data.filter(
          (student) =>
            student.studentName
              .toLowerCase()
              .includes(debounced.toLowerCase()) ||
            student.studentId.toLowerCase().includes(debounced.toLowerCase())
        )
      );
    } else {
      setFilteredData(data);
    }
  }, [debounced, data]);

  useEffect(() => {
    handleSearch();
  }, [debounced, data, handleSearch]);

  return (
    <Container size="xl">
      <Box sx={{ padding: "20px" }}>
        <Group justify="space-between" mb={"xl"}>
          <UnstyledButton>{user}</UnstyledButton>
          <Title order={1}>MLC Admin Home</Title>
          <Button onClick={handleLogout}>{"Logout"}</Button>
        </Group>
        {showDashboard && (
          <Box>
            <Group justify="space-between" mb={"xl"}>
              <TextInput
                placeholder="Search"
                size="sm"
                leftSection={<IconSearch />}
                styles={{ section: { pointerEvents: "none" } }}
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
              />
              <Button
                onClick={() => handleDisplay("showAddStudentForm")}
                color="green"
                variant="filled"
                style={{}}
                className="btn-view-log"
                autoContrast
              >
                Add Student
              </Button>

              <Button
                onClick={() => handleDisplay("showImportStudentsForm")}
                color="green"
                variant="filled"
                style={{}}
                className="btn-view-log"
                autoContrast
              >
                Import Students
              </Button>
              <Modal
                opened={opened}
                onClose={close}
                title="Export to Spreadsheet"
              >
                <ExportStudents students={data} />
              </Modal>
              <Button
                onClick={open}
                color="green"
                variant="filled"
                style={{}}
                className="btn-view-log"
                autoContrast
              >
                Export Time
              </Button>
            </Group>
            <StudentTable
              studentData={filteredData}
              handleTimeLog={handleTimeLog}
              handleEdit={handleEdit}
              openDeleteModal={openDeleteModal}
            />
          </Box>
        )}
        {showTimeLogForm && (
          <TimeLogForm
            student={selectedStudent}
            onSave={handleSave}
            onCancel={handleDisplay}
          />
        )}
        {showEditStudentForm && (
          <EditStudentForm
            student={selectedStudent}
            onSave={handleSave}
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
      </Box>
    </Container>
  );
}

export default Dashboard;
