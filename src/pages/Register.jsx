import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Upload, User, GraduationCap, Mail, Lock, BookOpen, Hash, ArrowRight, ShieldCheck } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function Register() {
  const navigate = useNavigate();
  const register = useStore(state => state.register);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    college: '',
    branch: '',
    graduationYear: '',
    rollNo: ''
  });

  const [idCardPreview, setIdCardPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {

      const reader = new FileReader();
      reader.onloadend = () => {
        setIdCardPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await register({
        email: formData.email,
        password: formData.password,
        name: `${formData.firstName} ${formData.lastName}`,
        college: formData.college,
        branch: formData.branch,
        graduationYear: formData.graduationYear,
        rollNo: formData.rollNo,
        idCardUrl: idCardPreview // Base64 for now
      });
      navigate('/marketplace');
    } catch (error) {
      console.error("Registration failed:", error);
      let message = "Registration failed. Please try again.";
      if (error.code === 'auth/email-already-in-use') {
        message = "This email is already registered. Please login or use another email.";
      } else if (error.code === 'auth/weak-password') {
        message = "Password should be at least 6 characters.";
      } else if (error.code === 'permission-denied') {
        message = "Database access denied. Please ensure you enabled 'Test Mode' in Firebase Firestore.";
      }
      alert(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 animate-fade-in relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600/5 rounded-full blur-[120px] -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/5 rounded-full blur-[120px] -z-10"></div>

      <div className="max-w-4xl w-full glass-card p-10 relative">
        <div className="text-center mb-10">
          <div className="mx-auto h-16 w-16 bg-gradient-to-br from-primary-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl mb-6">
            <User size={32} />
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight">Create Account</h2>
          <p className="mt-3 text-dark-textMuted font-medium max-w-md mx-auto">
            Join the exclusive student marketplace and start trading with your peers.
          </p>
        </div>
        
        <form className="space-y-10" onSubmit={handleRegister}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Personal Info Column */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2 text-primary-400 mb-2">
                <ShieldCheck size={20} />
                <h3 className="text-sm font-black uppercase tracking-widest">Personal Account</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">First Name</label>
                  <input required name="firstName" value={formData.firstName} onChange={handleChange} type="text" placeholder="Rahul" className="input-field bg-slate-50 border-slate-200 text-slate-900" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Last Name</label>
                  <input required name="lastName" value={formData.lastName} onChange={handleChange} type="text" placeholder="Sharma" className="input-field bg-slate-50 border-slate-200 text-slate-900" />
                </div>
              </div>

              <div className="space-y-2 group">
                <label className="text-xs font-bold text-dark-textMuted uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-600 transition-colors">
                    <Mail size={18} />
                  </div>
                  <input required name="email" value={formData.email} onChange={handleChange} type="email" placeholder="rahul@university.edu" className="input-field pl-12 bg-slate-50 border-slate-200 text-slate-900 focus:bg-white" />
                </div>
              </div>

              <div className="space-y-2 group">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-600 transition-colors">
                    <Lock size={18} />
                  </div>
                  <input required name="password" value={formData.password} onChange={handleChange} type="password" placeholder="••••••••" className="input-field pl-12 bg-slate-50 border-slate-200 text-slate-900 focus:bg-white" />
                </div>
              </div>
            </div>

            {/* Academic Info Column */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2 text-primary-400 mb-2">
                <GraduationCap size={20} />
                <h3 className="text-sm font-black uppercase tracking-widest">Academic Details</h3>
              </div>

              <div className="space-y-2 group">
                <label className="text-xs font-bold text-dark-textMuted uppercase tracking-widest ml-1">College Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-dark-textMuted group-focus-within:text-primary-400 transition-colors">
                    <BookOpen size={18} />
                  </div>
                  <input required name="college" value={formData.college} onChange={handleChange} type="text" placeholder="IIT Bombay, etc." className="input-field pl-12 bg-white/5 border-white/10" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 group">
                  <label className="text-xs font-bold text-dark-textMuted uppercase tracking-widest ml-1">Branch</label>
                  <input required name="branch" value={formData.branch} onChange={handleChange} type="text" placeholder="CS, Mech..." className="input-field bg-white/5 border-white/10" />
                </div>
                <div className="space-y-2 group">
                  <label className="text-xs font-bold text-dark-textMuted uppercase tracking-widest ml-1">Roll No</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-dark-textMuted group-focus-within:text-primary-400 transition-colors">
                      <Hash size={16} />
                    </div>
                    <input required name="rollNo" value={formData.rollNo} onChange={handleChange} type="text" placeholder="21BCE..." className="input-field pl-10 bg-white/5 border-white/10" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-dark-textMuted uppercase tracking-widest ml-1">Graduation Year</label>
                <select required name="graduationYear" value={formData.graduationYear} onChange={handleChange} className="input-field bg-white/5 border-white/10 cursor-pointer appearance-none">
                  <option value="" disabled className="bg-dark-bg">Select Year</option>
                  {[2024, 2025, 2026, 2027, 2028].map(y => (
                    <option key={y} value={y} className="bg-dark-bg">{y}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-dark-textMuted uppercase tracking-widest ml-1">Student ID Card (Front)</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  id="idCardUpload" 
                  className="hidden" 
                  onChange={handleFileChange} 
                />
                <label 
                  htmlFor="idCardUpload"
                  className={`border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center transition-all cursor-pointer overflow-hidden min-h-[100px] ${idCardPreview ? 'border-primary-600 bg-primary-50' : 'border-slate-200 text-slate-400 hover:border-primary-500 hover:text-primary-600 bg-slate-50 hover:bg-white'}`}
                >
                  {idCardPreview ? (
                    <div className="flex flex-col items-center">
                      <img src={idCardPreview} alt="ID Card Preview" className="h-20 w-auto rounded-lg mb-2 object-cover" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-primary-400">Change Image</span>
                    </div>
                  ) : (
                    <>
                      <Upload size={20} className="mb-1" />
                      <span className="text-xs font-bold">Upload Scan</span>
                    </>
                  )}
                </label>
              </div>
            </div>
          </div>
          
          <div className="pt-6 border-t border-white/5">
            <button type="submit" disabled={isLoading} className="btn-primary w-full py-4 text-xl flex items-center justify-center space-x-2">
              {isLoading ? (
                <span className="flex items-center space-x-2">
                  <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  <span>Creating Account...</span>
                </span>
              ) : (
                <>
                  <span>Submit Registration</span>
                  <ArrowRight size={24} />
                </>
              )}
            </button>
            <p className="mt-6 text-center text-dark-textMuted font-medium">
              Already a member?{' '}
              <Link to="/login" className="text-primary-400 hover:text-primary-300 font-bold transition-colors">Sign in here</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
