import { Button, Select, Text } from "@mantine/core";
import { useState } from "react";
import {
  exportStudentsArr,
  masterClassArr,
  studentsWithClassArr,
  createCSV,
} from "./ExportStudentsData";

/**
 * Component for exporting students' data, by class, to a CSV file.
 *
 * @component - ExportStudents component that handles dropdown UI for export
 * @param {Object} props - The component props.
 * @param {Object[]} props.students - The array of student objects.
 * @returns {JSX.Element} The ExportStudents component.
 */
export default function ExportStudents({ students }) {
  const [selectedClass, setSelectedClass] = useState("");

  // takes the students enrolled in a class, and downloads a csv of their time in that class
  const exportStudents = (classItem) => {
    // students enrolled in selected class
    const classOfStudents = studentsWithClassArr(students, classItem);

    // transform students list to readable data for csv
    const csvData = exportStudentsArr(classOfStudents, classItem);

    // create csv file data
    const csv = createCSV(csvData);

    // create a new blob for csv file, attach it to a download link, and click it
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
