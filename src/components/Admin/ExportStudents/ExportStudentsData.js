import { secondsToHoursMinutesSeconds } from "@src/utilities/time";

/**
 * @typedef {Object} LoginTimestamp
 * @property {string} className - The name of the class.
 * @property {number} loginTime - The login time in milliseconds since epoch.
 * @property {number} logoutTime - The logout time in milliseconds since epoch.
 * @property {number} totalTime - The total time spent logged in, in milliseconds.
 */

/**
 * @typedef {Object} Student
 * @property {string} studentName - The name of the student.
 * @property {string} studentId - The ID of the student.
 * @property {string[]} classes - An array of class names the student is enrolled in.
 * @property {number} lastLogin - The last login time in milliseconds since epoch.
 * @property {number} lastLogout - The last logout time in milliseconds since epoch.
 * @property {string} lastClass - The name of the last class the student attended.
 * @property {LoginTimestamp[]} loginTimestamps - An array of login timestamps.
 */

/**
 * Creates an array of unique classes sorted in ascending or descending order.
 *
 * @param {Student[]} students - The array of student objects.
 * @param {string} [sort="asc"] - The sort order for the classes array. Default is "asc". Can be "asc" or "desc".
 * @returns {string[]} The array of unique classes sorted in ascending or descending order.
 */
export const masterClassArr = (students, sort = "asc") => {
  const classList = new Set();
  students.forEach((studentObj) => {
    studentObj.classes.forEach((classItem) => {
      if (classItem) {
        if (!classList.has(classItem)) {
          classList.add(classItem);
        }
      }
    });
  });

  const uniqueClassesArray = Array.from(classList);

  if (sort === "desc") {
    uniqueClassesArray.sort().reverse();
  } else {
    uniqueClassesArray.sort();
  }

  return uniqueClassesArray;
};

/**
 * Filters and sorts an array of students based on the specified class name and sort order.
 *
 * @param {Student[]} students - The array of students to filter and sort.
 * @param {string} className - The class name to filter the students by.
 * @param {string} [sort="desc"] - The sort order. Defaults to "desc" (descending order).
 * @returns {Student[]} - The filtered and sorted array of students.
 */
export const studentsWithClassArr = (
  students = [],
  className = "",
  sort = "desc"
) => {
  const filteredStudents = students.filter((student) =>
    student.classes.includes(className)
  );
  if (sort === "asc") {
    filteredStudents.sort((a, b) => a.studentName - b.studentName).reverse();
  } else {
    filteredStudents.sort((a, b) => a.studentName - b.studentName);
  }
  return filteredStudents;
};

/**
 * Returns an array of timestamps for a specific class from a student's login timestamps.
 *
 * @param {Student} student - The student object containing login timestamps.
 * @param {string} className - The name of the class to filter timestamps for.
 * @returns {LoginTimestamp[]} - An array of timestamps for the specified class.
 */
export const filterTimeStamps = (student = {}, className = "") => {
  if (!student.loginTimestamps) return [];
  if (className) {
    return student.loginTimestamps.filter(
      (timestamp) => timestamp.className === className
    );
  } else {
    return student.loginTimestamps;
  }
};

/**
 * Calculates the total number of seconds a student has spent in a specific class.
 *
 * @param {Student} student - The student object containing login timestamps.
 * @param {string} className - The name of the class to calculate total seconds for.
 * @returns {number} - The total number of seconds the student has spent in the specified class.
 */
export const findTotalSecondsByClass = (student, className = "") => {
  let totalSeconds = 0;
  let timestamps = className
    ? filterTimeStamps(student, className)
    : student.loginTimestamps;
  if (timestamps.length) {
    timestamps.forEach((timestamp) => {
      totalSeconds += timestamp.totalTime;
    });
  }
  return totalSeconds;
};

/**
 * Transforms student data based on export type and filter value.
 *
 * @param {Array} students - The array of student objects.
 * @param {string} exportType - The export type ("class" or "all").
 * @param {string} filterValue - The filter value for class export.
 * @returns {Array} - The transformed student data.
 */
export const transformStudents = (
  students = [],
  exportType = "all",
  filterValue = ""
) => {
  return students.map((student) => {
    const id = student.studentId;
    const firstName = student.studentName.split(" ")[0];
    const lastName = student.studentName.split(" ").slice(1).join(" ");
    const filteredTimestamps =
      exportType === "class"
        ? filterTimeStamps(student, filterValue)
        : student.loginTimestamps;
    const totalSeconds = findTotalSecondsByClass(
      student,
      exportType === "class" ? filterValue : ""
    );

    const transformedTimestamps = filteredTimestamps.map((timestamp) => {
      const timeFormatOptions = {
        hour12: true,
        hour: "2-digit",
        minute: "2-digit",
      };

      const loginDate = new Date(timestamp.loginTime);
      const logoutDate = new Date(timestamp.logoutTime);

      const year = loginDate.getFullYear();
      const month = loginDate.getMonth() + 1;
      const day = loginDate.getDate();

      const timeStampDate = `${year}-${month}-${day}`;
      const formattedLoginDate = loginDate.toLocaleTimeString(
        undefined,
        timeFormatOptions
      );
      const formattedLogoutDate = logoutDate.toLocaleTimeString(
        undefined,
        timeFormatOptions
      );

      const timeElapsed = secondsToHoursMinutesSeconds(timestamp.totalTime);

      return {
        className: timestamp.className,
        date: timeStampDate,
        login: formattedLoginDate,
        logout: formattedLogoutDate,
        timeClocked: timeElapsed,
      };
    });

    return {
      id,
      lastName,
      firstName,
      filterValue,
      totalSeconds,
      timestamps: transformedTimestamps,
    };
  });
};

/**
 * Creates a CSV string from the provided data.
 * Has set headers, creates a line for student name,
 * creates a row for each timestamp,
 * creates a final row for all time spent for that student
 *
 * @param {Array} csvData - The data from exportStudentsArr function
 * @returns {string} - The CSV string.
 */
export const createCSV = (csvData) => {
  let csv =
    "ID, Last Name, First Name, Date, Time In, Time Out, Elapsed Time, Class, Total Time\n";
  csvData.forEach((student) => {
    const { id, lastName, firstName, totalSeconds } = student;
    const formattedTotalTime = secondsToHoursMinutesSeconds(totalSeconds);
    csv += `${id},${lastName},${firstName},,,,,,\n`;
    student.timestamps.forEach((timestamp) => {
      const { date, login, logout, timeClocked, className } = timestamp;
      csv += `,,,${date},${login},${logout},${timeClocked},${className}\n`;
    });
    csv += `,,,,,,,,${formattedTotalTime}\n`;
  });
  return csv;
};

/**
 * Creates a CSV file from the provided data.
 *
 * @param {String} csvString - The csv string to be converted into a CSV file.
 * @returns {string} - The url of the created CSV file.
 */
export const createCSVFile = (csvString) => {
  // create a new blob for csv file, return file object url
  const blob = new Blob([csvString], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  return url;
};

/**
 * Downloads a file from the given URL with the specified filename.
 * Does not return anything, simulates click for downloading input file
 * @param {string} url - The URL of the file to download.
 * @param {string} filename - The desired filename for the downloaded file.
 */
export const downloadFile = (url, filename) => {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
};
