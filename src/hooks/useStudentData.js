import { useState } from "react";
import { addStudent, deleteStudent } from "@src/services/apiServices";

export const useStudentData = (initialData = []) => {
  const [data, setData] = useState(initialData);
  const [filteredData, setFilteredData] = useState(initialData);

  const handleAddStudent = async (
    student,
    onSuccess = null,
    onError = null
  ) => {
    try {
      const response = await addStudent(student);
      if (response.success) {
        setData([...data, response.student]);
        window.alert("Student added successfully");
        onSuccess ? onSuccess() : null;
      } else {
        window.alert("Failed to add student" + response.message);
        onError ? onError() : null;
      }
    } catch (error) {
      console.log(error);
      window.alert("Error adding student");
      onError ? onError() : null;
    }
  };

  const handleDeleteStudent = async (
    studentId,
    onSuccess = null,
    onError = null
  ) => {
    try {
      const response = await deleteStudent(studentId);
      if (response.success) {
        setData(data.filter((student) => student.studentId !== studentId));
        window.alert("Student deleted successfully");
        onSuccess ? onSuccess() : null;
      } else {
        window.alert("Failed to delete student" + response.message);
        onError ? onError() : null;
      }
    } catch (error) {
      console.log(error);
      window.alert("Error deleting student");
      onError ? onError() : null;
    }
  };

  const handleUpdateStudent = async (student) => {
    // Logic to update student
  };

  const filterStudents = (searchTerm) => {
    // Logic to filter students
  };

  return {
    data,
    filteredData,
    handleAddStudent,
    handleDeleteStudent,
    handleUpdateStudent,
    filterStudents,
    setData,
    setFilteredData,
  };
};
