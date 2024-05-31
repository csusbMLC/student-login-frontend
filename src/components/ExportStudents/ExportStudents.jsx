import { Button, Select, Text } from "@mantine/core";
import { useState } from "react";
import {
  exportStudentsArr,
  masterClassArr,
  studentsWithClassArr,
  createCSV,
} from "./ExportStudentsData";

/**
 * Component for exporting students' data to a CSV file.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Object[]} props.students - The array of student objects.
 * @returns {JSX.Element} The ExportStudents component.
 */
export default function ExportStudents({ students }) {
  const [selectedClass, setSelectedClass] = useState("");

  // Need to make a list of every unique class in the students array
  // Then, display a dropdown of all the classes
  // Then, when a class is selected
  // Export a CSV of all the students in that class along with their student ID and total hours

  const exportStudents = (classItem) => {
    // students enrolled in selected class
    const classOfStudents = studentsWithClassArr(students, classItem);

    // transform students list to readable data for csv
    const csvData = exportStudentsArr(classOfStudents, classItem);

    // create csv file data
    const csv = createCSV(csvData);

    // create a new blob and download it
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${classItem} Timesheet.csv`;
    a.click();
  };

  return (
    <>
      <Text>Choose Class to Export</Text>
      <Select
        data={masterClassArr(students)}
        value={selectedClass}
        onChange={setSelectedClass}
      />
      <Button onClick={() => exportStudents(selectedClass)}>Export</Button>
    </>
  );
}
