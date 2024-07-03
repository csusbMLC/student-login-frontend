// src/hooks/useDisplayState.js
import { useState } from "react";

/**
 * Custom hook to manage the display state of various forms in the application.
 *
 * @param {Object} initialState - Initial state of the display.
 * @param {boolean} initialState.showDashboard - Initial state of the dashboard display.
 * @param {boolean} initialState.showAddStudentForm - Initial state of the add student form display.
 * @param {boolean} initialState.showEditStudentForm - Initial state of the edit student form display.
 * @param {boolean} initialState.showTimeLogForm - Initial state of the time log form display.
 * @param {boolean} initialState.showImportStudentsForm - Initial state of the import students form display.
 *
 * @returns {[Object, Function]} - Returns the current display state and a function to update the display state.
 */
export function useDisplayState(
  initialState = {
    showDashboard: true,
    showAddStudentForm: false,
    showEditStudentForm: false,
    showTimeLogForm: false,
    showImportStudentsForm: false,
    showChangePassword: false,
  }
) {
  const [displayState, setDisplayState] = useState(initialState);

  /**
   * Updates the display state to show the specified form.
   *
   * @param {string} showState - The key of the state to be displayed.
   * If invalid, defaults to showing the dashboard.
   */
  function handleDisplay(showState = "") {
    let newState = {
      showDashboard: false,
      showAddStudentForm: false,
      showEditStudentForm: false,
      showTimeLogForm: false,
      showImportStudentsForm: false,
      showChangePassword: false,
    };
    if (Object.keys(newState).includes(showState)) {
      newState[showState] = true;
    } else {
      newState.showDashboard = true;
    }
    setDisplayState(newState);
  }

  return [displayState, handleDisplay];
}
