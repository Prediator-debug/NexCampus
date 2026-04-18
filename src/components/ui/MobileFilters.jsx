import { X, Check } from 'lucide-react';

export default function MobileFilters({ isOpen, onClose, selectedCategories, toggleCategory, selectedTypes, toggleType, activeFilterCount }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[600]">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in" onClick={onClose}></div>
      
      {/* Drawer / Modal */}
      <div className="absolute bottom-0 left-0 w-full bg-white rounded-t-[3rem] shadow-2xl animate-slide-up flex flex-col max-h-[85vh] sm:max-w-lg sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:bottom-auto sm:rounded-[2.5rem]">
        {/* Handle (Mobile only) */}
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mt-4 mb-2 sm:hidden"></div>
        
        {/* Header */}
        <div className="px-8 py-4 flex items-center justify-between border-b border-slate-50 shrink-0">
          <div>
            <h3 className="text-xl font-black text-slate-900">Filters</h3>
            <p className="text-[10px] font-black uppercase tracking-widest text-primary-600 mt-1">
              {activeFilterCount} active filters
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:text-slate-600 transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto custom-scrollbar space-y-10 pb-32">
          {/* Categories */}
          <section>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 ml-1">Categories</h4>
            <div className="grid grid-cols-2 gap-3">
              {['Books', 'Notes', 'Electronics', 'Hostel', 'Other'].map(cat => {
                const isSelected = selectedCategories.includes(cat);
                return (
                  <button
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    className={`flex items-center justify-between px-5 py-4 rounded-2xl font-bold text-sm transition-all border-2 ${
                      isSelected 
                        ? 'bg-primary-50 border-primary-500 text-primary-700' 
                        : 'bg-white border-slate-100 text-slate-500 hover:border-slate-200'
                    }`}
                  >
                    <span>{cat}</span>
                    {isSelected && <Check size={16} />}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Type */}
          <section>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 ml-1">Listing Type</h4>
            <div className="flex flex-col gap-3">
              {['Sell', 'Rent', 'Donate'].map(type => {
                const isSelected = selectedTypes.includes(type);
                return (
                  <button
                    key={type}
                    onClick={() => toggleType(type)}
                    className={`flex items-center justify-between px-6 py-4 rounded-2xl font-bold text-sm transition-all border-2 ${
                      isSelected 
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-700' 
                        : 'bg-white border-slate-100 text-slate-500'
                    }`}
                  >
                    <span>{type === 'Donate' ? 'Free / Donate' : `For ${type}`}</span>
                    {isSelected && <Check size={18} />}
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        {/* Footer Actions */}
        <div className="absolute bottom-0 left-0 w-full p-6 bg-white border-t border-slate-100 flex gap-4 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
           <button 
            onClick={() => { toggleCategory('All'); onClose(); }}
            className="flex-1 py-4 text-slate-500 font-bold text-sm hover:bg-slate-50 rounded-2xl transition-all"
          >
            Clear All
          </button>
          <button 
            onClick={onClose}
            className="flex-[2] btn-primary py-4 shadow-xl shadow-primary-500/20"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}
