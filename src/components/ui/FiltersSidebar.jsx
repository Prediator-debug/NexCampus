import React from 'react';

export default function FiltersSidebar({
  selectedCategories,
  toggleCategory,
  selectedTypes,
  toggleType
}) {
  return (
    <div className="w-full md:w-72 glass-card p-8 h-fit shrink-0 shadow-xl shadow-slate-200/50">
      <div className="flex items-center justify-between mb-8">
        <h3 className="font-bold text-xl">Filters</h3>
        <button 
          onClick={() => {toggleCategory('All'); toggleType('All');}}
          className="text-xs font-bold text-primary-600 hover:text-primary-700 transition-colors uppercase tracking-widest"
        >
          Reset
        </button>
      </div>
      
      <div className="space-y-10">
        <div>
          <h4 className="text-xs font-black uppercase tracking-widest text-dark-textMuted mb-4">Category</h4>
          <div className="space-y-3">
            {['All', 'Books', 'Notes', 'Electronics', 'Others'].map(cat => (
              <label key={cat} className="flex items-center group cursor-pointer">
                <div className="relative flex items-center">
                  <input 
                    type="checkbox" 
                    checked={cat === 'All' ? selectedCategories.length === 0 : selectedCategories.includes(cat)}
                    onChange={() => toggleCategory(cat)}
                    className="peer appearance-none w-5 h-5 rounded-md border border-slate-300 bg-slate-50 checked:bg-primary-600 checked:border-primary-600 transition-all cursor-pointer" 
                  />
                  <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none left-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <span className="ml-3 text-sm font-medium text-slate-500 group-hover:text-slate-900 transition-colors">{cat}</span>
              </label>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="text-xs font-black uppercase tracking-widest text-dark-textMuted mb-4">Listing Type</h4>
          <div className="space-y-3">
            {['Sell', 'Rent', 'Donate'].map(type => (
              <label key={type} className="flex items-center group cursor-pointer">
                <div className="relative flex items-center">
                  <input 
                    type="checkbox" 
                    checked={selectedTypes.includes(type)}
                    onChange={() => toggleType(type)}
                    className="peer appearance-none w-5 h-5 rounded-md border border-slate-300 bg-slate-50 checked:bg-primary-600 checked:border-primary-600 transition-all cursor-pointer" 
                  />
                  <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none left-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <span className="ml-3 text-sm font-medium text-slate-500 group-hover:text-slate-900 transition-colors">{type}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
