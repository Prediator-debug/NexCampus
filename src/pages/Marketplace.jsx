import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Image as ImageIcon, ArrowRight, SlidersHorizontal, X, Heart, MessageCircle } from 'lucide-react';
import { useStore } from '../store/useStore';
import AddListingModal from '../components/ui/AddListingModal';
import FiltersSidebar from '../components/ui/FiltersSidebar';
import MobileFilters from '../components/ui/MobileFilters';

export default function Marketplace() {
  const { listings, currentUser, setActiveChat, toggleWishlist } = useStore();
  const location = useLocation();
  const setIsAddListingModalOpen = useStore(state => state.setIsAddListingModalOpen);
  const [showFilters, setShowFilters] = useState(false);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState(location.state?.initialCategories || []);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [sortBy, setSortBy] = useState('newest');

  // Sync with location state
  const [prevLocationKey, setPrevLocationKey] = useState(location.key);
  if (location.key !== prevLocationKey) {
    setPrevLocationKey(location.key);
    if (location.state?.initialCategories) {
      setSelectedCategories(location.state.initialCategories);
    }
  }

  const toggleCategory = (cat) => {
    if (cat === 'All') { setSelectedCategories([]); return; }
    setSelectedCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
  };

  const toggleType = (type) => {
    setSelectedTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
  };

  const filteredListings = listings
    .filter(listing => {
      const query = searchQuery.toLowerCase();
      const matchesSearch = !searchQuery || 
        listing.title.toLowerCase().includes(query) || 
        listing.description.toLowerCase().includes(query) ||
        listing.category.toLowerCase().includes(query);
      
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(listing.category);
      const matchesType = selectedTypes.length === 0 || selectedTypes.includes(listing.type);
      
      return matchesSearch && matchesCategory && matchesType;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      return new Date(b.createdAt || b.id) - new Date(a.createdAt || a.id);
    });

  const activeFilterCount = selectedCategories.length + selectedTypes.length;

  return (
    <div className="animate-fade-in pb-20">
      {/* Premium Hero Section */}
      <div className="relative overflow-hidden bg-white pt-16 pb-12 sm:pt-24 sm:pb-20 border-b border-slate-100">
        {/* Animated Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary-100/40 blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[40%] rounded-full bg-indigo-100/30 blur-[100px]"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-6xl font-black text-slate-900 mb-6 tracking-tight">
              Campus <span className="text-primary-600">Marketplace</span>
            </h1>
            <p className="text-slate-500 text-base sm:text-xl font-medium mb-10 max-w-2xl mx-auto leading-relaxed">
              The smartest way to buy, sell, and rent essentials within your college community.
            </p>

            {/* Search Bar Container */}
            <div className="relative max-w-2xl mx-auto group">
              <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </div>
              <input
                type="text"
                placeholder="What are you looking for today?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border-2 border-slate-100 rounded-3xl py-5 pl-14 pr-32 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/5 transition-all shadow-xl shadow-slate-200/50 text-lg font-medium"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 z-20">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowFilters(true);
                  }}
                  className="p-3.5 rounded-2xl bg-slate-50 text-slate-600 hover:bg-slate-100 hover:scale-110 active:scale-95 transition-all border border-slate-200 shadow-sm"
                  title="Filter Results"
                >
                  <SlidersHorizontal size={20} />
                </button>
                {currentUser && (
                  <button 
                    onClick={() => setIsAddListingModalOpen(true)}
                    className="flex items-center gap-2 bg-primary-600 text-white px-5 py-3 rounded-2xl font-bold hover:bg-primary-700 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary-500/20"
                  >
                    Post Listing
                  </button>
                )}
              </div>
            </div>

            {/* Category Chips Bar */}
            <div className="flex items-center justify-center flex-wrap gap-2 mt-10">
              {['All', 'Books', 'Notes', 'Electronics', 'Hostel', 'Other'].map(cat => (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all border ${
                    (cat === 'All' && selectedCategories.length === 0) || selectedCategories.includes(cat)
                      ? 'bg-primary-600 text-white border-primary-600 shadow-lg shadow-primary-500/30'
                      : 'bg-white text-slate-500 border-slate-200 hover:border-primary-500 hover:text-primary-500'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-12 flex gap-8">
        {/* Desktop Filters Sidebar */}
        <div className="hidden lg:block lg:sticky lg:top-28 h-fit">
          <FiltersSidebar
            selectedCategories={selectedCategories}
            toggleCategory={toggleCategory}
            selectedTypes={selectedTypes}
            toggleType={toggleType}
          />
        </div>

        {/* Product Grid Container */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest">
              {filteredListings.length} Items Found
            </h2>
            <div className="flex items-center gap-3 w-full sm:w-auto">
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 whitespace-nowrap">Sort By</span>
               <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border-2 border-slate-100 rounded-xl px-4 py-2 text-sm font-bold text-slate-900 focus:outline-none focus:border-primary-500/50 shadow-sm transition-all flex-1 sm:flex-none min-w-[140px]"
               >
                 <option value="newest">Newest First</option>
                 <option value="price-low">Price: Low to High</option>
                 <option value="price-high">Price: High to Low</option>
               </select>
            </div>
          </div>

          {filteredListings.length === 0 ? (
            <div className="glass-card py-24 flex flex-col items-center justify-center text-center bg-slate-50/50 border-dashed">
              <div className="w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center text-slate-300 mb-8 border border-slate-100">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-3">Zero matches found</h3>
              <p className="text-slate-500 max-w-md font-medium px-4">We couldn't find anything matching your search. Try different keywords or browse categories.</p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategories([]); setSelectedTypes([]); }}
                className="mt-10 btn-primary px-8 py-3.5"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {filteredListings.map(listing => (
                <Link
                  key={listing.id}
                  to={`/listing/${listing.id}`}
                  className="bg-white rounded-[2rem] overflow-hidden group flex flex-col hover:-translate-y-2 transition-all duration-500 border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-primary-500/10 cursor-pointer"
                >
                  <div className="h-52 sm:h-64 bg-slate-50 relative flex items-center justify-center overflow-hidden">
                    {listing.image ? (
                      <img src={listing.image} alt={listing.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    ) : (
                      <div className="flex flex-col items-center text-slate-500 opacity-20">
                        <ImageIcon size={40} />
                        <span className="text-xs font-bold mt-2 uppercase tracking-widest">No Preview</span>
                      </div>
                    )}
                    
                    {/* Dynamic Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                       <div className={`backdrop-blur-md text-[10px] px-3 py-1.5 rounded-xl text-white font-black tracking-widest uppercase border ${
                        listing.type === 'Sell' ? 'bg-indigo-600/60 border-indigo-400/40' :
                        listing.type === 'Rent' ? 'bg-orange-600/60 border-orange-400/40' :
                        'bg-emerald-600/60 border-emerald-400/40'
                      }`}>
                        {listing.type}
                      </div>
                      
                      {/* New Arrival Badge (Last 48 Hours) */}
                      {(new Date() - new Date(listing.createdAt || listing.id)) < (48 * 60 * 60 * 1000) && (
                        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-[9px] px-2.5 py-1.5 rounded-xl font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 border border-emerald-400/30">
                          New Arrival
                        </div>
                      )}

                      {listing.price < 500 && listing.type === 'Sell' && (
                        <div className="bg-amber-400 text-slate-900 text-[10px] px-3 py-1.5 rounded-xl font-black uppercase tracking-widest shadow-lg shadow-amber-500/20">
                          Great Deal
                        </div>
                      )}
                    </div>

                    {listing.status === 'sold' && (
                      <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center z-10">
                        <div className="bg-slate-900 text-white px-6 py-2 rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl rotate-[-5deg] border-2 border-white">
                          Sold Out
                        </div>
                      </div>
                    )}

                    {currentUser && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleWishlist(listing.id);
                        }}
                        className={`absolute top-4 right-4 p-2.5 rounded-2xl backdrop-blur-md border transition-all duration-300 ${
                          currentUser.wishlist?.includes(listing.id)
                            ? 'bg-red-500 border-red-400 text-white shadow-lg shadow-red-500/30'
                            : 'bg-white/90 border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 shadow-sm'
                        }`}
                      >
                        <Heart size={18} fill={currentUser.wishlist?.includes(listing.id) ? 'currentColor' : 'none'} />
                      </button>
                    )}
                  </div>

                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-1.5">
                        <div className="flex text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
                          ))}
                        </div>
                        <span className="text-[10px] font-bold text-slate-400">4.9</span>
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-primary-600/60">
                        {listing.category}
                      </span>
                    </div>

                    <h3 className="font-bold text-xl mb-2 text-slate-900 group-hover:text-primary-600 transition-colors line-clamp-1 leading-tight">{listing.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed mb-6 line-clamp-2 flex-1">{listing.description}</p>

                    <div className="flex justify-between items-end pt-4 border-t border-slate-50">
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-0.5">Price</span>
                        <span className="font-black text-2xl text-slate-900">
                          {listing.price > 0 ? `₹${listing.price}` : 'Free'}
                        </span>
                      </div>

                      {currentUser && currentUser.id === listing.sellerId ? (
                        <div className="px-4 py-2 rounded-xl bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest border border-slate-100">
                          Owner
                        </div>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentUser) {
                              setActiveChat({
                                sellerId: listing.sellerId,
                                listingId: listing.id,
                                listingTitle: listing.title
                              });
                            } else {
                              navigate('/login');
                            }
                          }}
                          className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-3 rounded-2xl transition-all duration-300 shadow-lg shadow-primary-500/20 font-bold text-sm flex items-center gap-2"
                        >
                          Chat <MessageCircle size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      
      <MobileFilters 
        isOpen={showFilters} 
        onClose={() => setShowFilters(false)} 
        selectedCategories={selectedCategories}
        toggleCategory={toggleCategory}
        selectedTypes={selectedTypes}
        toggleType={toggleType}
        activeFilterCount={activeFilterCount}
      />
    </div>
  );
}
