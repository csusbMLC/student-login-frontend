import { useState } from "react";
import { useInterval } from "@mantine/hooks";

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
