import { useState } from 'react';
import DOMPurify from 'dompurify';
import { motion } from 'framer-motion';
import { Send, AlertTriangle } from 'lucide-react';
import { analyzeJournalWithGemini } from '../services/geminiService';

const Journal = () => {
  const [content, setContent] = useState('');
  const [journals, setJournals] = useState(() => {
    const saved = localStorage.getItem('mindmate_journals');
    if (saved) {
      return JSON.parse(saved);
    }
    return [];
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    setSubmitting(true);
    try {
      const analysis = await analyzeJournalWithGemini(content);
      
      const newJournal = {
        _id: Date.now().toString(),
        content,
        analysis,
        createdAt: new Date().toISOString()
      };

      const updatedJournals = [newJournal, ...journals];
      setJournals(updatedJournals);
      localStorage.setItem('mindmate_journals', JSON.stringify(updatedJournals));
      setContent('');
    } catch (err) {
      console.error('Failed to submit journal', err);
    } finally {
      setSubmitting(false);
    }
  };

  const getRiskColor = (risk) => {
    switch (risk?.toLowerCase()) {
      case 'high': return 'text-red-400 border-red-400/20 bg-red-400/10';
      case 'medium': return 'text-orange-400 border-orange-400/20 bg-orange-400/10';
      case 'low': return 'text-green-400 border-green-400/20 bg-green-400/10';
      default: return 'text-slate-400 border-slate-700 bg-slate-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-white mb-2">AI Journal</h1>
        <p className="text-slate-400">Write down your thoughts, struggles, or wins today. Our AI will analyze your emotional state.</p>
      </header>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-secondary p-6 rounded-2xl border border-slate-800">
        <form onSubmit={handleSubmit} className="relative">
          <textarea
            className="w-full h-40 bg-slate-900 border border-slate-700 rounded-xl p-4 text-white focus:outline-none focus:border-primary transition-colors resize-none"
            placeholder="How are you feeling today? What's on your mind regarding your preparation?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button 
            type="submit"
            aria-label="Submit Journal Entry"
            disabled={submitting}
            className="absolute bottom-4 right-4 bg-primary hover:bg-green-600 text-white p-3 rounded-xl transition-colors disabled:opacity-50"
          >
            {submitting ? 'Analyzing...' : <Send size={20} />}
          </button>
        </form>
      </motion.div>

      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white">Previous Entries</h2>
        {journals.map((journal) => (
          <motion.div 
            key={journal._id} 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="bg-secondary p-6 rounded-2xl border border-slate-800 space-y-4"
          >
            <div className="flex justify-between items-start">
              <p 
                className="text-slate-300 flex-1 whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(journal.content) }}
              />
              <span className="text-xs text-slate-500 ml-4">
                {new Date(journal.createdAt).toLocaleDateString()}
              </span>
            </div>
            
            {journal.analysis && (
              <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-slate-400 mb-2">AI Analysis</h4>
                  <div className="flex flex-wrap gap-2">
                    <span className={`px-3 py-1 rounded-full border text-xs font-medium ${getRiskColor(journal.analysis.burnoutRisk)} flex items-center gap-1`}>
                      <AlertTriangle size={12} /> Burnout Risk: {journal.analysis.burnoutRisk}
                    </span>
                    <span className={`px-3 py-1 rounded-full border text-xs font-medium ${getRiskColor(journal.analysis.stressLevel)}`}>
                      Stress: {journal.analysis.stressLevel}
                    </span>
                    <span className="px-3 py-1 rounded-full border border-accent/20 bg-accent/10 text-accent text-xs font-medium">
                      Sentiment: {journal.analysis.sentiment}
                    </span>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-400 mb-2">Triggers Identified</h4>
                  <div className="flex flex-wrap gap-2">
                    {journal.analysis.triggers?.map((t, i) => (
                      <span key={i} className="px-2 py-1 bg-slate-800 text-slate-300 text-xs rounded-md">
                        {t}
                      </span>
                    )) || <span className="text-xs text-slate-500">None detected</span>}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        ))}
        {journals.length === 0 && (
          <div className="text-center text-slate-500 py-10">
            No journal entries yet. Start writing to see AI insights!
          </div>
        )}
      </div>
    </div>
  );
};

export default Journal;
