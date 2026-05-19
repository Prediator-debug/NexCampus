import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, MessageCircle, Tag, Calendar, User,
  BookOpen, Laptop, ShoppingCart, Package, Share2,
  CheckCircle, AlertCircle, Heart, ChevronRight, CreditCard, ExternalLink, Star
} from 'lucide-react';
import { useStore } from '../store/useStore';
import AddReviewModal from '../components/ui/AddReviewModal';

const typeStyles = {
  Sell:   { bg: 'bg-blue-50 border-blue-100 text-blue-700',   label: 'For Sale'      },
  Rent:   { bg: 'bg-orange-50 border-orange-100 text-orange-700', label: 'For Rent'  },
  Donate: { bg: 'bg-green-50 border-green-100 text-green-700', label: 'Free / Donate' },
};

function CategoryIcon({ category, size = 32 }) {
  if (category === 'Books' || category === 'Notes') return <BookOpen size={size} />;
  if (category === 'Electronics') return <Laptop size={size} />;
  if (category === 'Hostel') return <ShoppingCart size={size} />;
  return <ShoppingCart size={size} />;
}

export default function ListingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { listings, currentUser, users, setActiveChat, toggleWishlist, markAsSold, deleteListing } = useStore();
  const [shareMsg, setShareMsg] = useState('');
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const listing = listings.find(l => l.id === id);

  if (!listing) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center animate-fade-in px-4">
        <Package size={64} className="text-slate-200 mb-6" />
        <h2 className="text-2xl font-bold mb-3 text-slate-900">Listing Not Found</h2>
        <p className="text-slate-500 mb-8">This listing may have been removed or is no longer available.</p>
        <Link to="/marketplace" className="btn-primary px-8 py-3 flex items-center gap-2">
          <ArrowLeft size={18} /> Back to Marketplace
        </Link>
      </div>
    );
  }

  const seller = users.find(u => u.id === listing.sellerId);
  const isOwnListing = currentUser?.id === listing.sellerId;
  const typeStyle = typeStyles[listing.type] || typeStyles.Sell;
  const postedDate = listing.createdAt ? new Date(listing.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '—';

  const handleChat = () => {
    setActiveChat({
      sellerId: listing.sellerId,
      listingId: listing.id,
      listingTitle: listing.title,
    });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setShareMsg('Link copied!');
      setTimeout(() => setShareMsg(''), 2000);
    }).catch(() => setShareMsg('Could not copy'));
  };

  return (
    <div className="max-w-5xl mx-auto animate-fade-in px-4 sm:px-0 pb-12">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-slate-500 text-sm mb-6 flex-wrap">
        <Link to="/marketplace" className="hover:text-primary-600 transition-colors flex items-center gap-1.5">
          <ArrowLeft size={16} /> Marketplace
        </Link>
        <ChevronRight size={14} />
        <span className="text-slate-900 font-medium truncate">{listing.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-10">

        {/* LEFT — Image & Info */}
        <div className="lg:col-span-3 flex flex-col gap-5">

          {/* Image */}
          <div className="glass-card overflow-hidden rounded-2xl aspect-video flex items-center justify-center relative bg-slate-50">
            {listing.image ? (
              <img src={listing.image} alt={listing.title} className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-3 text-dark-textMuted opacity-25">
                <CategoryIcon category={listing.category} size={64} />
                <span className="text-sm font-bold uppercase tracking-widest">No Preview</span>
              </div>
            )}
            <div className={`absolute top-4 left-4 text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border backdrop-blur-md ${typeStyle.bg}`}>
              {typeStyle.label}
            </div>
            {listing.status === 'sold' && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center z-10">
                <div className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black text-2xl uppercase tracking-widest shadow-2xl rotate-[-5deg] border-4 border-white">
                  Sold Out
                </div>
              </div>
            )}
            
            {currentUser && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  toggleWishlist(listing.id);
                }}
                className={`absolute top-4 right-4 p-3 rounded-2xl backdrop-blur-md border transition-all duration-300 z-20 ${
                  currentUser.wishlist?.includes(listing.id)
                    ? 'bg-red-500 border-red-400 text-white shadow-lg shadow-red-500/30'
                    : 'bg-white/90 border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 shadow-sm'
                }`}
              >
                <Heart size={24} fill={currentUser.wishlist?.includes(listing.id) ? 'currentColor' : 'none'} />
              </button>
            )}
          </div>

          {/* Title + Description */}
          <div className="glass-card p-6 sm:p-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold mb-4 text-slate-900">{listing.title}</h1>
            <p className="text-xs font-bold uppercase tracking-widest text-primary-600 mb-3">Description</p>
            <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
              {listing.description || 'No description provided by the seller.'}
            </p>
          </div>

          {/* Details Grid */}
          <div className="glass-card p-6 sm:p-8">
            <p className="text-xs font-bold mb-5 text-primary-400 uppercase tracking-widest">Item Details</p>
            <div className="grid grid-cols-2 gap-5">

              <div>
                <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">
                  <Tag size={13} /> Category
                </div>
                <p className="font-semibold text-slate-900">{listing.category || '—'}</p>
              </div>

              <div>
                <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">
                  <Package size={13} /> Listing Type
                </div>
                <p className="font-semibold text-slate-900">{listing.type || '—'}</p>
              </div>

              <div>
                <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">
                  <Calendar size={13} /> Posted On
                </div>
                <p className="font-semibold text-slate-900">{postedDate}</p>
              </div>

              <div>
                <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">
                  <Tag size={13} /> Price
                </div>
                <p className="font-semibold text-slate-900">
                  {listing.price > 0 ? `₹${listing.price}` : 'Free'}
                </p>
              </div>

            </div>
          </div>
        </div>

        {/* RIGHT — Price, Seller, Actions */}
        <div className="lg:col-span-2 flex flex-col gap-5">

          {/* Price */}
          <div className="glass-card p-6 sm:p-8">
            <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
              {listing.type === 'Donate' ? 'Available For' : listing.type === 'Rent' ? 'Rent Price' : 'Selling Price'}
            </p>
            <p className="text-4xl sm:text-5xl font-black text-slate-900 mb-1">
              {listing.price > 0 ? `₹${listing.price}` : 'Free'}
            </p>
            {listing.type === 'Rent' && (
              <p className="text-xs text-slate-400 mt-1">per month / as negotiated</p>
            )}
          </div>

          {/* Seller */}
          <Link to={`/user/${seller?.id}`} className="glass-card p-6 sm:p-8 block hover:border-primary-200 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-bold text-primary-400 uppercase tracking-widest">Seller Info</p>
              <ExternalLink size={14} className="text-slate-300 group-hover:text-primary-500 transition-colors" />
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                {seller?.avatar ? (
                  <img src={seller.avatar} alt={seller.name} className="w-full h-full object-cover rounded-2xl" />
                ) : (
                  seller?.name?.charAt(0) || <User size={20} />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-slate-900 truncate group-hover:text-primary-600 transition-colors">{seller?.name || 'Campus Seller'}</p>
                <div className="flex items-center gap-3">
                  <p className="text-xs text-slate-500 truncate">{seller?.college || 'NexCampus Member'}</p>
                  {seller?.reviews?.length > 0 && (
                    <div className="flex items-center gap-1 px-1.5 py-0.5 bg-amber-50 text-amber-600 rounded-lg text-[10px] font-black border border-amber-100">
                      <Star size={10} className="fill-amber-500 text-amber-500" />
                      {(seller.reviews.reduce((sum, r) => sum + r.rating, 0) / seller.reviews.length).toFixed(1)}
                      <span className="text-slate-400 font-bold ml-0.5">({seller.reviews.length})</span>
                    </div>
                  )}
                </div>
              </div>
              {(seller?.status === 'verified' || seller?.role === 'admin') && (
                <CheckCircle size={18} className="text-green-400 shrink-0" title="Verified User" />
              )}
            </div>
            {seller?.branch && (
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <BookOpen size={14} />
                <span>{seller.branch}{seller.graduationYear ? ` · ${seller.graduationYear}` : ''}</span>
              </div>
            )}
          </Link>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            {isOwnListing ? (
              <div className="space-y-4">
                <div className="glass-card p-5 border-primary-100 bg-primary-50/30">
                  <p className="text-xs font-black uppercase tracking-widest text-primary-600 mb-1">Your Listing</p>
                  <p className="text-sm text-slate-600 font-medium leading-relaxed">You posted this item. Once you've finalized the deal with a buyer, mark it as sold.</p>
                </div>
                {listing.status !== 'sold' && (
                  <button 
                    onClick={() => markAsSold(listing.id)}
                    className="w-full btn-primary py-4 flex items-center justify-center gap-2 shadow-xl shadow-primary-500/20"
                  >
                    <CheckCircle size={20} />
                    Mark as Sold
                  </button>
                )}
                <button 
                  onClick={() => {
                    if(confirm('Are you sure you want to delete this listing?')) {
                      deleteListing(listing.id);
                      navigate('/marketplace');
                    }
                  }}
                  className="w-full py-3.5 rounded-xl border border-red-100 text-red-600 hover:bg-red-50 font-bold transition-all text-sm"
                >
                  Delete Listing
                </button>
              </div>
            ) : currentUser ? (
              <div className="flex flex-col gap-3">
                {listing.status === 'sold' ? (
                  <div className="glass-card p-8 bg-slate-50 border-2 border-slate-100 text-center mb-1">
                    <CheckCircle size={48} className="mx-auto text-slate-300 mb-4" />
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Item Already Sold</h3>
                    <p className="text-slate-500 text-sm font-medium">This item is no longer available. You can still rate the seller below.</p>
                  </div>
                ) : (
                  <button
                    onClick={handleChat}
                    className="btn-primary flex items-center justify-center gap-3 py-4 text-base shadow-xl shadow-primary-500/20"
                  >
                    <MessageCircle size={22} />
                    <span>Message Seller</span>
                  </button>
                )}
                
                <button
                  onClick={() => setIsReviewModalOpen(true)}
                  className="w-full bg-white border-2 border-slate-100 text-slate-900 py-4 rounded-2xl font-bold hover:bg-slate-50 hover:border-slate-200 transition-all shadow-lg shadow-slate-200/50 flex items-center justify-center gap-3"
                >
                  <Star size={20} className="text-amber-500" />
                  <span>Rate Seller</span>
                </button>

                <button
                  onClick={() => toggleWishlist(listing.id)}
                  className={`flex items-center justify-center gap-3 py-4 rounded-2xl border font-semibold text-base transition-all ${
                    currentUser.wishlist?.includes(listing.id)
                      ? 'bg-red-600 text-white border-red-600 shadow-lg shadow-red-200'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-primary-600 hover:text-primary-600 shadow-sm'
                  }`}
                >
                  <Heart size={20} className={currentUser.wishlist?.includes(listing.id) ? 'fill-white' : ''} />
                  <span>{currentUser.wishlist?.includes(listing.id) ? 'Saved to Wishlist' : 'Add to Wishlist'}</span>
                </button>

                {/* Payment Info Card */}
                {listing.status !== 'sold' && (
                  <div className="mt-3 p-6 bg-slate-50 rounded-3xl border border-slate-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100">
                        <CreditCard className="text-primary-600" size={18} />
                      </div>
                      <h3 className="font-bold text-slate-900">Payment Info</h3>
                    </div>
                    <p className="text-xs text-slate-500 mb-4 font-medium leading-relaxed">Pay the seller directly via UPI when you meet on campus for exchange.</p>
                    
                    {seller?.upiId ? (
                      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
                        <div className="min-w-0 flex-1">
                          <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Seller's UPI ID</span>
                          <span className="font-bold text-slate-900 truncate block">{seller.upiId}</span>
                        </div>
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(seller.upiId);
                            setShareMsg('UPI ID Copied!');
                            setTimeout(() => setShareMsg(''), 2000);
                          }}
                          className="p-2 bg-slate-50 text-slate-500 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all ml-3 shrink-0"
                        >
                          <Share2 size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="p-3 bg-slate-100/50 rounded-xl border border-slate-100 text-[10px] text-slate-400 text-center italic font-medium">
                        Seller hasn't added UPI details.
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="glass-card p-6 text-center">
                <AlertCircle size={32} className="mx-auto text-slate-300 mb-3" />
                <p className="text-sm text-slate-500 mb-5 font-medium">Login to contact seller or save this item.</p>
                <Link to="/login" className="btn-primary w-full py-3 block text-center">
                  Login to Continue
                </Link>
              </div>
            )}

            <button
              onClick={handleShare}
              className="flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-500 hover:text-slate-900 hover:border-slate-300 transition-all font-bold shadow-sm"
            >
              <Share2 size={16} />
              <span>{shareMsg || 'Share Listing'}</span>
            </button>
          </div>

          {/* Safety Tip */}
          <div className="rounded-2xl p-5 border border-yellow-500/20 bg-yellow-500/5">
            <div className="flex items-start gap-3">
              <AlertCircle size={18} className="text-yellow-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-yellow-400 uppercase tracking-widest mb-1">Safety Tip</p>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Always meet in a public campus area for exchange. Verify the item before paying. Never send money in advance.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Similar Items */}
      <div className="mt-20 border-t border-slate-100 pt-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-black text-slate-900 mb-2">Similar Items</h2>
            <p className="text-slate-500 font-medium">More products from {listing.category} category</p>
          </div>
          <Link to="/marketplace" className="text-primary-600 font-bold hover:underline flex items-center gap-2">
            View All <ChevronRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {listings
            .filter(l => l.category === listing.category && l.id !== listing.id)
            .slice(0, 4)
            .map(item => (
              <div 
                key={item.id} 
                className="glass-card group cursor-pointer hover:-translate-y-2 transition-all duration-500 overflow-hidden shadow-xl shadow-slate-200/40"
                onClick={() => {
                  navigate(`/listing/${item.id}`);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                <div className="h-40 bg-slate-50 relative overflow-hidden">
                  {item.image ? (
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-200">
                      <CategoryIcon category={item.category} size={40} />
                    </div>
                  )}
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-900 border border-slate-200 shadow-sm">
                    {item.type}
                  </div>
                  {currentUser && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(item.id);
                      }}
                      className={`absolute top-3 right-3 p-1.5 rounded-lg backdrop-blur-md border transition-all duration-300 ${
                        currentUser.wishlist?.includes(item.id)
                          ? 'bg-red-500 border-red-400 text-white'
                          : 'bg-white/80 border-slate-200 text-slate-400 hover:text-red-500'
                      }`}
                    >
                      <Heart size={14} fill={currentUser.wishlist?.includes(item.id) ? 'currentColor' : 'none'} />
                    </button>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-slate-900 mb-3 truncate group-hover:text-primary-600 transition-colors">{item.title}</h3>
                  <div className="flex justify-between items-center">
                    <span className="font-black text-lg text-slate-900">₹{item.price}</span>
                    <button className="p-2 rounded-xl bg-slate-50 text-slate-400 group-hover:text-primary-600 group-hover:bg-primary-50 transition-all">
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          {listings.filter(l => l.category === listing.category && l.id !== listing.id).length === 0 && (
            <div className="col-span-full py-12 text-center glass-card border-dashed">
              <p className="text-slate-400 font-medium italic">No other items found in this category.</p>
            </div>
          )}
        </div>
      </div>

      <AddReviewModal 
        isOpen={isReviewModalOpen} 
        onClose={() => setIsReviewModalOpen(false)} 
        sellerId={listing.sellerId} 
        sellerName={seller?.name || 'Seller'} 
      />
    </div>
  );
}
