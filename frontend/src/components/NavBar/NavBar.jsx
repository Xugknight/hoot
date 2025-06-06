import { NavLink, Link } from 'react-router';
import { logOut } from '../../services/authService';
import './NavBar.css';

export default function NavBar({ user, setUser }) {

  function handleLogOut() {
    logOut();
    setUser(null);
  }

  return (
    <nav className="NavBar">
      <NavLink to="/">HOME</NavLink>
      &nbsp; | &nbsp;
      {user ? (
        <>
          <NavLink to="/hoots" end>
            HOOTS
          </NavLink>
          &nbsp; | &nbsp;
          <NavLink to="/hoots/new">NEW HOOT</NavLink>
          &nbsp; | &nbsp;
          <Link to="/" onClick={handleLogOut}>SIGN OUT</Link>
          <span>Welcome, {user.name}</span>
        </>
      ) : (
        <>
          <NavLink to="/login">SIGN IN</NavLink>
          &nbsp; | &nbsp;
          <NavLink to="/signup">SIGN UP</NavLink>
        </>
      )}
    </nav>
  );
}