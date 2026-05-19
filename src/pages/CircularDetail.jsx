import { useParams, useNavigate, Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import {
  ArrowLeft, Bell, Calendar, BookOpen, Award, Gift, Tag,
  AlertCircle, Megaphone, Clock, Share2
} from 'lucide-react';

const getCategoryIcon = (category) => {
  switch (category) {
    case 'Official':    return <Bell size={18} />;
    case 'Events':      return <Calendar size={18} />;
    case 'Academics':
    case 'Academic':    return <BookOpen size={18} />;
    case 'Placement':   return <Award size={18} />;
    case 'Scholarship': return <Gift size={18} />;
    case 'Holiday':     return <Tag size={18} />;
    case 'Notice':      return <AlertCircle size={18} />;
    default:            return <Megaphone size={18} />;
  }
};

const getCategoryColor = (category) => {
  const map = {
    Official:    { bg: 'bg-blue-50',     border: 'border-blue-200',    text: 'text-blue-700' },
    Events:      { bg: 'bg-purple-50',   border: 'border-purple-200',  text: 'text-purple-700' },
    Academics:   { bg: 'bg-green-50',    border: 'border-green-200',   text: 'text-green-700' },
    Academic:    { bg: 'bg-green-50',    border: 'border-green-200',   text: 'text-green-700' },
    Notice:      { bg: 'bg-orange-50',   border: 'border-orange-200',  text: 'text-orange-700' },
    Placement:   { bg: 'bg-cyan-50',     border: 'border-cyan-200',    text: 'text-cyan-700' },
    Holiday:     { bg: 'bg-pink-50',     border: 'border-pink-200',    text: 'text-pink-700' },
    Scholarship: { bg: 'bg-yellow-50',   border: 'border-yellow-200',  text: 'text-yellow-700' },
    General:     { bg: 'bg-slate-50',    border: 'border-slate-200',   text: 'text-slate-700' },
  };
  return map[category] || map.General;
};

export default function CircularDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { circulars } = useStore();

  const circular = circulars.find(c => c.id === id);

  if (!circular) {
    return (
      <div className="max-w-2xl mx-auto my-16 text-center px-4">
        <div className="bg-white border border-slate-200 rounded-3xl p-12 shadow-xl shadow-slate-200/50">
          <Megaphone size={48} className="text-slate-300 mx-auto mb-4" />
          <h2 className="text-slate-900 text-2xl font-bold mb-2">Circular not found</h2>
          <p className="text-slate-500 mb-8">This circular may have been removed.</p>
          <button onClick={() => navigate('/circulars')} className="btn-primary">
            ← Back to Circulars
          </button>
        </div>
      </div>
    );
  }

  const color = getCategoryColor(circular.category);
  const formattedDate = new Date(circular.date).toLocaleDateString(undefined, {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });

  return (
    <div className="animate-fade-in max-w-3xl mx-auto px-4 pt-10 pb-20">

      {/* Back button */}
      <button
        onClick={() => navigate('/circulars')}
        className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-xl text-slate-500 px-4 py-2 font-semibold text-sm hover:text-primary-600 hover:border-primary-200 transition-all mb-8 shadow-sm"
      >
        <ArrowLeft size={16} /> Back to Circulars
      </button>

      {/* Main Card */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xl shadow-slate-200/60 relative">

        {/* Top accent line */}
        <div className="h-1.5 bg-gradient-to-r from-primary-600 to-indigo-600" />

        {/* Header area */}
        <div className="p-8 sm:p-10 pb-6">

          {/* Category + Important row */}
          <div className="flex items-center gap-3 mb-6 flex-wrap">
            <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border ${color.bg} ${color.border} ${color.text}`}>
              {getCategoryIcon(circular.category)}
              {circular.category}
            </span>

            {circular.important && (
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50 border border-red-100 text-red-600 text-xs font-bold uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                Important
              </span>
            )}

            <span className="ml-auto inline-flex items-center gap-1.5 text-slate-400 text-sm">
              <Clock size={14} /> {formattedDate}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight">
            {circular.title}
          </h1>
        </div>

        {/* Divider */}
        <div className="h-px bg-slate-100 mx-8 sm:mx-10" />

        {/* Content */}
        <div className="p-8 sm:p-10 py-8">
          <p className="text-slate-600 text-lg leading-relaxed whitespace-pre-wrap">
            {circular.content}
          </p>
        </div>

        {/* Footer actions */}
        <div className="p-6 sm:px-10 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between flex-wrap gap-4">
          <Link to="/circulars" className="inline-flex items-center gap-2 text-primary-600 font-bold text-sm hover:underline">
            <ArrowLeft size={16} /> All Circulars
          </Link>

          <button
            onClick={() => { navigator.clipboard?.writeText(window.location.href); }}
            className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-xl text-slate-600 px-4 py-2 font-bold text-sm hover:bg-slate-50 transition-all shadow-sm"
          >
            <Share2 size={16} /> Copy Link
          </button>
        </div>
      </div>
    </div>
  );
}
