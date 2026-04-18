import { useState } from 'react';
import { User, Settings, ShoppingBag, CheckCircle, Star, MapPin, Book, Award, Clock, Mail } from 'lucide-react';
import { useStore } from '../store/useStore';
import EditProfileModal from '../components/ui/EditProfileModal';

export default function Profile() {
  const currentUser = useStore(state => state.currentUser);
  const listings = useStore(state => state.listings);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // Use current user if logged in, otherwise use placeholder
  const name = currentUser?.name || 'Rahul Sharma';
  const email = currentUser?.email || 'rahul.s@example.com';
  const isVerified = currentUser?.status === 'verified' || currentUser?.role === 'admin' || !currentUser;
  
  // Extract initials (e.g. "Rahul Sharma" -> "RS")
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);

  // Filter user's listings
  const userListings = listings.filter(l => l.sellerId === currentUser?.id);

  return (
    <div className="animate-fade-in max-w-6xl mx-auto px-4 py-8">
      {/* Profile Header Card */}
      <div className="glass-card overflow-hidden mb-10 relative">
        <div className="h-32 bg-gradient-to-r from-indigo-600/30 via-primary-600/30 to-purple-600/30 blur-2xl absolute inset-0 -z-10 opacity-50"></div>
        
        <div className="p-8 md:p-12 flex flex-col md:flex-row items-center md:items-start gap-10">
          <div className="relative group">
            <div className="w-40 h-40 rounded-3xl bg-gradient-to-br from-indigo-600 via-primary-600 to-purple-700 flex items-center justify-center text-white text-5xl font-black shadow-2xl group-hover:scale-105 transition-transform duration-500 overflow-hidden">
              {currentUser?.profilePicture ? (
                <img src={currentUser.profilePicture} alt={name} className="w-full h-full object-cover" />
              ) : (
                initials
              )}
            </div>
            {isVerified && (
              <div className="absolute -bottom-2 -right-2 bg-green-500 text-white p-2 rounded-xl shadow-lg border-4 border-white z-10">
                <CheckCircle size={24} />
              </div>
            )}
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start">
              <div>
                <h1 className="text-4xl font-black mb-2 tracking-tight">{name}</h1>
                <p className="text-dark-textMuted flex items-center justify-center md:justify-start gap-2 text-lg font-medium mb-6">
                  <Mail size={18} className="text-primary-400" />
                  <span>{email}</span>
                </p>
                
                {currentUser?.college && (
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                    <div className="flex items-center space-x-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700">
                      <Book size={16} className="text-indigo-600" />
                      <span>{currentUser.college}</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700">
                      <Award size={16} className="text-primary-600" />
                      <span>{currentUser.branch}</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700">
                      <Clock size={16} className="text-purple-600" />
                      <span>Class of {currentUser.graduationYear}</span>
                    </div>
                  </div>
                )}
              </div>
              
              <button 
                onClick={() => setIsEditModalOpen(true)}
                className="btn-secondary mt-8 md:mt-0 px-6 py-3 flex items-center space-x-2 shadow-xl hover:bg-white/10"
              >
                <Settings size={20} />
                <span>Edit Profile</span>
              </button>
            </div>
            
            <div className="grid grid-cols-3 gap-8 mt-10 pt-10 border-t border-slate-100">
              <div className="flex flex-col">
                <span className="text-3xl font-black text-slate-900">{userListings.length}</span>
                <span className="text-xs font-black uppercase tracking-widest text-slate-400 mt-1">Total Listings</span>
              </div>
              <div className="flex flex-col border-x border-slate-100 px-8">
                <span className="text-3xl font-black text-slate-900">5</span>
                <span className="text-xs font-black uppercase tracking-widest text-slate-400 mt-1">Items Sold</span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-black text-yellow-600 flex items-center gap-2">
                  4.8 <Star size={24} fill="currentColor" />
                </span>
                <span className="text-xs font-black uppercase tracking-widest text-slate-400 mt-1">Trust Score</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <ShoppingBag size={28} className="text-primary-400" />
              <h2 className="text-2xl font-black tracking-tight">Active Listings</h2>
            </div>
            <span className="text-xs font-black uppercase tracking-widest text-dark-textMuted">Managing {userListings.length} items</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {userListings.length === 0 ? (
              <div className="col-span-full py-16 text-center glass-card border-dashed">
                <p className="text-dark-textMuted font-medium italic">You haven't posted any items yet.</p>
              </div>
            ) : (
              userListings.map(listing => (
                <div key={listing.id} className="glass-card overflow-hidden group hover:scale-[1.02] transition-all duration-300 shadow-xl shadow-slate-200/50">
                  <div className="h-44 bg-slate-50 relative overflow-hidden">
                    {listing.image ? (
                      <img src={listing.image} alt={listing.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center opacity-10 text-slate-900">
                        <ShoppingBag size={48} />
                      </div>
                    )}
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-200 text-slate-900 shadow-sm">
                      {listing.type}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-xl mb-4 group-hover:text-primary-600 transition-colors text-slate-900">{listing.title}</h3>
                    <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                      <span className="font-black text-xl tracking-tight text-slate-900">₹{listing.price}</span>
                      <div className="flex gap-2">
                        <button className="p-2.5 rounded-xl bg-slate-50 hover:bg-primary-600 border border-slate-200 transition-all text-slate-400 hover:text-white hover:border-primary-600">
                          <Settings size={18} />
                        </button>
                        <button className="p-2.5 rounded-xl bg-red-50 hover:bg-red-600 border border-red-100 transition-all text-red-600 hover:text-white hover:border-red-600">
                          <Clock size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
          <div className="glass-card p-8">
            <h3 className="text-lg font-black tracking-tight mb-6 uppercase tracking-widest text-xs text-primary-400">Account Security</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-sm font-medium">
                <CheckCircle size={18} className="text-green-500" />
                <span>Identity Verified</span>
              </div>
              <div className="flex items-center space-x-3 text-sm font-medium">
                <CheckCircle size={18} className="text-green-500" />
                <span>Email Confirmed</span>
              </div>
              <div className="flex items-center space-x-3 text-sm font-medium opacity-50">
                <div className="w-[18px] h-[18px] rounded-full border-2 border-white/20"></div>
                <span>Two-Factor Auth</span>
              </div>
            </div>
            <button className="w-full mt-8 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-black uppercase tracking-widest transition-all">
              Manage Security
            </button>
          </div>
          
          <div className="glass-card p-8 bg-gradient-to-br from-primary-600/10 to-transparent">
            <h3 className="text-lg font-black tracking-tight mb-4">Quick Stats</h3>
            <p className="text-xs text-dark-textMuted leading-relaxed mb-6 font-medium">
              You've saved roughly <span className="text-primary-400 font-bold">₹2,400</span> by trading within campus this month!
            </p>
            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
              <div className="w-2/3 h-full bg-gradient-to-r from-indigo-500 to-primary-500"></div>
            </div>
          </div>
        </div>
      </div>

      <EditProfileModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} />
    </div>
  );
}
