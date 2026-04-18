import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight, LogIn } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const login = useStore(state => state.login);
  const navigate = useNavigate();
  const currentUser = useStore(state => state.currentUser);

  // Auto-redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'admin') {
        navigate('/dashboard');
      } else {
        navigate('/marketplace');
      }
    }
  }, [currentUser, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    
    try {
      await login(email, password);
      const isAdmin = email === 'shubhamtorkad77@gmail.com' || email === 'jadhavdarshan440@gmail.com';
      if (isAdmin) {
        navigate('/dashboard');
      } else {
        navigate('/marketplace');
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Check console for details.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 animate-fade-in relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-600/10 rounded-full blur-[100px] -z-10"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-indigo-600/10 rounded-full blur-[100px] -z-10"></div>

      <div className="max-w-md w-full space-y-8 glass-card p-10 relative">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-br from-indigo-500 to-primary-600 rounded-2xl flex items-center justify-center text-white shadow-xl mb-6">
            <LogIn size={32} />
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight">Welcome Back</h2>
          <p className="mt-3 text-dark-textMuted font-medium">
            Sign in to continue to NexCampus
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div className="relative group">
              <label className="text-xs font-bold text-dark-textMuted uppercase tracking-widest ml-1 mb-2 block">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-dark-textMuted group-focus-within:text-primary-400 transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-12 bg-slate-50 border-slate-200 focus:bg-white text-slate-900"
                  placeholder="rahul@university.edu"
                />
              </div>
            </div>

            <div className="relative group">
              <div className="flex justify-between items-end mb-2 ml-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">Password</label>
                <a href="#" className="text-[10px] font-bold text-primary-600 hover:text-primary-700 transition-colors uppercase tracking-widest">Forgot?</a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-600 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-12 bg-slate-50 border-slate-200 focus:bg-white text-slate-900"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full flex justify-center py-4 px-4 btn-primary text-lg"
          >
            {isLoading ? (
              <span className="flex items-center space-x-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                <span>Authenticating...</span>
              </span>
            ) : (
              <span className="flex items-center space-x-2">
                <span>Sign In</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </span>
            )}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-white/5 text-center">
          <p className="text-dark-textMuted font-medium">
            New to our campus?{' '}
            <Link to="/register" className="text-primary-400 hover:text-primary-300 font-bold transition-colors inline-flex items-center space-x-1 group">
              <span>Create Account</span>
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
