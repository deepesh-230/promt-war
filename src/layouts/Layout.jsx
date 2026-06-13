import { Outlet, Link } from 'react-router-dom';
import { LayoutDashboard, BookHeart, MessageSquare, Activity } from 'lucide-react';

const Layout = () => {
  return (
    <div className="flex h-screen bg-background text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-secondary flex flex-col shadow-lg border-r border-slate-800">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
            <BookHeart /> MindMate AI
          </h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4" aria-label="Sidebar Navigation">
          <Link to="/" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 transition-colors">
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          <Link to="/journal" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 transition-colors">
            <BookHeart size={20} /> AI Journal
          </Link>
          <Link to="/activities" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 transition-colors">
            <Activity size={20} /> Focus & Relax
          </Link>
          <Link to="/chat" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 transition-colors">
            <MessageSquare size={20} /> Mentor Chat
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
