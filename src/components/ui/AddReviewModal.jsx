import { useState } from 'react';
import { Star, X, MessageSquare, Send } from 'lucide-react';
import { useStore } from '../../store/useStore';

export default function AddReviewModal({ isOpen, onClose, sellerId, sellerName }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hover, setHover] = useState(0);
  const { addReview, currentUser } = useStore();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return;

    await addReview(sellerId, {
      reviewerId: currentUser.id,
      reviewerName: currentUser.name,
      rating,
      comment,
    });
    
    setComment('');
    setRating(5);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-fade-in px-0 sm:px-4">
      <div className="absolute inset-0 bg-transparent" onClick={onClose}></div>
      
      <div className="relative bg-white w-full max-w-md rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="bg-slate-50 p-6 flex items-center justify-between border-b border-slate-100">
          <div>
            <h3 className="text-xl font-black text-slate-900">Rate {sellerName}</h3>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Share your experience</p>
          </div>
          <button onClick={onClose} className="p-2.5 rounded-2xl hover:bg-white text-slate-400 hover:text-slate-600 transition-all border border-transparent hover:border-slate-100 shadow-sm">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          {/* Star Rating */}
          <div className="flex flex-col items-center mb-8">
            <p className="text-sm font-bold text-slate-500 mb-4 uppercase tracking-widest">Your Rating</p>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  className="transition-transform active:scale-90"
                >
                  <Star 
                    size={40} 
                    className={`${
                      (hover || rating) >= star ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                    } transition-all duration-200`}
                  />
                </button>
              ))}
            </div>
            <p className="mt-4 text-amber-500 font-black text-lg">
              {rating === 5 ? 'Excellent!' : rating === 4 ? 'Very Good' : rating === 3 ? 'Good' : rating === 2 ? 'Fair' : 'Poor'}
            </p>
          </div>

          {/* Comment */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <MessageSquare size={16} className="text-primary-600" />
              <span>Tell us more</span>
            </div>
            <textarea
              required
              placeholder="How was the transaction? Was the seller helpful?"
              className="w-full h-32 p-5 bg-slate-50 border-2 border-slate-100 rounded-3xl focus:ring-4 focus:ring-primary-500/5 focus:border-primary-500/50 outline-none transition-all resize-none text-slate-700 font-medium"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={!comment.trim()}
            className="w-full btn-primary py-4 flex items-center justify-center gap-3 shadow-xl shadow-primary-500/20 disabled:opacity-50 disabled:grayscale transition-all"
          >
            <Send size={20} />
            <span>Submit Review</span>
          </button>
        </form>
      </div>
    </div>
  );
}
