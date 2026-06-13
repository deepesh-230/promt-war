import { motion } from 'framer-motion';
import PomodoroTimer from '../components/PomodoroTimer';
import BreathingExercise from '../components/BreathingExercise';

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
