import { useState } from "react";
import { Stack, Text, TextInput, Button } from "@mantine/core";

import {
  createCSV,
  downloadFile,
  transformStudents,
} from "@components/Admin/ExportStudents/ExportStudentsData";
import { deleteAllStudents } from "@src/services/apiServices";

/**
 * Export all students to a CSV file.
 *
 * @param {Array} students - The array of student objects to export.
 * @returns {Promise<void>} - A promise that resolves when the export is complete.
 */
const exportAllStudents = async (students) => {
  const csvData = transformStudents(students);
  const csvString = createCSV(csvData);
  const csvFile = new Blob([csvString], { type: "text/csv" });
  const csvFileURL = URL.createObjectURL(csvFile);
  downloadFile(csvFileURL, "all-students.csv");
  await new Promise((resolve) => setTimeout(resolve, 1000));
};

/**
 * Component for resetting all students.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Array} props.data - An array of data used for exporting students.
 * @returns {JSX.Element} The rendered ResetAllStudents component.
 */
export default function ResetAllStudents({ data }) {
  const [resetVal, setResetVal] = useState("");

  return (
    <Stack spacing="xs">
      <Text>
        Please type {'"DELETE ALL STUDENTS"'} to delete all student data
        permanently.
      </Text>
      <TextInput
        placeholder="Type here to confirm"
        size="sm"
        value={resetVal}
        onChange={(e) => setResetVal(e.target.value)}
      />
      <Button
        color="red"
        fullWidth
        onClick={async () => {
          if (resetVal === "DELETE ALL STUDENTS") {
            console.log("Resetting all students");
            await exportAllStudents(data);
            const res = await deleteAllStudents();
            console.log(res);
            if (res.success) {
              setResetVal("");
              alert(
                "All students have been deleted. A backup file has been downloaded in the downloads folder. Please refresh the page to see changes."
              );
            } else {
              setResetVal("");
              alert("Failed to delete all students.");
            }
          } else {
            console.log("Invalid input for reset");
            alert("Invalid input for reset");
            setResetVal("");
          }
        }}
      >
        DELETE ALL STUDENTS PERMANENTLY
      </Button>
    </Stack>
  );
}
