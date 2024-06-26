// src/hooks/useDisplayState.js
import { useState } from "react";

export function useDisplayState(
  initialState = {
    showDashboard: true,
    showAddStudentForm: false,
    showEditStudentForm: false,
    showTimeLogForm: false,
    showImportStudentsForm: false,
  }
) {
  const [displayState, setDisplayState] = useState(initialState);

  function handleDisplay(showState = "") {
    let newState = {
      showDashboard: false,
      showAddStudentForm: false,
      showEditStudentForm: false,
      showTimeLogForm: false,
      showImportStudentsForm: false,
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
