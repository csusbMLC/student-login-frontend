// src/hooks/useFileReader.js

import { useState, useCallback } from "react";

/**
 * Custom hook for reading files using the FileReader API.
 * @returns {Object} An object containing the file, error, readFile, and handleFileChange functions.
 */
export const useFileReader = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);

  /**
   * Reads the contents of a file using the FileReader API.
   * @param {File} file - The file to be read.
   * @param {Function} [callback=data => data] - Optional callback function to transform the file data.
   * @returns {Promise} A promise that resolves with the transformed file data.
   */
  const readFile = useCallback((file, callback = (data) => data) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target.result;
        resolve(callback(data));
      };
      reader.onerror = (e) => {
        console.log(e);
        setError(new Error("Failed to read file"));
        reject(new Error("Failed to read file"));
      };
      reader.readAsArrayBuffer(file);
    });
  }, []);

  /**
   * Handles the change event when a file is selected.
   * @param {File} inputFile - The selected file.
   */
  const handleFileChange = (inputFile) => {
    console.log("handleFileChange", inputFile);
    // get file object
    if (inputFile) {
      setFile(inputFile);
      setError(null);
    } else {
      setFile(null);
      setError("Please select a file");
    }
  };

  return { file, error, readFile, handleFileChange };
};
