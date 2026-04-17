import { useEffect, useRef } from "react";
import { usePomodoroStore } from "@/store";

export function useTimer() {
  const { isRunning, isPaused, tick } = usePomodoroStore();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const tickRef = useRef(tick);

  useEffect(() => {
    tickRef.current = tick;
  }, [tick]);

  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = setInterval(() => {
        tickRef.current();
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isPaused]); 
}