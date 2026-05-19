import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store/useStore';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Marketplace from './pages/Marketplace';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Circulars from './pages/Circulars';
import Messages from './pages/Messages';
import ListingDetail from './pages/ListingDetail';
import CircularDetail from './pages/CircularDetail';
import Wishlist from './pages/Wishlist';
import PublicProfile from './pages/PublicProfile';
import ChatBox from './components/ui/ChatBox';
import BottomNav from './components/layout/BottomNav';
import ScrollToTop from './components/layout/ScrollToTop';
import AddListingModal from './components/ui/AddListingModal';

// Protected Route Component for Admin
const AdminRoute = ({ children }) => {
  const currentUser = useStore(state => state.currentUser);
  if (!currentUser || currentUser.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  const initFirebase = useStore(state => state.initFirebase);
  const updateLastSeen = useStore(state => state.updateLastSeen);
  const currentUser = useStore(state => state.currentUser);
  const isAddListingModalOpen = useStore(state => state.isAddListingModalOpen);
  const setIsAddListingModalOpen = useStore(state => state.setIsAddListingModalOpen);

  useEffect(() => {
    initFirebase();
  }, [initFirebase]);

  // Heartbeat: update lastSeen every 2 minutes while user is logged in
  useEffect(() => {
    if (!currentUser) return;
    updateLastSeen(); // immediate on login
    const interval = setInterval(updateLastSeen, 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, [currentUser, updateLastSeen]);

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-white text-slate-900 flex flex-col relative w-full overflow-x-hidden">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route 
              path="/dashboard" 
              element={
                <AdminRoute>
                  <Dashboard />
                </AdminRoute>
              } 
            />
            <Route path="/profile" element={<Profile />} />
            <Route path="/circulars" element={<Circulars />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/listing/:id" element={<ListingDetail />} />
            <Route path="/user/:id" element={<PublicProfile />} />
            <Route path="/circular/:id" element={<CircularDetail />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <ChatBox />
        <BottomNav />
        <AddListingModal 
          isOpen={isAddListingModalOpen} 
          onClose={() => setIsAddListingModalOpen(false)} 
        />
      </div>
    </Router>
  );
}

export default App;
