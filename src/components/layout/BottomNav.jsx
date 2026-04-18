import { Link, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, MessageSquare, User, Heart, PlusCircle } from 'lucide-react';
import { useStore } from '../../store/useStore';

export default function BottomNav() {
  const location = useLocation();
  const { currentUser } = useStore();
  const wishlistCount = currentUser?.wishlist?.length || 0;

  const isActive = (path) => location.pathname === path;

  if (!currentUser) return null;

  return (
    <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[95%] max-w-[400px]">
      <div className="bg-white/90 backdrop-blur-2xl border border-white/50 shadow-[0_20px_50px_rgba(0,0,0,0.2)] rounded-[2.5rem] p-1.5 flex items-center justify-around">
        
        <Link 
          to="/" 
          className={`flex flex-col items-center justify-center w-12 h-12 rounded-[1.25rem] transition-all duration-300 ${
            isActive('/') ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Home size={20} />
        </Link>
 
        <Link 
          to="/marketplace" 
          className={`flex flex-col items-center justify-center w-12 h-12 rounded-[1.25rem] transition-all duration-300 ${
            isActive('/marketplace') ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <ShoppingBag size={20} />
        </Link>
 
        <div className="relative -mt-8 px-1">
            <button 
              onClick={() => useStore.getState().setIsAddListingModalOpen(true)}
              className="flex items-center justify-center w-14 h-14 rounded-full bg-slate-900 text-white shadow-2xl border-4 border-white transition-transform active:scale-90"
            >
              <PlusCircle size={24} />
            </button>
        </div>
 
        <Link 
          to="/messages" 
          className={`flex flex-col items-center justify-center w-12 h-12 rounded-[1.25rem] transition-all duration-300 ${
            isActive('/messages') ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <MessageSquare size={20} />
        </Link>
 
        <Link 
          to="/profile" 
          className={`flex flex-col items-center justify-center w-12 h-12 rounded-[1.25rem] transition-all duration-300 ${
            isActive('/profile') ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <User size={20} />
        </Link>
 
      </div>
    </div>
  );
}
