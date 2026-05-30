import { useState } from "react";
import { data } from "../restApi.json";
import { Link } from "react-scroll";
import { GiHamburgerMenu } from "react-icons/gi";
import { useAuth } from "../context/AuthContext";
import GoogleLoginButton from "./GoogleLoginButton";

const Navbar = () => {
  const [show, setShow] = useState(false);
  const { user, logout } = useAuth();

  return (
    <nav>
      <div className="logo">
        <img src="./home.png" alt="logo" className="logoImg" width="100" height="100" />
      </div>

      <div className={show ? "navLinks showmenu" : "navLinks"}>
        <div className="links">
          {data[0].navbarLinks.map((element) => (
            <Link
              to={element.link}
              spy={true}
              smooth={true}
              duration={500}
              key={element.id}
            >
              {element.title}
            </Link>
          ))}
        </div>
        <Link to="menu" spy={true} smooth={true} duration={500} className="menuBtn">
          OUR MENU
        </Link>
      </div>

      {/* ── Auth section ── */}
      <div className="navAuth" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {user ? (
          // Logged in — show avatar + name + logout
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <img
              src={user.picture}
              alt={user.name}
              referrerPolicy="no-referrer"
              style={{ width: 36, height: 36, borderRadius: "50%", border: "2px solid #c8a96e" }}
            />
            <span style={{ color: "#fff", fontSize: "13px", fontWeight: 500 }}>
              {user.name.split(" ")[0]}
            </span>
            <button
              onClick={logout}
              style={{
                background: "transparent",
                border: "1px solid #c8a96e",
                color: "#c8a96e",
                padding: "4px 10px",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "12px",
              }}
            >
              Logout
            </button>
          </div>
        ) : (
          // Not logged in — show Google button
          <GoogleLoginButton />
        )}
      </div>

      <div className="hamburger" onClick={() => setShow(!show)}>
        <GiHamburgerMenu />
      </div>
    </nav>
  );
};

export default Navbar;