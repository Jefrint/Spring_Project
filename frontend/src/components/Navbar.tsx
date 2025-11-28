import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getRoles } from '../utils/auth';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const roles = getRoles();

  const [collapsed, setCollapsed] = useState(true);
  const [acctOpen, setAcctOpen] = useState(false);
  const acctRef = useRef<HTMLLIElement | null>(null);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('roles');
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (acctRef.current && !acctRef.current.contains(e.target as Node)) {
        setAcctOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <nav
      className="navbar navbar-expand-lg shadow-sm sticky-top"
      style={{
        background: 'linear-gradient(90deg, #4c6ef5, #845ef7, #f06595)',
      }}
    >
      <div className="container">

        <Link className="navbar-brand text-white fw-bold" to="/">
          SpringShop
        </Link>

        <button
          className="navbar-toggler"
          style={{ backgroundColor: 'white' }}
          onClick={() => setCollapsed((s) => !s)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${collapsed ? '' : 'show'}`}>

          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link text-white" to="/items">Items</Link>
            </li>

            {!roles.includes('ROLE_ADMIN') && (
              <>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/cart">Cart</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/orders">Orders</Link>
                </li>
              </>
            )}

            {roles.includes('ROLE_ADMIN') && (
              <li className="nav-item">
                <Link className="nav-link text-white" to="/admin">Admin</Link>
              </li>
            )}
          </ul>

          <form className="d-none d-lg-flex me-3">
            <input
              className="form-control border-0"
              placeholder="Search..."
              style={{ width: 250 }}
            />
          </form>

          <ul className="navbar-nav ms-auto">

            {!token ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-light ms-2" to="/register">
                    Register
                  </Link>
                </li>
              </>
            ) : (
              <li className="nav-item dropdown" ref={acctRef}>
                <button
                  className="btn btn-light rounded-pill"
                  onClick={() => setAcctOpen((s) => !s)}
                >
                  Account
                </button>

                <ul className={`dropdown-menu dropdown-menu-end ${acctOpen ? 'show' : ''}`}>
                  <li><Link className="dropdown-item" to="/profile">Profile</Link></li>
                  <li><Link className="dropdown-item" to="/settings">Settings</Link></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><button className="dropdown-item text-danger" onClick={logout}>Logout</button></li>
                </ul>
              </li>
            )}

          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
