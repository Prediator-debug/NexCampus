import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, User, LogOut, MessageCircle, Menu, X, Heart } from 'lucide-react';
import { useStore } from '../../store/useStore';

export default function Navbar() {
  const { currentUser, logout, circulars, messages } = useStore();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const latestNotifications = circulars.slice(0, 5);
  const hasImportant = circulars.some(c => c.important);
  const unreadCount = messages.filter(m => (m.receiverId === currentUser?.id || m.receiverId === 'any' || !m.receiverId) && !m.isRead).length;
  const [lastViewedId, setLastViewedId] = useState(() => localStorage.getItem('lastViewedCircularId') || '');
  
  const latestCircularId = circulars.length > 0 ? circulars[0].id : '';
  const hasNewCirculars = latestCircularId && latestCircularId !== lastViewedId;
  const showBellDot = hasNewCirculars;

  useEffect(() => {
    if (showNotifications && latestCircularId) {
      localStorage.setItem('lastViewedCircularId', latestCircularId);
      setLastViewedId(latestCircularId);
    }
  }, [showNotifications, latestCircularId]);

  const handleBellClick = () => {
    setShowNotifications(!showNotifications);
  };
  const wishlistCount = currentUser?.wishlist?.length || 0;

  const handleLogout = () => {
    logout();
    setShowNotifications(false);
    setMobileMenuOpen(false);
    navigate('/');
  };

  return (
    <nav style={{ position: 'sticky', top: 0, zIndex: 50, width: '100%', borderBottom: '1px solid rgba(0,0,0,0.06)', background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(20px)' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem', height: '70px', display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: '1rem' }}>

        {/* ── Logo ── */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none', justifySelf: 'start' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 800, fontSize: '1.1rem',
            boxShadow: '0 4px 14px rgba(79,70,229,0.3)'
          }}>N</div>
          <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', fontFamily: 'Outfit, sans-serif' }}>
            Nex<span style={{ color: '#6366f1' }}>Campus</span>
          </span>
        </Link>

        {/* ── Desktop Nav Links (truly centered) ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }} className="hidden-mobile">
          {[
            { to: '/', label: 'Home' },
            { to: '/marketplace', label: 'Marketplace' },
            { to: '/circulars', label: 'Circulars' },
            ...(currentUser?.role === 'admin' ? [{ to: '/dashboard', label: 'Dashboard' }] : []),
          ].map(link => (
            <Link
              key={link.to}
              to={link.to}
              style={{
                padding: '0.45rem 0.9rem',
                borderRadius: '8px',
                color: '#64748b',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '0.9rem',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#4f46e5'; e.currentTarget.style.background = 'rgba(79,70,229,0.05)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.background = 'transparent'; }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* ── Desktop Auth / User Actions ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifySelf: 'end' }} className="hidden-mobile">

          {/* Divider */}
          <div style={{ width: '1px', height: '22px', background: 'rgba(0,0,0,0.1)', margin: '0 0.25rem' }} />

          {currentUser ? (
            <>
              {/* Bell */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '0.45rem', borderRadius: '8px', display: 'flex', alignItems: 'center', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#4f46e5'; e.currentTarget.style.background = 'rgba(79,70,229,0.05)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.background = 'transparent'; }}
                >
                  <Bell size={20} />
                  {showBellDot && (
                    <span style={{
                      position: 'absolute', top: '0px', right: '0px', width: '12px', height: '12px',
                      borderRadius: '50%', border: '2px solid #ffffff',
                      background: '#ef4444', zIndex: 10
                    }} />
                  )}
                </button>

                {showNotifications && (
                  <>
                    <div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setShowNotifications(false)} />
                    <div style={{
                      position: 'absolute', right: 0, top: 'calc(100% + 10px)', width: '320px',
                      background: '#ffffff', border: '1px solid rgba(0,0,0,0.08)',
                      borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', zIndex: 200, overflow: 'hidden'
                    }}>
                      <div style={{ padding: '0.85rem 1rem', borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#6366f1' }}>Campus Alerts</span>
                        <Link to="/circulars" onClick={() => setShowNotifications(false)} style={{ fontSize: '0.7rem', color: '#64748b', textDecoration: 'none', fontWeight: 700, textTransform: 'uppercase' }}>View All</Link>
                      </div>
                      <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
                        {latestNotifications.length > 0 ? latestNotifications.map(n => (
                          <Link key={n.id} to="/circulars" onClick={() => setShowNotifications(false)}
                            style={{ display: 'block', padding: '0.85rem 1rem', borderBottom: '1px solid rgba(0,0,0,0.04)', textDecoration: 'none' }}>
                            <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1e293b', margin: 0 }}>{n.title}</p>
                            <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '3px' }}>{n.content?.slice(0, 70)}…</p>
                          </Link>
                        )) : (
                          <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>No new notifications</div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Messages */}
              <Link to="/messages" style={{ position: 'relative', color: '#64748b', padding: '0.45rem', borderRadius: '8px', display: 'flex', alignItems: 'center', transition: 'all 0.2s', textDecoration: 'none' }}
                onMouseEnter={e => { e.currentTarget.style.color = '#4f46e5'; e.currentTarget.style.background = 'rgba(79,70,229,0.05)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.background = 'transparent'; }}>
                <div style={{ position: 'relative' }}>
                  <MessageCircle size={20} />
                  {unreadCount > 0 && (
                    <span style={{ 
                      position: 'absolute', top: '-6px', right: '-6px', 
                      background: '#22c55e', color: '#fff', fontSize: '10px', 
                      fontWeight: 800, minWidth: '18px', height: '18px', 
                      borderRadius: '9px', display: 'flex', alignItems: 'center', 
                      justifyContent: 'center', border: '2px solid #ffffff',
                      boxShadow: '0 2px 8px rgba(34,197,94,0.3)', zIndex: 10
                    }}>
                      {unreadCount}
                    </span>
                  )}
                </div>
              </Link>

              {/* Wishlist */}
              <Link to="/wishlist" style={{ position: 'relative', color: '#64748b', padding: '0.45rem', borderRadius: '8px', display: 'flex', alignItems: 'center', transition: 'all 0.2s', textDecoration: 'none' }}
                onMouseEnter={e => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.background = 'rgba(239,68,68,0.05)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.background = 'transparent'; }}>
                <Heart size={19} />
                {wishlistCount > 0 && (
                  <span style={{ 
                    position: 'absolute', top: '2px', right: '2px', 
                    background: '#ef4444', color: '#fff', fontSize: '10px', 
                    fontWeight: 800, minWidth: '16px', height: '16px', 
                    borderRadius: '8px', display: 'flex', alignItems: 'center', 
                    justifyContent: 'center', border: '2px solid #ffffff' 
                  }}>
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Avatar + Dropdown */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => { setShowUserMenu(!showUserMenu); setShowNotifications(false); }}
                  style={{
                    width: '36px', height: '36px', borderRadius: '10px',
                    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer',
                    boxShadow: '0 2px 10px rgba(79,70,229,0.3)', border: 'none',
                    outline: showUserMenu ? '2px solid #6366f1' : 'none', transition: 'all 0.2s',
                    overflow: 'hidden'
                  }}>
                  {currentUser.profilePicture ? (
                    <img src={currentUser.profilePicture} alt="Avatar" style={{ width: '100%', height: '100%', objectCover: 'cover' }} />
                  ) : (
                    currentUser.name?.charAt(0).toUpperCase() || currentUser.email?.charAt(0).toUpperCase() || 'U'
                  )}
                </button>

                {showUserMenu && (
                  <>
                    <div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setShowUserMenu(false)} />
                    <div style={{
                      position: 'absolute', right: 0, top: 'calc(100% + 10px)', width: '200px',
                      background: '#ffffff', border: '1px solid rgba(0,0,0,0.08)',
                      borderRadius: '14px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', zIndex: 200, overflow: 'hidden'
                    }}>
                      <div style={{ padding: '0.85rem 1rem', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                        <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 700, color: '#1e293b' }}>{currentUser.name || 'User'}</p>
                        <p style={{ margin: '2px 0 0', fontSize: '0.72rem', color: '#64748b' }}>{currentUser.email}</p>
                      </div>
                      <Link to="/profile" onClick={() => setShowUserMenu(false)}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.7rem 1rem', color: '#475569', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 500, transition: 'all 0.2s' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(79,70,229,0.05)'; e.currentTarget.style.color = '#4f46e5'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#475569'; }}>
                        <User size={14} /> Profile
                      </Link>
                      <button onClick={handleLogout}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', width: '100%', padding: '0.7rem 1rem', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500, transition: 'all 0.2s', borderTop: '1px solid rgba(0,0,0,0.05)' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.05)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <LogOut size={14} /> Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Link to="/login" style={{ color: '#475569', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none', padding: '0.45rem 0.75rem', borderRadius: '8px', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.color = '#4f46e5'; e.currentTarget.style.background = 'rgba(79,70,229,0.05)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = '#475569'; e.currentTarget.style.background = 'transparent'; }}>
                Login
              </Link>
              <Link to="/register" style={{
                display: 'flex', alignItems: 'center', gap: '0.4rem',
                background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                color: '#fff', fontWeight: 600, fontSize: '0.9rem',
                padding: '0.5rem 1.1rem', borderRadius: '10px',
                textDecoration: 'none', boxShadow: '0 4px 14px rgba(79,70,229,0.3)',
                transition: 'all 0.2s'
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(79,70,229,0.4)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(79,70,229,0.3)'; }}>
                <User size={15} />
                Join Now
              </Link>
            </div>
          )}
        </div>

        {/* ── Mobile: right side icons + hamburger ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }} className="show-mobile">
          {currentUser && (
            <>
              <Link to="/messages" style={{ position: 'relative', color: '#64748b', padding: '0.4rem', borderRadius: '8px', display: 'flex' }}>
                <div style={{ position: 'relative' }}>
                  <MessageCircle size={22} />
                  {unreadCount > 0 && (
                    <span style={{ 
                      position: 'absolute', top: '-6px', right: '-6px', 
                      background: '#22c55e', color: '#fff', fontSize: '10px', 
                      fontWeight: 800, minWidth: '18px', height: '18px', 
                      borderRadius: '9px', display: 'flex', alignItems: 'center', 
                      justifyContent: 'center', border: '2px solid #ffffff',
                      boxShadow: '0 2px 8px rgba(34,197,94,0.3)', zIndex: 10
                    }}>
                      {unreadCount}
                    </span>
                  )}
                </div>
              </Link>
              <Link to="/wishlist" style={{ position: 'relative', color: '#64748b', padding: '0.4rem', borderRadius: '8px', display: 'flex' }}>
                <Heart size={20} />
                {wishlistCount > 0 && (
                  <span style={{ 
                    position: 'absolute', top: '0px', right: '0px', 
                    background: '#ef4444', color: '#fff', fontSize: '8px', 
                    fontWeight: 800, minWidth: '14px', height: '14px', 
                    borderRadius: '7px', display: 'flex', alignItems: 'center', 
                    justifyContent: 'center', border: '1.5px solid #ffffff' 
                  }}>
                    {wishlistCount}
                  </span>
                )}
              </Link>
              <button onClick={handleBellClick}
                style={{ position: 'relative', color: '#64748b', background: 'none', border: 'none', cursor: 'pointer', padding: '0.4rem', borderRadius: '8px', display: 'flex' }}>
                <Bell size={22} />
                {showBellDot && <span style={{ position: 'absolute', top: '0px', right: '0px', width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444', border: '2px solid #ffffff', zIndex: 10 }} />}
              </button>
            </>
          )}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ color: '#64748b', background: 'none', border: 'none', cursor: 'pointer', padding: '0.4rem', borderRadius: '8px', display: 'flex' }}>
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* ── Mobile Dropdown ── */}
      {mobileMenuOpen && (
        <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)', background: '#ffffff', backdropFilter: 'blur(20px)' }} className="show-mobile">
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0.75rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {[
              { to: '/', label: 'Home' },
              { to: '/marketplace', label: 'Marketplace' },
              { to: '/circulars', label: 'Circulars' },
              ...(currentUser ? [{ to: '/messages', label: 'Messages' }, { to: '/wishlist', label: 'Wishlist' }] : []),
              ...(currentUser?.role === 'admin' ? [{ to: '/dashboard', label: 'Dashboard' }] : []),
            ].map(link => (
              <Link key={link.to} to={link.to} onClick={() => setMobileMenuOpen(false)}
                style={{ padding: '0.75rem 1rem', borderRadius: '10px', color: '#475569', textDecoration: 'none', fontWeight: 600, fontSize: '0.95rem' }}>
                {link.label}
              </Link>
            ))}

            <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)', marginTop: '0.5rem', paddingTop: '0.75rem' }}>
              {currentUser ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 0.5rem' }}>
                  <Link to="/profile" onClick={() => setMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, overflow: 'hidden' }}>
                      {currentUser.profilePicture ? (
                        <img src={currentUser.profilePicture} alt="Avatar" style={{ width: '100%', height: '100%', objectCover: 'cover' }} />
                      ) : (
                        currentUser.name?.charAt(0).toUpperCase() || 'U'
                      )}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ margin: 0, color: '#0f172a', fontWeight: 700, fontSize: '0.9rem' }}>{currentUser.name || 'User'}</p>
                      <p style={{ margin: 0, color: '#64748b', fontSize: '0.75rem' }}>{currentUser.email}</p>
                    </div>
                  </Link>
                  <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem' }}>
                    <LogOut size={15} /> Logout
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} style={{ padding: '0.8rem', textAlign: 'center', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '10px', color: '#0f172a', textDecoration: 'none', fontWeight: 700 }}>Login</Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)} style={{ padding: '0.8rem', textAlign: 'center', background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', borderRadius: '10px', color: '#fff', textDecoration: 'none', fontWeight: 700 }}>Join Now</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (min-width: 768px) {
          .hidden-mobile { display: flex !important; }
          .show-mobile { display: none !important; }
        }
        @media (max-width: 767px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}
