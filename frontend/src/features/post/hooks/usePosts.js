import { useState, useEffect, useCallback } from 'react';
import { getAllPosts, getPostsByAuthor, getPostsByCategory, getPostsByTag, searchPosts } from '../api/postApi';

export const usePosts = ({ type = 'all', authorId, categoryId, tagName, keyword, params = {} } = {}) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadPosts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let data;

      switch (type) {
        case 'author':
          if (!authorId) throw new Error('authorId is required for type="author"');
          data = await getPostsByAuthor(authorId, params);
          break;
        case 'category':
          if (!categoryId) throw new Error('categoryId is required for type="category"');
          data = await getPostsByCategory(categoryId, params);
          break;
        case 'tag':
          if (!tagName) throw new Error('tagName is required for type="tag"');
          data = await getPostsByTag(tagName, params);
          break;
        case 'search':
          if (!keyword) throw new Error('keyword is required for type="search"');
          data = await searchPosts(keyword, params);
          break;
        case 'all':
        default:
          data = await getAllPosts(params);
          break;
      }

      setPosts(data || []);
    } catch (err) {
      console.error('Failed to load posts:', err);
    } finally {
      setLoading(false);
    }
  }, [type, authorId, categoryId, tagName, keyword, JSON.stringify(params)]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  return {
    posts,
    loading,
    error,
    reload: loadPosts
  };
};
