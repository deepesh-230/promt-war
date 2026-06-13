import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Wind } from 'lucide-react';

const PomodoroTimer = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('focus'); // 'focus' or 'break'

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setTimeout(() => {
        setIsActive(false);
        // Automatically switch modes on completion
        if (mode === 'focus') {
          setMode('break');
          setTimeLeft(5 * 60);
        } else {
          setMode('focus');
          setTimeLeft(25 * 60);
        }
      }, 0);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode]);

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'focus' ? 25 * 60 : 5 * 60);
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setIsActive(false);
    setTimeLeft(newMode === 'focus' ? 25 * 60 : 5 * 60);
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

const BreathingExercise = () => {
  const [phase, setPhase] = useState('idle'); // idle, inhale, hold, exhale
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let timeoutId;
    if (isActive) {
      if (phase === 'idle' || phase === 'exhale') {
        // Use timeout wrapper to avoid sync state setting in effect
        timeoutId = setTimeout(() => {
            setPhase('inhale');
        }, 0);
      } else if (phase === 'inhale') {
        timeoutId = setTimeout(() => setPhase('hold'), 4000); // Inhale 4s
      } else if (phase === 'hold') {
        timeoutId = setTimeout(() => setPhase('exhale'), 4000); // Hold 4s
      }
    }
    return () => clearTimeout(timeoutId);
  }, [phase, isActive]);

  const toggleBreathing = () => {
    if (isActive) {
      setIsActive(false);
      setPhase('idle');
    } else {
      setIsActive(true);
      setPhase('idle'); // Triggers the effect to start 'inhale'
    }
  };

  const getInstruction = () => {
    if (!isActive) return "Start Exercise";
    switch (phase) {
      case 'inhale': return "Breathe In...";
      case 'hold': return "Hold...";
      case 'exhale': return "Breathe Out...";
      default: return "Ready";
    }
  };

  const getScale = () => {
    if (!isActive) return 1;
    switch (phase) {
      case 'inhale': return 2;
      case 'hold': return 2;
      case 'exhale': return 1;
      default: return 1;
    }
  };

  const getTransitionDuration = () => {
    switch (phase) {
      case 'inhale': return 4;
      case 'exhale': return 6; // Exhale longer (6s)
      default: return 0.5;
    }
  };

  return (
    <div className="bg-secondary p-8 rounded-2xl border border-slate-800 flex flex-col items-center justify-center min-h-[400px]">
      <h2 className="text-2xl font-bold text-white mb-2">Mindful Breathing</h2>
      <p className="text-slate-400 mb-12">4-4-6 technique to reduce anxiety</p>

      <div className="relative w-48 h-48 flex items-center justify-center mb-8">
        {/* Background pulsing ring */}
        {isActive && (
           <motion.div
            className="absolute inset-0 rounded-full bg-accent/20"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
           />
        )}
        
        {/* Main breathing circle */}
        <motion.div
          className="absolute w-24 h-24 rounded-full bg-accent flex items-center justify-center shadow-lg shadow-accent/20"
          animate={{ scale: getScale() }}
          transition={{ duration: getTransitionDuration(), ease: "easeInOut" }}
        >
          <Wind className="text-white opacity-50" size={32} />
        </motion.div>
        
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <span className="text-white font-medium drop-shadow-md text-lg">
             {isActive && getInstruction()}
          </span>
        </div>
      </div>

      <button
        onClick={toggleBreathing}
        className={`px-8 py-3 rounded-full font-bold transition-all ${isActive ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-accent text-white hover:bg-blue-600 shadow-lg shadow-accent/20'}`}
      >
        {isActive ? 'Stop' : 'Start Guided Breathing'}
      </button>
    </div>
  );
};

const Activities = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-white mb-2">Focus & Relax</h1>
        <p className="text-slate-400">Tools to help you stay productive and grounded during your preparation.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <PomodoroTimer />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <BreathingExercise />
        </motion.div>
      </div>
    </div>
  );
};

export default Activities;
