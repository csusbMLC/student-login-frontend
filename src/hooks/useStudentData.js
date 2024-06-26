import { useState } from "react";
import {
  addStudent,
  deleteStudent,
  updateStudent,
} from "@src/services/apiServices";

export const useStudentData = (initialData = []) => {
  const [data, setData] = useState(initialData);

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

  const handleUpdateStudent = async (
    updatedStudent,
    onSuccess = null,
    onError = null
  ) => {
    const newData = data.map((student) =>
      student.studentId === updatedStudent.studentId ? updatedStudent : student
    );
    try {
      const response = await updateStudent(
        updatedStudent.studentId,
        updatedStudent
      );
      if (response.success) {
        setData(newData);
        window.alert("Student updated successfully");
        onSuccess ? onSuccess() : null;
      } else {
        window.alert("Failed to update student" + response.message);
        onError ? onError() : null;
      }
    } catch (error) {
      console.log(error);
      window.alert("Error updating student!");
      onError ? onError() : null;
    }
  };

  const filterStudents = (searchTerm) => {
    return data.filter(
      (student) =>
        student.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.studentId.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return {
    data,
    handleAddStudent,
    handleDeleteStudent,
    handleUpdateStudent,
    filterStudents,
    setData,
  };
};
