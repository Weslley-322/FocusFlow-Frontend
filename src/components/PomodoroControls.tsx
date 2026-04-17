import { useEffect, useRef } from "react";
import { usePomodoroStore } from "@/store";
import { Button } from "./Button";
import { Play, Pause, Square, RotateCcw } from "lucide-react";

interface PomodoroControlsProps {
  onComplete?: () => void;
}

export function PomodoroControls({ onComplete }: PomodoroControlsProps) {
  const { isRunning, isPaused, isBreak, pause, resume, stop, reset } = usePomodoroStore();
  const hasCompletedRef = useRef(false);
  const wasBreakRef = useRef(false);

  useEffect(() => {
    // Detecta transição para pausa (foco terminou)
    if (isRunning && isBreak && !wasBreakRef.current && onComplete && !hasCompletedRef.current) {
      hasCompletedRef.current = true;
      onComplete();
    }

    wasBreakRef.current = isBreak;

    // Reset das flags quando timer para
    if (!isRunning) {
      hasCompletedRef.current = false;
      wasBreakRef.current = false;
    }
  }, [isRunning, isBreak, onComplete]);

  return (
    <div className="flex items-center justify-center gap-4">
      {!isRunning && (
        <Button size="lg" variant="secondary" onClick={reset} className="flex items-center justify-center gap-2">
          <RotateCcw size={20} />
          Resetar
        </Button>
      )}
      {isRunning && !isPaused && (
        <Button size="lg" variant="secondary" onClick={pause} className="flex items-center justify-center gap-2">
          <Pause size={20} />
          Pausar
        </Button>
      )}
      {isRunning && isPaused && (
        <Button size="lg" onClick={resume} className="flex items-center justify-center gap-2">
          <Play size={20} />
          Continuar
        </Button>
      )}
      {isRunning && (
        <Button size="lg" variant="danger" onClick={stop} className="aspect-square px-0 flex items-center justify-center">
          <Square size={20} />
        </Button>
      )}
    </div>
  );
}