import { useEffect, useRef, useState } from "react";
import { FiChevronDown, FiUser } from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import AuthModal from "../../../features/auth/components/AuthModal/AuthModal";
import { useLogout } from "../../../features/auth/hooks/useLogout";
import SearchBar from "./SearchBar";
import styles from "./Header.module.css";

const Header = () => {
  const { user, isAuthenticated } = useAuth();
  const { logout } = useLogout();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState("login");
  const dropdownRef = useRef(null);

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (location.state?.openAuth) {
      setAuthModalMode(location.state.openAuth);
      setAuthModalOpen(true);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  return (
    <>
      <header className={styles.header}>
        <div className={styles.container}>
          <div className={styles.leftSection}>
            {isAuthenticated && location.pathname !== "/" ? (
              <span className={styles.logo}>
                {user?.profile?.blogName || "쭈로그"}
              </span>
            ) : (
              <Link to="/" className={styles.logo}>
                쭈로그
              </Link>
            )}
          </div>

          <nav className={styles.nav}>
            <Link
              to="/"
              className={`${styles.navLink} ${
                location.pathname === "/" ? styles.active : ""
              }`}
            >
              홈
            </Link>
            <Link
              to="/my-blog"
              className={`${styles.navLink} ${
                location.pathname === "/my-blog" ? styles.active : ""
              }`}
            >
              내 블로그
            </Link>
          </nav>

          <div className={styles.rightSection}>
            <SearchBar />
            {isAuthenticated && user ? (
              <>
                {location.pathname === "/my-blog" && (
                  <Link to="/posts/write" className={styles.writeButton}>
                    글쓰기
                  </Link>
                )}
                <div className={styles.profileContainer} ref={dropdownRef}>
                  <button
                    className={styles.avatarButton}
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    <div className={styles.avatar}>
                      {user?.profile?.avatar ? (
                        <img src={user.profile.avatar} alt={user.profile.nickname} className={styles.avatarImage} />
                      ) : (
                        <FiUser size={24} />
                      )}
                    </div>
                    <FiChevronDown className={styles.dropdownIcon} size={12} />
                  </button>

                  {dropdownOpen && (
                    <div className={styles.dropdown}>
                      <Link
                        to="/settings"
                        className={styles.dropdownItem}
                        onClick={() => setDropdownOpen(false)}
                      >
                        설정
                      </Link>
                      <Link
                        to="/categories"
                        className={styles.dropdownItem}
                        onClick={() => setDropdownOpen(false)}
                      >
                        카테고리
                      </Link>
                      <button
                        onClick={handleLogout}
                        className={styles.dropdownItem}
                      >
                        로그아웃
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <button
                onClick={() => {
                  setAuthModalMode("login");
                  setAuthModalOpen(true);
                }}
                className={styles.authButton}
              >
                로그인
              </button>
            )}
          </div>
        </div>
      </header>
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authModalMode}
      />
    </>
  );
};

export default Header;
