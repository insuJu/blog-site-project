import { Route, Routes } from "react-router-dom";
import Footer from "../components/layout/Footer/Footer";
import Header from "../components/layout/Header/Header";
import Layout from "../components/layout/Layout";
import ProtectedRoute from "../components/routes/ProtectedRoute";
import ChatPage from "../features/chat/pages/ChatPage/ChatPage";
import CategoryListPage from "../features/category/pages/CategoryListPage/CategoryListPage";
import IndexPage from "../features/post/pages/IndexPage/IndexPage";
import MyBlogPage from "../features/post/pages/MyBlogPage/MyBlogPage";
import PostDetailPage from "../features/post/pages/PostDetailPage/PostDetailPage";
import WritePage from "../features/post/pages/WritePage/WritePage";
import EditPage from "../features/post/pages/EditPage/EditPage";
import TagPostsPage from "../features/post/pages/TagPostsPage/TagPostsPage";
import SettingsPage from "../features/settings/pages/SettingsPage/SettingsPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            <Header />
            <IndexPage />
            <Footer />
          </>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Layout>
              <SettingsPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/posts/write"
        element={
          <ProtectedRoute>
            <Header />
            <WritePage />
            <Footer />
          </ProtectedRoute>
        }
      />

      <Route
        path="/posts/:id/edit"
        element={
          <ProtectedRoute>
            <Header />
            <EditPage />
            <Footer />
          </ProtectedRoute>
        }
      />

      <Route
        path="/posts/:id"
        element={
          <>
            <Header />
            <PostDetailPage />
            <Footer />
          </>
        }
      />

      <Route
        path="/my-blog"
        element={
          <ProtectedRoute>
            <Header />
            <MyBlogPage />
            <Footer />
          </ProtectedRoute>
        }
      />

      <Route
        path="/categories"
        element={
          <ProtectedRoute>
            <Header />
            <CategoryListPage />
            <Footer />
          </ProtectedRoute>
        }
      />

      <Route
        path="/tags/:tagName"
        element={
          <>
            <Header />
            <TagPostsPage />
            <Footer />
          </>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
