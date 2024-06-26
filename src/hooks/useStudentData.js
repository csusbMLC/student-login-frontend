import { useState } from "react";
import {
  addStudent,
  deleteStudent,
  updateStudent,
} from "@src/services/apiServices";

/**
 * Custom hook to manage student data and provide functions to add, delete, update, and filter students.
 *
 * @param {Array} initialData - Initial array of student data.
 *
 * @returns {Object} - Returns an object containing the student data, and functions to manipulate the data.
 */
export const useStudentData = (initialData = []) => {
  const [data, setData] = useState(initialData);

  /**
   * Adds a new student.
   *
   * @param {Object} student - The student object to be added.
   * @param {Function} [onSuccess=null] - Optional callback function to be executed on successful addition.
   * @param {Function} [onError=null] - Optional callback function to be executed on error.
   */
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
        if (onSuccess) onSuccess();
      } else {
        window.alert("Failed to add student: " + response.message);
        if (onError) onError();
      }
    } catch (error) {
      console.log(error);
      window.alert("Error adding student");
      if (onError) onError();
    }
  };

  /**
   * Deletes a student.
   *
   * @param {string} studentId - The ID of the student to be deleted.
   * @param {Function} [onSuccess=null] - Optional callback function to be executed on successful deletion.
   * @param {Function} [onError=null] - Optional callback function to be executed on error.
   */
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
        if (onSuccess) onSuccess();
      } else {
        window.alert("Failed to delete student: " + response.message);
        if (onError) onError();
      }
    } catch (error) {
      console.log(error);
      window.alert("Error deleting student");
      if (onError) onError();
    }
  };

  /**
   * Updates a student.
   *
   * @param {Object} updatedStudent - The updated student object.
   * @param {Function} [onSuccess=null] - Optional callback function to be executed on successful update.
   * @param {Function} [onError=null] - Optional callback function to be executed on error.
   */
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
        if (onSuccess) onSuccess();
      } else {
        window.alert("Failed to update student: " + response.message);
        if (onError) onError();
      }
    } catch (error) {
      console.log(error);
      window.alert("Error updating student!");
      if (onError) onError();
    }
  };

  /**
   * Filters students based on a search term.
   *
   * @param {string} searchTerm - The term to filter students by.
   *
   * @returns {Array} - Returns an array of students that match the search term.
   */
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
