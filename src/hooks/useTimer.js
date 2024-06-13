import { useState, useEffect } from "react";

export const useTimer = (initialValue = 0) => {
  const [timer, setTimer] = useState(initialValue);
  const [startTimer, setStartTimer] = useState(false);

  useEffect(() => {
    let interval = null;
    if (startTimer) {
      interval = setInterval(() => {
        setTimer((timer) => timer + 1);
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [startTimer]);

  return {
    timer,
    startTimer: () => setStartTimer(true),
    stopTimer: () => setStartTimer(false),
  };
};
