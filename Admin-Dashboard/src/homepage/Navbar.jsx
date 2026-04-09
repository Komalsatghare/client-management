import { useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();

  /* ------------------ Navigation Handler ------------------ */
  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <>
      {/* ------------------ Styles ------------------ */}
      <style>
        {`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          .navbar {
            height: 72px;
            background-color: #ffffff;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 48px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
            font-family: "Segoe UI", sans-serif;
            position: sticky;
            top: 0;
            z-index: 100;
          }

          .logo {
            display: flex;
            align-items: center;
            gap: 10px;
            cursor: pointer;
          }

          .logo-icon {
            font-size: 24px;
          }

          .logo-text {
            font-size: 19px;
            font-weight: 700;
            color: #1f1f1f;
            letter-spacing: 0.3px;
          }

          .nav-links {
            list-style: none;
            display: flex;
            align-items: center;
            gap: 28px;
          }

          .nav-links li {
            cursor: pointer;
            font-size: 16px;
            font-weight: 500;
            color: #2f2f2f;
            transition: color 0.25s ease;
          }

          .nav-links li:hover {
            color: #b07a2a;
          }

          .signup {
            padding: 7px 16px;
            border: 1.5px solid #b07a2a;
            border-radius: 6px;
          }

          .login {
            padding: 7px 16px;
            background-color: #b07a2a;
            color: #ffffff;
            border-radius: 6px;
          }
        `}
      </style>

      {/* ------------------ Navbar ------------------ */}
      <nav className="navbar">

        {/* Left: Logo */}
        <div
          className="logo"
          onClick={() => handleNavigate("/")}
        >
          <span className="logo-icon">🏗️</span>
          <span className="logo-text">Dhanvij Builders</span>
        </div>

        {/* Right: Navigation */}
        <ul className="nav-links">
          <li onClick={() => handleNavigate("/services")}>Services</li>
          <li onClick={() => handleNavigate("/projects")}>Projects</li>
          <li onClick={() => handleNavigate("/about")}>About</li>
          <li
            className="signup"
            onClick={() => handleNavigate("/signup")}
          >
            Sign Up
          </li>
          <li
            className="login"
            onClick={() => handleNavigate("/login")}
          >
            Login
          </li>
        </ul>

      </nav>
    </>
  );
}

export default Navbar;
