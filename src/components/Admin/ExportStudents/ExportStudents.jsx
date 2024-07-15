import { Button, Select, Text } from "@mantine/core";
import { useMemo, useState } from "react";
import {
  transformStudents,
  masterClassArr,
  createCSVFile,
  downloadFile,
  createCSV,
} from "./ExportStudentsData";
import { filterStudents } from "@src/utilities/student";

const EXPORT_TYPES = {
  CLASS: "class",
  STUDENT: "student",
  ALL: "all",
};

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
  const [selectedStudent, setSelectedStudent] = useState("");
  const [exportType, setExportType] = useState(EXPORT_TYPES.CLASS);
  const memoMasterClassArr = useMemo(
    () => masterClassArr(students),
    [students]
  );
  const delayedDownload = (csvData, filename, delay) => {
    setTimeout(() => {
      const csvFile = createCSVFile(csvData); // Ensure this returns a blob URL
      downloadFile(csvFile, filename); // Download the CSV after the delay
    }, delay);
  };
  // takes the students enrolled in a class, and downloads a csv of their time in that class
  const exportStudents = (exportType) => {
    let filterValue =
      exportType === EXPORT_TYPES.CLASS
        ? selectedClass
        : EXPORT_TYPES.STUDENT
        ? selectedStudent
        : "";
    if (EXPORT_TYPES.CLASS === exportType && filterValue === "All Classes") {
      masterClassArr(students).forEach((className, index) => {
        const filteredStudents = filterStudents(
          students,
          exportType,
          className
        );
        const csvData = transformStudents(
          filteredStudents,
          exportType,
          className
        );
        const csvString = createCSV(csvData);

        // Assuming a base delay of 1000ms (1 second) and increasing it for each file
        delayedDownload(csvString, `${className}.csv`, 500 * index);
      });
    } else {
      // name assigned to output csv file
      const filename = `${
        EXPORT_TYPES.ALL === exportType ? "Students" : filterValue
      } Timesheet.csv`;

      // filters students based on export type and value
      const filteredStudents = filterStudents(
        students,
        exportType,
        filterValue
      );

      // transform students list to readable data for csv
      const csvData = transformStudents(
        filteredStudents,
        exportType,
        filterValue
      );

      // create web worker for csv logic to keep main thread free for UI render
      const csvWorker = new Worker(new URL("./csvWorker.js", import.meta.url), {
        type: "module",
      });
      csvWorker.postMessage(csvData);
      csvWorker.onmessage = (e) => {
        const csvString = e.data;
        // uses csvData to create a file object and returns the url for that object
        const csvFileUrl = createCSVFile(csvString);

        // creates download for csv by simulating click on a element with csvUrl
        downloadFile(csvFileUrl, filename);

        csvWorker.terminate();
      };
    }
  };

  return (
    <>
      <Text>Choose export type</Text>
      <Select
        data={Array.from(Object.values(EXPORT_TYPES))}
        value={exportType}
        onChange={setExportType}
        mb={"sm"}
      />
      {exportType === EXPORT_TYPES.CLASS && (
        <>
          <Text>Select class to export</Text>
          <Select
            data={["All Classes", ...memoMasterClassArr]}
            value={selectedClass}
            onChange={setSelectedClass}
            mb={"sm"}
            searchable
          />
        </>
      )}
      {exportType === EXPORT_TYPES.STUDENT && (
        <>
          <Text>Select student to export</Text>
          <Select
            data={students.map((student) => student.studentId).sort()}
            value={selectedStudent}
            onChange={setSelectedStudent}
            mb={"sm"}
            searchable
          />
        </>
      )}
      <Button onClick={() => exportStudents(exportType)}>Export</Button>
    </>
  );
}
