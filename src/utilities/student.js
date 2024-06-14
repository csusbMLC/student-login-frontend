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
