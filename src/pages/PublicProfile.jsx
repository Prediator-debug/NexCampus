import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  User, MapPin, CheckCircle, Package, 
  Star, MessageCircle, ArrowLeft, BookOpen, 
  ShoppingBag, Clock, ShieldCheck, MapPin as MapPinIcon
} from 'lucide-react';
import { useStore } from '../store/useStore';
import AddReviewModal from '../components/ui/AddReviewModal';

export default function PublicProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { users, listings, currentUser, setActiveChat, toggleWishlist } = useStore();
  const [activeTab, setActiveTab] = useState('listings');
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const user = users.find(u => u.id === id);
  const userListings = listings.filter(l => l.sellerId === id);
  const soldCount = userListings.filter(l => l.status === 'sold').length;
  const activeListings = userListings.filter(l => l.status !== 'sold');
  
  const reviews = user?.reviews || [];
  const avgRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-6">
          <User size={40} />
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">User Not Found</h2>
        <p className="text-slate-500 mb-8 max-w-sm">The profile you're looking for doesn't exist or has been removed.</p>
        <Link to="/marketplace" className="btn-primary px-8 py-3">
          Back to Marketplace
        </Link>
      </div>
    );
  }

  const joinDate = user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) : 'Recently';

  const handleChat = () => {
    if (!currentUser) {
        navigate('/login');
        return;
    }
    setActiveChat({
      sellerId: user.id,
      listingId: '',
      listingTitle: 'General Inquiry',
    });
    navigate('/messages');
  };

  return (
    <div className="animate-fade-in pb-20">
      {/* Cover Header */}
      <div className="h-48 sm:h-64 bg-gradient-to-r from-primary-600 via-indigo-600 to-purple-600 relative">
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 p-2.5 bg-white/20 backdrop-blur-md text-white rounded-xl hover:bg-white/30 transition-all border border-white/20"
        >
          <ArrowLeft size={20} />
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        <div className="relative -mt-24 mb-10">
          <div className="flex flex-col md:flex-row md:items-end gap-6 md:gap-8">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-32 h-32 sm:w-44 sm:h-44 rounded-[2.5rem] bg-white p-2 shadow-2xl">
                <div className="w-full h-full rounded-[2rem] bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-4xl sm:text-6xl overflow-hidden">
                   {user.avatar ? (
                     <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                   ) : (
                     user.name.charAt(0)
                   )}
                </div>
              </div>
              {user.status === 'verified' && (
                <div className="absolute -bottom-2 -right-2 bg-green-500 text-white p-2 rounded-2xl border-4 border-white shadow-lg">
                  <ShieldCheck size={20} />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 mb-2">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-3xl sm:text-4xl font-black text-slate-900">{user.name}</h1>
                {user.role === 'admin' && (
                  <span className="px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-[10px] font-black uppercase tracking-widest border border-primary-200">
                    Admin
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-slate-500 font-medium">
                <div className="flex items-center gap-1.5">
                  <MapPinIcon size={16} className="text-primary-500" />
                  {user.college || 'NexCampus Member'}
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock size={16} className="text-primary-500" />
                  Joined {joinDate}
                </div>
                {user.status === 'verified' && (
                  <div className="flex items-center gap-1.5 text-green-600 font-bold">
                    <CheckCircle size={16} />
                    Verified Student
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 shrink-0">
              {currentUser?.id !== user.id && (
                <>
                  <button 
                    onClick={() => setIsReviewModalOpen(true)}
                    className="bg-white border-2 border-slate-100 text-slate-900 px-6 py-3.5 rounded-2xl font-bold hover:bg-slate-50 hover:border-slate-200 transition-all shadow-lg shadow-slate-200/50 flex items-center gap-2"
                  >
                    <Star size={20} className="text-amber-500" />
                    Rate Seller
                  </button>
                  <button 
                    onClick={handleChat}
                    className="btn-primary px-8 py-3.5 flex items-center gap-2 shadow-xl shadow-primary-500/20"
                  >
                    <MessageCircle size={20} />
                    Message
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { label: 'Active Listings', value: activeListings.length, icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Items Sold', value: soldCount, icon: Package, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'Avg Rating', value: avgRating, icon: Star, color: 'text-amber-500', bg: 'bg-amber-50' },
            { label: 'Trust Level', value: user.status === 'verified' ? 'High' : 'Normal', icon: ShieldCheck, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          ].map((stat, i) => (
            <div key={i} className="glass-card p-6 flex flex-col items-center justify-center text-center hover:scale-[1.02] transition-transform">
              <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-3 shadow-sm`}>
                <stat.icon size={24} />
              </div>
              <p className="text-2xl font-black text-slate-900">{stat.value}</p>
              <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs Content */}
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-8 border-b border-slate-100">
            <button 
              onClick={() => setActiveTab('listings')}
              className={`pb-4 text-sm font-black uppercase tracking-widest transition-all relative ${
                activeTab === 'listings' ? 'text-primary-600' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Active Listings
              {activeTab === 'listings' && <div className="absolute bottom-0 left-0 w-full h-1 bg-primary-600 rounded-full"></div>}
            </button>
            <button 
              onClick={() => setActiveTab('about')}
              className={`pb-4 text-sm font-black uppercase tracking-widest transition-all relative ${
                activeTab === 'about' ? 'text-primary-600' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              About & Reviews ({reviews.length})
              {activeTab === 'about' && <div className="absolute bottom-0 left-0 w-full h-1 bg-primary-600 rounded-full"></div>}
            </button>
          </div>

          {activeTab === 'listings' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeListings.length > 0 ? (
                activeListings.map(listing => (
                  <Link
                    key={listing.id}
                    to={`/listing/${listing.id}`}
                    className="bg-white rounded-[2rem] overflow-hidden group flex flex-col hover:-translate-y-2 transition-all duration-500 border border-slate-100 shadow-xl shadow-slate-200/40"
                  >
                    <div className="h-48 bg-slate-50 relative flex items-center justify-center overflow-hidden">
                      {listing.image ? (
                        <img src={listing.image} alt={listing.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      ) : (
                        <div className="flex flex-col items-center text-slate-300">
                          <Package size={40} />
                        </div>
                      )}
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-black text-slate-900 border border-slate-100 shadow-sm">
                        ₹{listing.price}
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="font-bold text-slate-900 truncate mb-1 text-lg leading-tight group-hover:text-primary-600 transition-colors">{listing.title}</h3>
                      <p className="text-[10px] text-primary-600 font-black uppercase tracking-widest">{listing.category}</p>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="col-span-full py-24 text-center glass-card border-dashed bg-slate-50/50">
                   <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center text-slate-200 mx-auto mb-6 border border-slate-100">
                    <Package size={32} />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-2">No active items</h3>
                  <p className="text-slate-400 font-medium max-w-xs mx-auto">This user doesn't have any items for sale at the moment.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 glass-card p-8 h-fit">
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-widest mb-8 flex items-center gap-3">
                  <div className="p-2 bg-primary-50 rounded-xl">
                    <User size={20} className="text-primary-600" />
                  </div>
                  Education
                </h3>
                <div className="space-y-8">
                  <div>
                    <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1.5">College</p>
                    <p className="text-slate-900 font-bold text-lg">{user.college || 'NexCampus Member'}</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
                    <div>
                      <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1.5">Branch</p>
                      <p className="text-slate-900 font-bold">{user.branch || '—'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1.5">Graduation Year</p>
                      <p className="text-slate-900 font-bold">{user.graduationYear || '—'}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2 glass-card p-8">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-lg font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
                    <div className="p-2 bg-amber-50 rounded-xl">
                      <Star size={20} className="text-amber-500" />
                    </div>
                    Recent Reviews
                  </h3>
                  {reviews.length > 0 && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100 font-black text-lg text-slate-900">
                      {avgRating} <Star size={16} className="fill-amber-400 text-amber-400" />
                    </div>
                  )}
                </div>

                {reviews.length > 0 ? (
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review.id} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 relative group">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-400 text-sm">
                              {review.reviewerName?.charAt(0) || 'U'}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 text-sm">{review.reviewerName}</p>
                              <p className="text-[10px] text-slate-400 font-bold">{new Date(review.date).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="flex text-amber-400">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={14} className={i < review.rating ? 'fill-amber-400' : 'text-slate-200'} />
                            ))}
                          </div>
                        </div>
                        <p className="text-slate-600 font-medium leading-relaxed">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-100">
                    <MessageSquare size={48} className="mx-auto text-slate-200 mb-6" />
                    <h4 className="text-lg font-black text-slate-900 mb-2">No reviews yet</h4>
                    <p className="text-slate-400 font-medium max-w-xs mx-auto">Be the first to share your experience with this seller!</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <AddReviewModal 
        isOpen={isReviewModalOpen} 
        onClose={() => setIsReviewModalOpen(false)} 
        sellerId={user.id} 
        sellerName={user.name} 
      />
    </div>
  );
}
