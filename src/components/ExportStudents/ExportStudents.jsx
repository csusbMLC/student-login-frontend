import { Button, Select, Text } from "@mantine/core";
import { useMemo, useState } from "react";
import {
  exportStudentsArr,
  masterClassArr,
  studentsWithClassArr,
  createCSVFile,
  downloadFile,
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
  const memoMasterClassArr = useMemo(
    () => masterClassArr(students),
    [students]
  );
  // takes the students enrolled in a class, and downloads a csv of their time in that class
  const exportStudents = (classItem) => {
    const filename = `${classItem} Timesheet.csv`;

    // students enrolled in selected class
    const classOfStudents = studentsWithClassArr(students, classItem);

    // transform students list to readable data for csv
    const csvData = exportStudentsArr(classOfStudents, classItem);

    // uses csvData to create a file object and returns the url for that object
    const csvFileUrl = createCSVFile(csvData);

    // creates download for csv by simulating click on a element with csvUrl
    downloadFile(csvFileUrl, filename);
  };

  return (
    <>
      <Text>Choose Class to Export</Text>
      <Select
        data={memoMasterClassArr}
        value={selectedClass}
        onChange={setSelectedClass}
      />
      <Button onClick={() => exportStudents(selectedClass)}>Export</Button>
    </>
  );
}
