import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import axios from "axios";
import { toast } from "react-toastify";
import { Context } from "../main";
import PropTypes from "prop-types";
import withNavbarEnhancements from "../hoc/withNavbarEnhancements";

const Navbar = ({
  isLoggingOut,
  enhancedHandleLogout,
  handleLinkHover,
  handleLinkLeave,
  hoveredLink,
}) => {
  const [show, setShow] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { isAuthenticated, setIsAuthenticated, user } = useContext(Context);

  const navigateTo = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await axios.get(
        "http://localhost:4000/api/v1/user/patient/logout",
        { withCredentials: true }
      );
      toast.success(res.data.message);
      setIsAuthenticated(false);
      goToLogin();
    } catch (err) {
      toast.error(err.response?.data?.message || "Đăng xuất thất bại");
    }
  };

  const goToLogin = () => {
    navigateTo("/login");
  };

// Adapter Pattern: Sử dụng fullName từ dữ liệu đã chuẩn hóa bởi UserAdapter (chuyển giao diện từ API sang UI)
  const displayUserName = user?.fullName || "User";

  const linkMapping = {
    "Trang chủ": "/",
    "Lịch hẹn": "/appointment",
    "Tiểu sử": "/about",
  };

  return (
    <>
      <nav className="container">
        <div className="logo">
          <img src="/Happy Teeth.png" alt="logo" className="logo-img" />
        </div>
        <div className={show ? "navLinks showmenu" : "navLinks"}>
          <div className="links">
            {["Trang chủ", "Lịch hẹn", "Tiểu sử"].map((link, index) => (
              <Link
                key={index}
                to={linkMapping[link]}
                onClick={() => setShow(!show)}
                onMouseEnter={() => handleLinkHover(link)} // Decorator Pattern: Sử dụng handleLinkHover từ HOC
                onMouseLeave={handleLinkLeave} // Decorator Pattern: Sử dụng handleLinkLeave từ HOC
                style={{
                  color: hoveredLink === link ? "#007bff" : "#222", // Decorator Pattern: Sử dụng hoveredLink từ HOC
                  transition: "color 0.3s ease",
                }}
              >
                {link}
              </Link>
            ))}
          </div>
          {isAuthenticated ? (
            <div
              className="user-info"
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <span className="user-name">{displayUserName}</span>
              {dropdownOpen && (
                <div className="dropdown">
                  {[
                    { label: "Trạng thái lịch hẹn", path: "/appointmentstatus" },
                    { label: "Thông tin cá nhân", path: "/profile" },
                    { label: "Lịch sử khám bệnh", path: "/medical-record" },
                  ].map((item, index) => (
                    <Link
                      key={index}
                      to={item.path}
                      onClick={() => setShow(!show)}
                      onMouseEnter={() => handleLinkHover(item.label)} // Decorator Pattern: Sử dụng handleLinkHover từ HOC
                      onMouseLeave={handleLinkLeave} // Decorator Pattern: Sử dụng handleLinkLeave từ HOC
                      style={{
                        backgroundColor:
                          hoveredLink === item.label ? "#f5f5f5" : "transparent", // Decorator Pattern: Sử dụng hoveredLink từ HOC
                        transition: "background-color 0.3s ease",
                      }}
                    >
                      {item.label}
                    </Link>
                  ))}
                  <button
                    className="logoutBtn btn"
                    onClick={() => enhancedHandleLogout(handleLogout)} // Decorator Pattern: Sử dụng enhancedHandleLogout từ HOC
                    disabled={isLoggingOut} // Decorator Pattern: Sử dụng isLoggingOut từ HOC
                    onMouseEnter={() => handleLinkHover("Đăng xuất")} // Decorator Pattern: Sử dụng handleLinkHover từ HOC
                    onMouseLeave={handleLinkLeave} // Decorator Pattern: Sử dụng handleLinkLeave từ HOC
                    style={{
                      backgroundColor:
                        hoveredLink === "Đăng xuất" ? "#f5f5f5" : "transparent", // Decorator Pattern: Sử dụng hoveredLink từ HOC
                      transition: "background-color 0.3s ease",
                      cursor: isLoggingOut ? "not-allowed" : "pointer",
                    }}
                  >
                    {isLoggingOut ? "Đang đăng xuất..." : "Đăng xuất"}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button className="loginBtn btn" onClick={goToLogin}>
              Đăng nhập
            </button>
          )}
        </div>
        <div className="hamburger" onClick={() => setShow(!show)}>
          <GiHamburgerMenu />
        </div>
      </nav>
    </>
  );
};

Navbar.propTypes = {
  isLoggingOut: PropTypes.bool.isRequired,
  enhancedHandleLogout: PropTypes.func.isRequired,
  handleLinkHover: PropTypes.func.isRequired,
  handleLinkLeave: PropTypes.func.isRequired,
  hoveredLink: PropTypes.string,
};

// Decorator Pattern: Áp dụng HOC withNavbarEnhancements để mở rộng chức năng của Navbar
const EnhancedNavbar = withNavbarEnhancements(Navbar);
EnhancedNavbar.displayName = "EnhancedNavbar";

export default EnhancedNavbar;