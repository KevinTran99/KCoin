import { NavLink, Outlet } from 'react-router-dom';
import '../styles/layout.css';
import { useAuth } from '../context/AuthContext';

export const Layout = () => {
  const { user, logout } = useAuth();

  return (
    <div className="wrapper">
      <header>
        <nav>
          <ul className="left-nav">
            <li>
              <NavLink to={'/'}>Home</NavLink>
            </li>
            {!user && (
              <>
                <li>
                  <NavLink to={'/login'}>Login</NavLink>
                </li>
                <li>
                  <NavLink to={'/register'}>Register</NavLink>
                </li>
              </>
            )}
            {user && (
              <>
                <li>
                  <NavLink to={'/blockchain'}>Blockchain</NavLink>
                </li>
                <li>
                  <NavLink to={'/transactions'}>Send Transactions</NavLink>
                </li>
                <li>
                  <NavLink to={'/mine'}>Mine</NavLink>
                </li>
              </>
            )}
          </ul>
          {user && (
            <>
              <ul className="right-nav">
                <li>
                  <button onClick={logout}>Logout</button>
                </li>
              </ul>
            </>
          )}
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
      <footer></footer>
    </div>
  );
};
