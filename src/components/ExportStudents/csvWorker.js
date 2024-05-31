// Import the createCSV function from ExportStudentsData.js
import { createCSV } from "./ExportStudentsData";

// The onmessage event handler is triggered when the worker receives a message from the main thread.
// In this case, the message is expected to contain the csvData.
onmessage = (e) => {
  // Extract the csvData from the message event.
  const csvData = e.data;

  // Use the createCSV function to convert the csvData into a CSV string.
  const csvString = createCSV(csvData);

  // Use postMessage to send the CSV string back to the main thread.
  postMessage(csvString);
};
