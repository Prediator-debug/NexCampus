import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Bell, Calendar, Megaphone, Search, AlertCircle, BookOpen, Award, Gift, Tag, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function Circulars() {
  const { circulars, currentUser } = useStore();
  const navigate = useNavigate();
  const isAdmin = currentUser?.role === 'admin';
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Academics', 'Events', 'Notice', 'Placement', 'Holiday', 'Scholarship', 'Official', 'General'];

  const filteredCirculars = circulars.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         c.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || c.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Official':    return <Bell size={16} />;
      case 'Events':      return <Calendar size={16} />;
      case 'Academics':
      case 'Academic':    return <BookOpen size={16} />;
      case 'Placement':   return <Award size={16} />;
      case 'Scholarship': return <Gift size={16} />;
      case 'Holiday':     return <Tag size={16} />;
      case 'Notice':      return <AlertCircle size={16} />;
      default:            return <Megaphone size={16} />;
    }
  };

  const getCategoryColor = (category) => {
    const map = {
      Official:    'text-blue-700 bg-blue-50 border-blue-100',
      Events:      'text-purple-700 bg-purple-50 border-purple-100',
      Academics:   'text-green-700 bg-green-50 border-green-100',
      Academic:    'text-green-700 bg-green-50 border-green-100',
      Notice:      'text-orange-700 bg-orange-50 border-orange-100',
      Placement:   'text-cyan-700 bg-cyan-50 border-cyan-100',
      Holiday:     'text-pink-700 bg-pink-50 border-pink-100',
      Scholarship: 'text-yellow-700 bg-yellow-50 border-yellow-100',
      General:     'text-slate-700 bg-slate-50 border-slate-100',
    };
    return map[category] || 'text-slate-600 bg-slate-50 border-slate-100';
  };

  return (
    <div className="animate-fade-in container mx-auto px-4 pt-10 pb-20">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-bold mb-3 text-slate-900">Campus Circulars</h1>
          <p className="text-slate-500 text-lg font-medium">Stay updated with official notices and events.</p>
        </div>
        <div className="w-full md:w-auto flex flex-col sm:flex-row gap-4">
          {isAdmin && (
            <Link
              to="/dashboard"
              state={{ activeTab: 'circulars' }}
              className="btn-primary flex items-center justify-center space-x-2 px-6 py-3 whitespace-nowrap"
            >
              <Megaphone size={20} />
              <span>Post Circular</span>
            </Link>
          )}
          <div className="relative group flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={20} />
            <input
              type="text"
              placeholder="Search notices..."
              className="w-full sm:w-80 bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-primary-500 transition-all placeholder:text-slate-400 text-slate-900"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2 mb-10">
        {categories.filter(cat => cat === 'All' || circulars.some(c => c.category === cat)).map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
              activeCategory === cat
                ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-primary-500/50 hover:text-primary-600'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Circulars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCirculars.length > 0 ? (
          filteredCirculars.map((c) => (
            <div
              key={c.id}
              className={`glass-card p-6 flex flex-col relative group overflow-hidden cursor-pointer hover:-translate-y-1 transition-all duration-300 ${c.important ? 'border-primary-500/30' : ''}`}
              onClick={() => navigate(`/circular/${c.id}`)}
            >
              {c.important && (
                <div className="absolute top-0 right-0 bg-primary-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
                  Important
                </div>
              )}

              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-lg border ${getCategoryColor(c.category)}`}>
                  {getCategoryIcon(c.category)}
                </div>
                <span className="text-xs font-bold uppercase tracking-widest opacity-60 text-slate-500">{c.category}</span>
                <span className="text-xs text-slate-400 ml-auto">
                  {new Date(c.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>

              <h3 className="text-lg font-bold mb-2 group-hover:text-primary-600 transition-colors line-clamp-2 text-slate-900">{c.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-5 flex-grow line-clamp-3">{c.content}</p>

              <div className="flex items-center pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2 text-primary-600 text-sm font-bold group-hover:gap-3 transition-all">
                  <span>Read More</span>
                  <ArrowRight size={14} />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center glass-card">
            <Megaphone size={48} className="mx-auto text-slate-200 mb-4" />
            <p className="text-xl text-slate-400 font-bold">No notices found matching your criteria.</p>
            <button
              onClick={() => { setSearchTerm(''); setActiveCategory('All'); }}
              className="mt-6 text-primary-600 font-bold hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
