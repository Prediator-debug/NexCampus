import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, ShoppingCart, BookOpen, Laptop, Sparkles, ShoppingBag, MessageCircle, Bell } from 'lucide-react';
import { useStore } from '../store/useStore';
import Footer from '../components/layout/Footer';

export default function Home() {
  const navigate = useNavigate();
  const { circulars, currentUser } = useStore();
  const firstName = currentUser?.name?.split(' ')[0] || 'Student';

  return (
    <div className="flex flex-col items-center animate-fade-in w-full">
      {/* Hero Section — full viewport height */}
      <div className="relative w-full flex flex-col items-center justify-center text-center overflow-hidden px-4 py-20 sm:py-0" style={{ minHeight: 'calc(100vh - 70px)' }}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-0 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-primary-100 rounded-full blur-[100px] opacity-40"></div>
          <div className="absolute bottom-0 right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-indigo-50 rounded-full blur-[100px] opacity-40"></div>
        </div>

        {currentUser ? (
          /* --- LOGGED IN HERO --- */
          <>
            <div className="inline-flex items-center space-x-2 py-2 px-4 rounded-full bg-primary-50 text-primary-700 text-xs sm:text-sm font-semibold mb-6 sm:mb-8 border border-primary-100">
              <Sparkles size={14} />
              <span>Welcome back to NexCampus</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-5 sm:mb-6 leading-[1.1]">
              Hey,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-primary-600 to-purple-600">
                {firstName}!
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-xl sm:max-w-2xl mb-8 sm:mb-12 leading-relaxed font-medium px-4">
              Your campus marketplace is live. Browse listings, check new circulars, or post your own item today.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link
                to="/marketplace"
                className="btn-primary inline-flex items-center justify-center gap-2 text-base sm:text-lg py-3.5 sm:py-4 px-8 sm:px-12 w-full sm:w-auto group"
              >
                <ShoppingBag size={20} />
                <span>Browse Marketplace</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/circulars"
                className="btn-secondary inline-flex items-center justify-center gap-2 text-base sm:text-lg py-3.5 sm:py-4 px-8 sm:px-12 w-full sm:w-auto"
              >
                <Bell size={18} />
                <span>View Circulars</span>
              </Link>
            </div>

            {/* Quick Stats Row */}
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 mt-6 sm:mt-8">
              <div className="text-center">
                <p className="text-2xl sm:text-3xl font-black text-slate-900">{circulars.length}</p>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-1">Circulars</p>
              </div>
              <div className="w-px h-8 bg-slate-200"></div>
              <div className="text-center">
                <p className="text-2xl sm:text-3xl font-black text-slate-900 capitalize">{currentUser.role}</p>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-1">Account</p>
              </div>
              <div className="w-px h-8 bg-slate-200"></div>
              <div className="text-center">
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest ${
                  currentUser.status === 'verified' || currentUser.role === 'admin'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-orange-100 text-orange-700'
                }`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                  {currentUser.status === 'verified' || currentUser.role === 'admin' ? 'Verified' : 'Pending'}
                </div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-2">Status</p>
              </div>
            </div>
          </>
        ) : (
          /* --- GUEST HERO --- */
          <>
            <div className="inline-flex items-center space-x-2 py-2 px-4 rounded-full bg-slate-50 text-primary-600 text-xs sm:text-sm font-semibold mb-6 sm:mb-8 border border-slate-200">
              <Sparkles size={14} />
              <span>Next Gen Campus Marketplace</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4 sm:mb-5 leading-[1.1] text-slate-900">
              Next Gen{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-primary-600 to-purple-600">
                Campus
              </span>
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-slate-500 max-w-xl sm:max-w-2xl mb-6 sm:mb-8 leading-relaxed font-medium px-4">
              The most professional, secure, and intuitive marketplace exclusively for students.
              Buy, sell, or donate with trust and real-time negotiation.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link
                to="/marketplace"
                className="btn-primary inline-flex items-center justify-center gap-2 text-base sm:text-lg py-3.5 sm:py-4 px-8 sm:px-12 w-full sm:w-auto group"
              >
                <span>Get Started</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/register"
                className="btn-secondary inline-flex items-center justify-center text-base sm:text-lg py-3.5 sm:py-4 px-8 sm:px-12 w-full sm:w-auto"
              >
                Join the Community
              </Link>
            </div>
          </>
        )}

      </div>{/* end hero section */}

      {/* Category Section — Screen 2 */}
      <div className="relative w-full flex flex-col items-center justify-center overflow-hidden px-4 min-h-screen" style={{ backgroundColor: '#f8fafc' }}>
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-primary-100 rounded-full blur-[120px] -z-10 opacity-30"></div>
        
        <div className="w-full max-w-7xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 sm:mb-12 gap-4">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-3 text-slate-900">Browse by Category</h2>
              <p className="text-slate-500 text-base sm:text-lg">Quick access to everything you need for college life.</p>
            </div>
            <Link to="/marketplace" className="text-primary-600 hover:text-primary-700 font-bold flex items-center space-x-2 group shrink-0">
              <span>View All Marketplace</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { title: "Books & Notes", icon: BookOpen, desc: "Find cheap course materials and handwritten notes", filters: ['Books', 'Notes'], color: 'from-blue-500/20 to-cyan-500/20' },
              { title: "Electronics", icon: Laptop, desc: "Laptops, tablets, calculators and tech accessories", filters: ['Electronics'], color: 'from-indigo-500/20 to-purple-500/20' },
              { title: "Hostel Needs", icon: ShoppingCart, desc: "Everyday essentials, appliances and hostel gear", filters: ['Others'], color: 'from-pink-500/20 to-rose-500/20' },
            ].map((item, i) => (
              <div
                key={i}
                onClick={() => navigate('/marketplace', { state: { initialCategories: item.filters } })}
                className="glass-card p-8 flex flex-col items-start text-left hover:-translate-y-2 transition-all duration-500 cursor-pointer group relative overflow-hidden active:scale-95 border-slate-100 shadow-xl shadow-slate-200/40"
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${item.color} blur-[60px] -z-10 group-hover:scale-150 transition-transform duration-700`}></div>
                <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-primary-600 mb-8 group-hover:bg-primary-600 group-hover:text-white transition-all duration-500 shadow-sm border border-slate-100">
                  <item.icon size={32} />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-3 group-hover:text-primary-600 transition-colors text-slate-900">{item.title}</h3>
                <p className="text-slate-500 leading-relaxed mb-6 text-sm sm:text-base">{item.desc}</p>
                <div className="flex items-center space-x-2 text-sm font-bold text-slate-400 group-hover:text-primary-600 transition-colors mt-auto">
                  <span>Explore Category</span>
                  <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Announcements Section — Screen 3 */}
      <div className="relative w-full flex flex-col items-center justify-center overflow-hidden px-4 py-20 sm:py-0" style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-50 rounded-full blur-[120px] -z-10 opacity-40"></div>
        
        <div className="w-full max-w-7xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 sm:mb-12 gap-4">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-3 text-slate-900">Latest Announcements</h2>
              <p className="text-slate-500 text-base sm:text-lg">Stay in the loop with the latest campus news and events.</p>
            </div>
            <Link to="/circulars" className="text-primary-600 hover:text-primary-700 font-bold flex items-center space-x-2 group shrink-0">
              <span>View All Notices</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {circulars.length === 0 ? (
            <div className="glass-card py-16 flex flex-col items-center justify-center text-center">
              <p className="text-dark-textMuted font-medium">No announcements yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {circulars.slice(0, 3).map((announcement, i) => (
                <div 
                  key={i} 
                  className="glass-card p-6 flex flex-col hover:border-primary-200 hover:shadow-xl hover:shadow-slate-200/50 transition-all group cursor-pointer border-slate-100"
                  onClick={() => navigate(`/circular/${announcement.id}`)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${announcement.category === 'Events' ? 'bg-purple-50 text-purple-600 border border-purple-100' : 'bg-primary-50 text-primary-600 border border-primary-100'}`}>
                      {announcement.category}
                    </span>
                    <span className="text-xs text-slate-400 font-bold">{new Date(announcement.date).toLocaleDateString()}</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mb-2 group-hover:text-primary-600 transition-colors line-clamp-1 text-slate-900">{announcement.title}</h3>
                  <p className="text-slate-500 text-sm line-clamp-2 mb-4 flex-1 font-medium">{announcement.content}</p>
                  <div className="mt-auto text-sm font-bold text-primary-600 flex items-center gap-2 group-hover:gap-3 transition-all">
                    Read More <ArrowRight size={14} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
