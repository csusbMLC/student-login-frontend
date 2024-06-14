import { useState } from "react";
import { useInterval } from "@mantine/hooks";

/**
 * Custom hook for a timer.
 *
 * @param {number} initialValue - The initial value of the timer.
 * @returns {Object} - An object containing the timer value, startTimer function, stopTimer function, and active status.
 */
export const useTimer = (initialValue = 0) => {
  const [timer, setTimer] = useState(initialValue);
  const { start, stop, active } = useInterval(
    () => setTimer((s) => s + 1),
    1000
  );

  return {
    timer,
    startTimer: () => start(),
    stopTimer: () => stop(),
    active,
  };
};
