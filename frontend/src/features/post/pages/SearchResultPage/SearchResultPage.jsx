import { useEffect, useState } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import { useNavigate, useSearchParams } from "react-router-dom";
import { searchPosts, searchPostsByAuthor } from "../../api/postApi";
import PostGridList from "../../components/PostList/PostGridList";
import styles from "./SearchResultPage.module.css";

const SearchResultPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialKeyword = searchParams.get("keyword") || "";
  const authorId = searchParams.get("authorId");

  const [keyword, setKeyword] = useState(initialKeyword);
  const [posts, setPosts] = useState({});
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [initialKeyword, authorId]);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!initialKeyword.trim()) {
        setPosts({});
        return;
      }

      setLoading(true);
      try {
        let data;
        if (authorId) {
          data = await searchPostsByAuthor(authorId, initialKeyword, { 
            page: currentPage - 1 
          });
        } else {
          data = await searchPosts(initialKeyword, { 
            page: currentPage - 1 
          });
        }
        setPosts(data || {});
      } catch (error) {
        console.error('Failed to search posts:', error);
        setPosts({});
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [initialKeyword, authorId, currentPage]);

  const handleSearch = () => {
    if (!keyword.trim()) return;

    const params = new URLSearchParams();
    params.set("keyword", keyword);
    if (authorId) {
      params.set("authorId", authorId);
    }

    navigate(`/search?${params.toString()}`);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleClear = () => {
    setKeyword("");
  };

  return (
    <div className={styles.searchResultPage}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>게시글 검색</h1>

          <div className={styles.searchInputWrapper}>
            <FiSearch className={styles.searchIcon} size={20} />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="검색어를 입력하세요..."
              className={styles.searchInput}
              autoFocus
            />
            {keyword && (
              <button
                className={styles.clearButton}
                onClick={handleClear}
                aria-label="지우기"
              >
                <FiX size={20} />
              </button>
            )}
          </div>

          {initialKeyword && !loading && (
            <p className={styles.resultCount}>
              "{initialKeyword}" 검색 결과: 총 {posts.totalElements || 0}개의 게시글
            </p>
          )}
        </div>

        {!loading && (!posts.content || posts.content.length === 0) && initialKeyword && (
          <div className={styles.emptyState}>
            <p className={styles.emptyMessage}>검색 결과가 없습니다.</p>
            <p className={styles.emptyHint}>다른 키워드로 검색해보세요.</p>
          </div>
        )}

        <PostGridList 
          posts={posts} 
          loading={loading} 
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default SearchResultPage;