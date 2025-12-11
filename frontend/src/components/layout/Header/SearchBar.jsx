import { useEffect, useRef, useState } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import styles from "./SearchBar.module.css";

const SearchBar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  const searchRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
        setKeyword("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSearch = () => {
    if (!keyword.trim()) return;

    const params = new URLSearchParams();
    params.set("keyword", keyword);

    if (location.pathname === "/my-blog" && user) {
      params.set("authorId", user.id);
    } else if (location.pathname.startsWith("/blog/")) {
      const authorId = location.pathname.split("/")[2];
      params.set("authorId", authorId);
    }

    navigate(`/search?${params.toString()}`);
    setIsOpen(false);
    setKeyword("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleClear = () => {
    setKeyword("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className={styles.searchContainer} ref={searchRef}>
      {!isOpen ? (
        <button
          className={styles.searchButton}
          onClick={() => setIsOpen(true)}
          aria-label="검색"
        >
          <FiSearch size={20} />
        </button>
      ) : (
        <div className={styles.searchInputWrapper}>
          <FiSearch className={styles.searchIcon} size={18} />
          <input
            ref={inputRef}
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="게시글 검색..."
            className={styles.searchInput}
          />
          {keyword && (
            <button
              className={styles.clearButton}
              onClick={handleClear}
              aria-label="지우기"
            >
              <FiX size={18} />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
