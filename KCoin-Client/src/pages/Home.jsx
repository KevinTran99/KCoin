import { useAuth } from '../context/AuthContext';
import '../styles/home.css';

export const Home = () => {
  const { user } = useAuth();

  return (
    <>
      {user ? (
        <div className="home">
          <h1>
            Welcome back to KCoin <br />
            {user.name}
          </h1>

          <h2>User info:</h2>
          <ul>
            <li>Role: {user.role}</li>
            <li>Email: {user.email}</li>
          </ul>
        </div>
      ) : (
        <h1>Welcome to KCoin</h1>
      )}
    </>
  );
};
