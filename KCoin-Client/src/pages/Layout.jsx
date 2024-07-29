import { NavLink, Outlet } from 'react-router-dom';
import '../styles/layout.css';

export const Layout = () => {
  return (
    <div className="wrapper">
      <header>
        <nav>
          <ul>
            <li>
              <NavLink to={'/'}>Home</NavLink>
            </li>
            <li>
              <NavLink to={'/login'}>Login</NavLink>
            </li>
            <li>
              <NavLink to={'/register'}>Register</NavLink>
            </li>
          </ul>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
      <footer></footer>
    </div>
  );
};
