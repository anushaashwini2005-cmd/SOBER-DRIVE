import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShieldCheck, LayoutDashboard, Wallet as WalletIcon, Users, Car, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const LINKS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/emergency-contacts', label: 'Contacts', icon: Users },
  { to: '/wallet', label: 'Wallet', icon: WalletIcon },
  { to: '/driver', label: 'Driver View', icon: Car },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <nav
      style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(8, 11, 22, 0.82)',
        backdropFilter: 'blur(14px)',
        borderBottom: '1px solid var(--border-soft)',
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 68 }}>
        <Link to={isAuthenticated ? '/dashboard' : '/'} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: 'linear-gradient(135deg, var(--brand-hi), var(--brand))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <ShieldCheck size={19} color="#fff" />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 19 }}>SafeRide</span>
        </Link>

        {isAuthenticated && (
          <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {LINKS.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  padding: '9px 14px', borderRadius: 10, fontSize: 14, fontWeight: 600,
                  color: pathname === to ? 'var(--text-primary)' : 'var(--text-muted)',
                  background: pathname === to ? 'var(--bg-elevated)' : 'transparent',
                }}
              >
                <Icon size={16} /> {label}
              </Link>
            ))}
            <button
              onClick={() => { logout(); navigate('/'); }}
              style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 14px', borderRadius: 10, fontSize: 14, fontWeight: 600, color: 'var(--text-muted)' }}
            >
              <LogOut size={16} /> Log out
            </button>
          </div>
        )}

        {!isAuthenticated && (
          <div style={{ display: 'flex', gap: 10 }}>
            <Link to="/login" style={{ padding: '9px 16px', fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)' }}>Log in</Link>
            <Link to="/register" style={{
              padding: '9px 18px', fontSize: 14, fontWeight: 700, borderRadius: 10, color: '#fff',
              background: 'linear-gradient(135deg, var(--brand-hi), var(--brand))',
            }}>Get started</Link>
          </div>
        )}

        {isAuthenticated && (
          <button className="mobile-toggle" style={{ display: 'none' }} onClick={() => setOpen((o) => !o)}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        )}
      </div>

      <style>{`
        @media (max-width: 820px) {
          .nav-links { display: none !important; }
          .mobile-toggle { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}
