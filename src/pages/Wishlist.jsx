import { useStore } from '../store/useStore';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ArrowLeft, ShoppingBag, ChevronRight, Tag } from 'lucide-react';

export default function Wishlist() {
  const { listings, currentUser, toggleWishlist } = useStore();
  const navigate = useNavigate();
  
  const wishlistIds = currentUser?.wishlist || [];
  const wishlistedItems = listings.filter(l => wishlistIds.includes(l.id));

  return (
    <div className="animate-fade-in max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-black text-slate-900 mb-2">My Wishlist</h1>
          <p className="text-slate-500 font-medium">Items you've saved to buy later</p>
        </div>
        <Link to="/marketplace" className="btn-secondary flex items-center gap-2">
          <ArrowLeft size={18} /> Back to Market
        </Link>
      </div>

      {wishlistedItems.length === 0 ? (
        <div className="py-24 text-center glass-card border-dashed">
          <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-200 mx-auto mb-6">
            <Heart size={40} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Your wishlist is empty</h2>
          <p className="text-slate-500 mb-8 max-w-xs mx-auto">
            Save items you're interested in by clicking the heart icon on any listing.
          </p>
          <Link to="/marketplace" className="btn-primary inline-flex items-center gap-2 px-8">
            <ShoppingBag size={18} /> Browse Marketplace
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistedItems.map(item => (
            <div 
              key={item.id} 
              className="glass-card group hover:-translate-y-2 transition-all duration-500 overflow-hidden shadow-xl shadow-slate-200/40 relative"
            >
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  toggleWishlist(item.id);
                }}
                className="absolute top-3 right-3 z-10 p-2 bg-white/90 backdrop-blur-md rounded-xl text-red-500 shadow-sm border border-slate-100 hover:scale-110 active:scale-95 transition-all"
              >
                <Heart size={18} fill="currentColor" />
              </button>

              <div 
                className="cursor-pointer"
                onClick={() => navigate(`/listing/${item.id}`)}
              >
                <div className="h-48 bg-slate-50 relative overflow-hidden">
                  {item.image ? (
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-200">
                      <ShoppingBag size={48} />
                    </div>
                  )}
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-900 border border-slate-200 shadow-sm">
                    {item.type}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary-600 mb-2">
                    <Tag size={12} />
                    {item.category}
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 mb-4 truncate group-hover:text-primary-600 transition-colors">{item.title}</h3>
                  <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                    <span className="font-black text-xl text-slate-900">₹{item.price}</span>
                    <div className="flex items-center gap-2 text-primary-600 font-bold text-sm">
                      View <ChevronRight size={16} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
