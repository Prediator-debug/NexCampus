import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { X, Upload, Image as ImageIcon } from 'lucide-react';

export default function AddListingModal({ isOpen, onClose }) {
  const addListing = useStore((state) => state.addListing);
  
  const [formData, setFormData] = useState({
    title: '',
    category: 'Books',
    type: 'Sell',
    price: '',
    description: '',
    image: null
  });

  const [preview, setPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (rough check for 5MB limit before even trying to resize)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image is too large. Please select an image under 5MB.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.src = reader.result;
        img.onload = () => {
          // Resize image using canvas to stay under Firestore limit
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Max dimensions
          const MAX_SIZE = 800;
          if (width > height) {
            if (width > MAX_SIZE) {
              height *= MAX_SIZE / width;
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width *= MAX_SIZE / height;
              height = MAX_SIZE;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          // Quality 0.7 to keep file size small
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
          setPreview(compressedBase64);
          setFormData(prev => ({ ...prev, image: compressedBase64 }));
        };
      };
      reader.readAsDataURL(file);
    }
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addListing({
        ...formData,
        price: formData.type === 'Donate' ? 0 : parseFloat(formData.price) || 0,
      });
      // Reset form
      setFormData({
        title: '',
        category: 'Books',
        type: 'Sell',
        price: '',
        description: '',
        image: null
      });
      setPreview(null);
      onClose();
    } catch (error) {
      console.error("Listing failed:", error);
      alert("Failed to post listing. Error: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 z-[600] flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-fade-in px-0 sm:px-4">
      <div className="bg-white w-full max-w-lg p-6 sm:p-8 relative animate-slide-up rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl max-h-[92vh] overflow-y-auto custom-scrollbar">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 bg-slate-50 text-slate-400 hover:text-slate-600 rounded-xl transition-colors"
        >
          <X size={20} />
        </button>
        
        <div className="mb-8">
          <h2 className="text-2xl font-black text-slate-900">Post New Listing</h2>
          <p className="text-[10px] font-black uppercase tracking-widest text-primary-600 mt-1">Share with your campus</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-500 mb-1">Title</label>
            <input 
              required
              type="text" 
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Physics Textbook 10th Edition" 
              className="input-field bg-slate-50 border-slate-200 text-slate-900" 
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-textMuted mb-1">Category</label>
              <select 
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="input-field cursor-pointer bg-slate-50 border-slate-200 text-slate-900"
              >
                <option value="Books">Books</option>
                <option value="Notes">Notes</option>
                <option value="Electronics">Electronics</option>
                <option value="Others">Others</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-textMuted mb-1">Type</label>
              <select 
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="input-field cursor-pointer bg-slate-50 border-slate-200 text-slate-900"
              >
                <option value="Sell">Sell</option>
                <option value="Rent">Rent</option>
                <option value="Donate">Donate</option>
              </select>
            </div>
          </div>
          
          {formData.type !== 'Donate' && (
            <div>
              <label className="block text-sm font-medium text-dark-textMuted mb-1">Price (₹)</label>
              <input 
                required
                type="number" 
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="1"
                placeholder="0" 
                className="input-field bg-slate-50 border-slate-200 text-slate-900" 
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-slate-500 mb-1">Product Image</label>
            <div className="relative border-2 border-dashed border-slate-200 rounded-lg p-4 flex flex-col items-center justify-center text-slate-400 hover:border-primary-500 hover:text-primary-600 transition-colors cursor-pointer bg-slate-50 overflow-hidden min-h-[120px]">
              {preview ? (
                <img src={preview} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <>
                  <ImageIcon size={24} className="mb-2" />
                  <span className="text-sm font-medium">Click to upload photo</span>
                  <span className="text-xs mt-1">PNG, JPG</span>
                </>
              )}
              <input 
                type="file" 
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-dark-textMuted mb-1">Description</label>
            <textarea 
              required
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              placeholder="Describe the condition, features, etc."
              className="input-field bg-slate-50 border-slate-200 text-slate-900 resize-none"
            ></textarea>
          </div>
          
          <div className="pt-4 flex justify-end space-x-3">
            <button 
              type="button" 
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="btn-primary"
            >
              {isSubmitting ? 'Posting...' : 'Post Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
