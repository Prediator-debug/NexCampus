import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, GraduationCap, ArrowRight } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();

  const sections = [
    {
      title: 'Platform',
      links: [
        { label: 'Home', to: '/' },
        { label: 'Marketplace', to: '/marketplace' },
        { label: 'Circulars', to: '/circulars' },
        { label: 'Messages', to: '/messages' },
      ],
    },
    {
      title: 'Account',
      links: [
        { label: 'Login', to: '/login' },
        { label: 'Register', to: '/register' },
        { label: 'My Profile', to: '/profile' },
      ],
    },
  ];

  const contact = [
    { icon: <Mail size={13} />, text: 'support@nexcampus.in' },
    { icon: <Phone size={13} />, text: '+91 98765 43210' },
    { icon: <MapPin size={13} />, text: 'Mumbai, Maharashtra, India' },
  ];

  return (
    <footer style={{
      background: '#f8fafc',
      borderTop: '1px solid rgba(0,0,0,0.06)',
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* Ambient glow */}
      <div style={{
        position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
        width: '600px', height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.2), transparent)',
      }} />

      {/* Main grid */}
      <div style={{
        maxWidth: '1280px', margin: '0 auto',
        padding: '4rem 2rem 2.5rem',
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 1fr 1.5fr',
        gap: '3rem',
      }}
        className="footer-grid"
      >

        {/* ── Brand ── */}
        <div>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none', marginBottom: '1.25rem' }}>
            <div style={{
              width: '38px', height: '38px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: 800, fontSize: '1.1rem',
              boxShadow: '0 4px 16px rgba(79,70,229,0.25)',
            }}>N</div>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.02em' }}>
              Nex<span style={{ color: '#6366f1' }}>Campus</span>
            </span>
          </Link>

          <p style={{ color: '#64748b', fontSize: '0.83rem', lineHeight: 1.8, margin: '0 0 1.5rem', maxWidth: '260px' }}>
            A modern campus marketplace — buy, sell, and connect with your college community.
          </p>

          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.4rem 0.85rem', borderRadius: '100px',
            background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.1)',
          }}>
            <GraduationCap size={13} style={{ color: '#6366f1' }} />
            <span style={{ fontSize: '0.75rem', color: '#6366f1', fontWeight: 600 }}>Student-first Platform</span>
          </div>

          {/* Social */}
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.25rem' }}>
            {['GitHub', 'Twitter', 'LinkedIn'].map(name => (
              <a key={name} href="#" style={{
                padding: '0.35rem 0.7rem', borderRadius: '7px', fontSize: '0.72rem', fontWeight: 600,
                color: '#64748b', border: '1px solid rgba(0,0,0,0.07)',
                background: '#ffffff', textDecoration: 'none', transition: 'all 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.color = '#4f46e5'; e.currentTarget.style.borderColor = 'rgba(79,70,229,0.2)'; e.currentTarget.style.background = 'rgba(79,70,229,0.05)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.borderColor = 'rgba(0,0,0,0.07)'; e.currentTarget.style.background = '#ffffff'; }}
              >{name}</a>
            ))}
          </div>
        </div>

        {/* ── Link Columns ── */}
        {sections.map(section => (
          <div key={section.title}>
            <p style={{
              color: '#0f172a', fontWeight: 700, fontSize: '0.8rem',
              textTransform: 'uppercase', letterSpacing: '0.08em',
              margin: '0 0 1.25rem', fontFamily: 'Outfit, sans-serif',
            }}>{section.title}</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
              {section.links.map(link => (
                <li key={link.to}>
                  <Link to={link.to} style={{
                    color: '#64748b', textDecoration: 'none', fontSize: '0.85rem',
                    fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                    transition: 'all 0.2s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#4f46e5'; e.currentTarget.style.gap = '0.55rem'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.gap = '0.35rem'; }}
                  >
                    <ArrowRight size={12} style={{ opacity: 0.5 }} />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* ── Contact ── */}
        <div>
          <p style={{
            color: '#0f172a', fontWeight: 700, fontSize: '0.8rem',
            textTransform: 'uppercase', letterSpacing: '0.08em',
            margin: '0 0 1.25rem', fontFamily: 'Outfit, sans-serif',
          }}>Contact Us</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            {contact.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '7px', flexShrink: 0,
                  background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#6366f1',
                }}>{item.icon}</div>
                <span style={{ color: '#64748b', fontSize: '0.83rem', lineHeight: 1.6, paddingTop: '4px' }}>{item.text}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <Link to="/register" style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            marginTop: '1.5rem', padding: '0.55rem 1.1rem',
            background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
            borderRadius: '9px', color: '#fff', fontWeight: 600,
            fontSize: '0.82rem', textDecoration: 'none',
            boxShadow: '0 4px 14px rgba(79,70,229,0.3)', transition: 'all 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(79,70,229,0.4)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(79,70,229,0.3)'; }}
          >
            Join NexCampus <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      {/* ── Bottom Bar ── */}
      <div style={{ borderTop: '1px solid rgba(0,0,0,0.05)' }}>
        <div style={{
          maxWidth: '1280px', margin: '0 auto', padding: '1.1rem 2rem',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem',
        }}>
          <p style={{ margin: 0, color: '#64748b', fontSize: '0.77rem' }}>
            © {year} <span style={{ color: '#0f172a', fontWeight: 600 }}>NexCampus</span>. All rights reserved.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(t => (
              <a key={t} href="#" style={{ color: '#64748b', fontSize: '0.77rem', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#4f46e5'}
                onMouseLeave={e => e.currentTarget.style.color = '#64748b'}
              >{t}</a>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; gap: 2rem !important; }
        }
        @media (max-width: 540px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}
