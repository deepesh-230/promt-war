import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wind } from 'lucide-react';

/** Breathing phase durations in milliseconds */
const INHALE_DURATION_MS = 4000;
const HOLD_DURATION_MS = 4000;
const EXHALE_DURATION_SEC = 6;

/**
 * A guided breathing exercise using the 4-4-6 technique
 * (inhale 4s, hold 4s, exhale 6s) to reduce anxiety.
 */
const BreathingExercise = () => {
  const [phase, setPhase] = useState('idle');
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let timeoutId;
    if (isActive) {
      if (phase === 'idle' || phase === 'exhale') {
        timeoutId = setTimeout(() => {
          setPhase('inhale');
        }, 0);
      } else if (phase === 'inhale') {
        timeoutId = setTimeout(() => setPhase('hold'), INHALE_DURATION_MS);
      } else if (phase === 'hold') {
        timeoutId = setTimeout(() => setPhase('exhale'), HOLD_DURATION_MS);
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
      setPhase('idle');
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
      case 'inhale':
      case 'hold':
        return 2;
      case 'exhale':
        return 1;
      default:
        return 1;
    }
  };

  const getTransitionDuration = () => {
    switch (phase) {
      case 'inhale': return INHALE_DURATION_MS / 1000;
      case 'exhale': return EXHALE_DURATION_SEC;
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

export default BreathingExercise;
