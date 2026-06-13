import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

/** Duration constants in seconds */
const FOCUS_DURATION = 25 * 60;
const BREAK_DURATION = 5 * 60;
const TICK_INTERVAL_MS = 1000;

/**
 * A Pomodoro-style focus timer that alternates between
 * focus sessions (25 min) and break sessions (5 min).
 */
const PomodoroTimer = () => {
  const [timeLeft, setTimeLeft] = useState(FOCUS_DURATION);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('focus');

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, TICK_INTERVAL_MS);
    } else if (timeLeft === 0) {
      setTimeout(() => {
        setIsActive(false);
        if (mode === 'focus') {
          setMode('break');
          setTimeLeft(BREAK_DURATION);
        } else {
          setMode('focus');
          setTimeLeft(FOCUS_DURATION);
        }
      }, 0);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'focus' ? FOCUS_DURATION : BREAK_DURATION);
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setIsActive(false);
    setTimeLeft(newMode === 'focus' ? FOCUS_DURATION : BREAK_DURATION);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="bg-secondary p-8 rounded-2xl border border-slate-800 flex flex-col items-center">
      <h2 className="text-2xl font-bold text-white mb-6">Pomodoro Timer</h2>

      <div className="flex gap-4 mb-8">
        <button
          onClick={() => switchMode('focus')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${mode === 'focus' ? 'bg-primary text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
        >
          Focus (25m)
        </button>
        <button
          onClick={() => switchMode('break')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${mode === 'break' ? 'bg-accent text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
        >
          Break (5m)
        </button>
      </div>

      <div className="text-7xl font-bold text-white mb-8 tabular-nums">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>

      <div className="flex gap-4">
        <button
          onClick={toggleTimer}
          aria-label={isActive ? "Pause Timer" : "Start Timer"}
          className="bg-slate-800 hover:bg-slate-700 text-white p-4 rounded-full transition-colors flex items-center justify-center w-16 h-16"
        >
          {isActive ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
        </button>
        <button
          onClick={resetTimer}
          aria-label="Reset Timer"
          className="bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white p-4 rounded-full transition-colors flex items-center justify-center w-16 h-16"
        >
          <RotateCcw size={24} />
        </button>
      </div>
    </div>
  );
};

export default PomodoroTimer;
