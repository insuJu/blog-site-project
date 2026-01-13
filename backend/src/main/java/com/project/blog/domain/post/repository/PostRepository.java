package com.project.blog.domain.post.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.project.blog.domain.post.entity.Post;

public interface PostRepository extends JpaRepository<Post, Long> {

        Page<Post> findAll(Pageable pageable);

        Page<Post> findByIsPublicTrue(Pageable pageable);

        Page<Post> findByAuthorId(Long authorId, Pageable pageable);

        Page<Post> findByAuthorIdAndIsPublicTrue(Long authorId, Pageable pageable);

        Page<Post> findByCategoryId(Long categoryId, Pageable pageable);

        Page<Post> findByCategoryIdAndIsPublicTrue(Long categoryId, Pageable pageable);

        Page<Post> findByTitleContaining(String keyword, Pageable pageable);

        @Query("SELECT DISTINCT p FROM Post p JOIN p.tags t WHERE t.name = :tagName AND p.isPublic = true")
        Page<Post> findPublicByTagName(@Param("tagName") String tagName, Pageable pageable);

        @Query("SELECT DISTINCT p FROM Post p " +
                        "LEFT JOIN FETCH p.author a " +
                        "LEFT JOIN FETCH a.profile " +
                        "LEFT JOIN FETCH p.category " +
                        "LEFT JOIN FETCH p.tags " +
                        "WHERE p.id = :id")
        Post findByIdWithDetails(@Param("id") Long id);

        @Query("SELECT p FROM Post p WHERE (p.title LIKE %:keyword% OR p.content LIKE %:keyword%) AND p.isPublic = true")
        Page<Post> searchPublicByTitleOrContent(@Param("keyword") String keyword, Pageable pageable);

        @Query("SELECT p FROM Post p WHERE p.author.id = :authorId AND (p.title LIKE %:keyword% OR p.content LIKE %:keyword%)")
        Page<Post> searchByAuthorIdAndTitleOrContent(@Param("authorId") Long authorId, @Param("keyword") String keyword,
                        Pageable pageable);

        @Query("SELECT p FROM Post p WHERE p.author.id = :authorId AND (p.title LIKE %:keyword% OR p.content LIKE %:keyword%) AND p.isPublic = true")
        Page<Post> searchPublicByAuthorIdAndTitleOrContent(@Param("authorId") Long authorId,
                        @Param("keyword") String keyword, Pageable pageable);

        @Query("SELECT COALESCE(SUM(p.viewCount), 0) FROM Post p")
        Long sumViewCount();

        boolean existsByCategoryId(Long categoryId);

        @Query("SELECT CASE WHEN COUNT(p) > 0 THEN true ELSE false END FROM Post p JOIN p.tags t WHERE t.id = :tagId")
        boolean existsByTagsId(@Param("tagId") Long tagId);

        Long countByAuthorId(Long authorId);
}
