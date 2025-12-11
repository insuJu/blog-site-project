import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../../contexts/AuthContext";
import CommentSection from "../../../comment/components/CommentSection/CommentSection";
import { useComments } from "../../../comment/hooks/useComments";
import { usePost } from "../../hooks/usePost";
import styles from "./PostDetailPage.module.css";
import { IoIosHeart, IoIosHeartEmpty } from "react-icons/io";
import { useLike } from "../../../like/hooks/useLike";
import { useEffect } from "react";

const PostDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { post, loading, error, update, remove, reload } = usePost(id);
  const { liked, toggle: toggleLike, checkLiked } = useLike('post', id);
  const comments = useComments(id);

  useEffect(() => {
    if (id && user) {
      checkLiked();
    }
  }, [id, user, checkLiked]);

  const handleLike = async () => {
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }

    const scrollPosition = window.scrollY;

    await toggleLike(id);
    await reload();

    requestAnimationFrame(() => {
      window.scrollTo(0, scrollPosition);
    });
  };

  const handleEdit = () => {
    navigate(`/posts/${id}/edit`);
  };

  const handleDelete = async () => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      const success = await remove(id);
      if (success) {
        navigate("/");
      } else {
        alert("게시글 삭제에 실패했습니다.");
      }
    }
  };

  const handleToggleVisibility = async () => {
    const result = await update(id, {
      title: post.title,
      content: post.content,
      categoryId: post.category?.id || null,
      tagNames: post.tags?.map((t) => t.name) || [],
      isPublic: !post.isPublic,
    });

    if (result.success) {
      await reload();
    } else {
      console.error("Failed to update visibility");
      alert("공개 설정 변경에 실패했습니다.");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}.${month}.${day} ${hours}:${minutes}`;
  };

  const renderContent = (content) => {
    if (!content) return "";

    const hasHtmlHeadings =
      content.includes("<h1>") ||
      content.includes("<h2>") ||
      content.includes("<h3>");
    const hasConvertedCodeBlocks = content.includes("<pre><code");
    const hasRawCodeBlocks = content.includes("```");

    if (hasHtmlHeadings && hasConvertedCodeBlocks && !hasRawCodeBlocks) {
      return content;
    }

    let html = content;
    
    html = html.replace(/<br\s*\/?>/gi, "\n");

    html = html
      .split("\n")
      .map((line) => line.trim())
      .join("\n");

    const codeBlocks = [];
    html = html.replace(/```(\w+)?\s*\n([\s\S]*?)```/g, (match, lang, code) => {
      const placeholder = `___CODE_BLOCK_${codeBlocks.length}___`;
      codeBlocks.push(
        `<pre><code class="language-${
          lang || "plaintext"
        }">${code.trim()}</code></pre>`
      );
      return placeholder;
    });

    const inlineCodes = [];
    html = html.replace(/`([^`]+)`/g, (match, code) => {
      const placeholder = `___INLINE_CODE_${inlineCodes.length}___`;
      inlineCodes.push(`<code>${code}</code>`);
      return placeholder;
    });

    html = html.replace(/^###\s+(.+)$/gm, "<h3>$1</h3>");
    html = html.replace(/^##\s+(.+)$/gm, "<h2>$1</h2>");
    html = html.replace(/^#\s+(.+)$/gm, "<h1>$1</h1>");

    html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");
    html = html.replace(/~~(.+?)~~/g, "<del>$1</del>");

    html = html.replace(
      /!\[([^\]]*)\]\(([^)]+)\)/g,
      '<img src="$2" alt="$1" />'
    );
    html = html.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
    );

    html = html.replace(/^- (.+)$/gm, "<li>$1</li>");
    html = html.replace(/(<li>[\s\S]*?<\/li>)/g, "<ul>$1</ul>");

    html = html.replace(/^> (.+)$/gm, "<blockquote>$1</blockquote>");

    html = html
      .split("\n\n")
      .map((para) => {
        if (para.trim().startsWith("<")) {
          return para;
        }
        if (!para.trim()) {
          return "";
        }
        return `<p>${para.replace(/\n/g, "<br>")}</p>`;
      })
      .join("\n");

    inlineCodes.forEach((code, index) => {
      html = html.replace(`___INLINE_CODE_${index}___`, code);
    });
    codeBlocks.forEach((code, index) => {
      html = html.replace(`___CODE_BLOCK_${index}___`, code);
    });

    return html;
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>게시글을 불러오는 중...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className={styles.notFound}>
        <h2>{error || "게시글을 찾을 수 없습니다."}</h2>
        <button onClick={() => navigate("/")}>홈으로 돌아가기</button>
      </div>
    );
  }

  const isAuthor = user && user.id === post.author.id;

  return (
    <div className={styles.postDetailPage}>
      <div className={styles.container}>
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          ← 목록으로
        </button>

        <article className={styles.post}>
          <header className={styles.postHeader}>
            {post.category && (
              <div className={styles.categoryBadge}>{post.category.name}</div>
            )}
            <h1 className={styles.title}>{post.title}</h1>

            <div className={styles.meta}>
              <div className={styles.authorInfo}>
                <div className={styles.avatar}>
                  {post.author.nickname.charAt(0)}
                </div>
                <div className={styles.authorDetails}>
                  <span className={styles.authorName}>
                    {post.author.nickname}
                  </span>
                  <span className={styles.date}>
                    {formatDate(post.createdAt)}
                  </span>
                </div>
              </div>

              <div className={styles.stats}>
                <span>조회 {post.viewCount}</span>
                <span>·</span>
                <span>좋아요 {post.likeCount}</span>
              </div>
            </div>

            {post.tags && post.tags.length > 0 && (
              <div className={styles.tags}>
                {post.tags.map((tag) => (
                  <Link
                    key={tag.id}
                    to={`/tags/${tag.name}`}
                    className={styles.tag}
                  >
                    #{tag.name}
                  </Link>
                ))}
              </div>
            )}
          </header>

          <div className={styles.content}>
            <div
              className={styles.contentText}
              dangerouslySetInnerHTML={{ __html: renderContent(post.content) }}
            />
          </div>

          <div className={styles.actions}>
            <button
              className={`${styles.likeButton} ${liked ? styles.liked : ""}`}
              onClick={handleLike}
            >
              {liked ? <IoIosHeart /> : <IoIosHeartEmpty />} {post.likeCount}
            </button>

            {isAuthor && (
              <div className={styles.authorActions}>
                <button className={styles.actionButton} onClick={handleEdit}>
                  수정
                </button>
                <button className={styles.actionButton} onClick={handleDelete}>
                  삭제
                </button>
                <button
                  className={styles.actionButton}
                  onClick={handleToggleVisibility}
                >
                  {post.isPublic ? "비공개로 전환" : "공개로 전환"}
                </button>
              </div>
            )}
          </div>
        </article>

        <CommentSection
          postId={id}
          comments={comments}
          postAuthorId={post?.author?.id}
        />
      </div>
    </div>
  );
};

export default PostDetailPage;
