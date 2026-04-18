import { useState, useRef } from 'react';
import { useStore } from '../../store/useStore';
import { X, Camera, User, CreditCard } from 'lucide-react';

export default function EditProfileModal({ isOpen, onClose }) {
  const { currentUser, updateProfile } = useStore();
  
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    profilePicture: currentUser?.profilePicture || '',
    upiId: currentUser?.upiId || '',
    college: currentUser?.college || '',
    branch: currentUser?.branch || '',
    graduationYear: currentUser?.graduationYear || ''
  });
  
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile(formData);
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, profilePicture: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-[500] flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-fade-in px-0 sm:px-4">
      <div className="absolute inset-0 bg-transparent" onClick={onClose}></div>
      
      <div className="relative bg-white w-full max-w-xl rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden animate-slide-up max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-slate-50 p-6 flex items-center justify-between border-b border-slate-100 shrink-0">
          <div>
            <h3 className="text-xl font-black text-slate-900">Edit Profile</h3>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Keep your info updated</p>
          </div>
          <button onClick={onClose} className="p-2.5 rounded-2xl hover:bg-white text-slate-400 hover:text-slate-600 transition-all border border-transparent hover:border-slate-100 shadow-sm">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 overflow-y-auto custom-scrollbar space-y-8">
          {/* Avatar Section */}
          <div className="flex flex-col items-center">
            <div className="relative group">
              <div className="w-28 h-28 rounded-[2rem] bg-gradient-to-br from-indigo-500 to-purple-600 p-1 shadow-xl">
                <div className="w-full h-full rounded-[1.8rem] bg-white flex items-center justify-center overflow-hidden">
                  {formData.profilePicture ? (
                    <img src={formData.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User size={40} className="text-slate-200" />
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-2 -right-2 p-3 bg-primary-600 text-white rounded-2xl shadow-lg hover:scale-110 transition-transform border-4 border-white"
              >
                <Camera size={18} />
              </button>
            </div>
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden" 
            />
            <p className="text-[10px] text-slate-400 mt-4 uppercase font-black tracking-widest">Update Profile Photo</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-primary-600">Personal Details</h4>
              
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 ml-1">Full Name</label>
                <input 
                  required
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name" 
                  className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/5 transition-all outline-none font-bold text-slate-900" 
                />
              </div>
              
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 ml-1">Email Address</label>
                <input 
                  required
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@college.edu" 
                  className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/5 transition-all outline-none font-bold text-slate-900" 
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 ml-1">UPI ID (for payments)</label>
                <div className="relative">
                  <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    name="upiId"
                    value={formData.upiId}
                    onChange={handleChange}
                    placeholder="yourname@upi" 
                    className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/5 transition-all outline-none font-bold text-slate-900" 
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-primary-600">Academic Info</h4>
              
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 ml-1">College Name</label>
                <input 
                  type="text" 
                  name="college"
                  value={formData.college}
                  onChange={handleChange}
                  placeholder="e.g. IIT Delhi" 
                  className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/5 transition-all outline-none font-bold text-slate-900" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 ml-1">Branch</label>
                  <input 
                    type="text" 
                    name="branch"
                    value={formData.branch}
                    onChange={handleChange}
                    placeholder="e.g. CSE" 
                    className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/5 transition-all outline-none font-bold text-slate-900 text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 ml-1">Graduation Year</label>
                  <input 
                    type="text" 
                    name="graduationYear"
                    value={formData.graduationYear}
                    onChange={handleChange}
                    placeholder="e.g. 2025" 
                    className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/5 transition-all outline-none font-bold text-slate-900 text-sm" 
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex gap-4">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 py-4 bg-slate-50 text-slate-600 font-bold rounded-2xl hover:bg-slate-100 transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="flex-[2] btn-primary py-4 shadow-xl shadow-primary-500/20"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
