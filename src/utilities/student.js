/**
 * Calculates the total time a student has spent in a specific class.
 *
 * @param {Array} studentTimestamps - An array of student timestamps.
 * @param {string} className - The name of the class.
 * @returns {number} - The total time the student has spent in the class in seconds.
 */
export const classTotalTime = (studentTimestamps, className) => {
  // console.log(className);
  let totalTime = studentTimestamps.reduce((acc, curr) => {
    if (curr.className === className) {
      // console.log("Matched Timestamp", curr);
      // console.log("current time + acc: ", curr.totalTime + acc);
      return curr.totalTime + acc;
    }
    return acc;
  }, 0);
  return totalTime;
};

/**
 * Filters an array of students based on the specified filter criteria.
 *
 * @param {Array} students - The array of students to filter.
 * @param {string} filterBy - The property to filter by. Valid options are "class" or "student".
 * @param {string} filterValue - The value to filter by.
 * @returns {Array} - The filtered array of students.
 */
export const filterStudents = (students, filterBy, filterValue) => {
  if (!filterBy || !filterValue) return students;

  const filterByOptions = {
    class: "classes",
    student: "studentId",
  };

  if (Object.hasOwnProperty.call(filterByOptions, filterBy)) {
    return students.filter((student) =>
      student[filterByOptions[filterBy]].includes(filterValue)
    );
  } else {
    return students;
  }
};

/**
 * Returns a boolean indicating whether obj is an empty object.
 *
 * @param {Object} obj - The object to check.
 * @returns {boolean} - True if obj is an empty object, false otherwise.
 *
 * @example
 * isEmptyObject({}); // true
 * isEmptyObject({ name: "John" }); // false
 *
 */
export const isEmptyObject = (obj) => {
  for (let key in obj) return false;
  return true;
};
