/**
 * @typedef {Object} LoginTimestamp
 * @property {string} className - The name of the class.
 * @property {number} loginTime - The login time in milliseconds since epoch.
 * @property {number} logoutTime - The logout time in milliseconds since epoch.
 * @property {number} totalTime - The total time spent logged in, in milliseconds.
 */

import { secondsToHoursMinutesSeconds } from "@src/utilities/time";

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
 * @function masterClassArr - Creates an array of unique classes sorted in ascending or descending order.
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

export const studentsWithClassArr = (students, className, sort = "desc") => {
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

export const findTotalSecondsByClass = (student, className) => {
  let totalSeconds = 0;
  // console.log(student, "student in findTotalSecondsByClass");
  if (student.loginTimestamps.length) {
    student.loginTimestamps.forEach((timestamp) => {
      if (timestamp.className === className) {
        totalSeconds += timestamp.totalTime;
      }
    });
  }
  return totalSeconds;
};

export const timeStampsByClass = (student, className) => {
  return student.loginTimestamps.filter(
    (timestamp) => timestamp.className === className
  );
};

export const exportStudentsArr = (students, className) => {
  return students.map((student) => {
    const id = student.studentId;
    const lastName = student.studentName.split(" ")[0];
    const firstName = student.studentName.split(" ").slice(1).join(" ");
    const filteredTimestamps = timeStampsByClass(student, className);
    const totalSeconds = secondsToHoursMinutesSeconds(
      findTotalSecondsByClass(student, className)
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
      className,
      totalSeconds,
      timestamps: transformedTimestamps,
    };
  });
};

export const createCSV = (csvData) => {
  let csv =
    "ID, Last Name, First Name, Date, Time In, Time Out, Elapsed Time, Class\n";
  csvData.forEach((student) => {
    const { id, lastName, firstName, className, totalSeconds } = student;
    csv += `${id},${lastName},${firstName},,,,,${className}\n`;
    student.timestamps.forEach((timestamp) => {
      const { date, login, logout, timeClocked } = timestamp;
      csv += `,,,${date},${login},${logout},${timeClocked},${className}\n`;
    });
    csv += `Total Time: ${totalSeconds}\n`;
  });
  return csv;
};
