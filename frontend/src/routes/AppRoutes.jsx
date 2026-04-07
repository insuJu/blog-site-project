import { Route, Routes } from "react-router-dom";
import Footer from "../components/layout/Footer/Footer";
import Header from "../components/layout/Header/Header";
import Layout from "../components/layout/Layout";
import AdminRoute from "../components/routes/AdminRoute";
import ProtectedRoute from "../components/routes/ProtectedRoute";
import AdminDashboardPage from "../features/admin/pages/AdminDashboardPage/AdminDashboardPage";
import OAuth2RedirectPage from "../features/auth/pages/OAuth2RedirectPage/OAuth2RedirectPage";
import ManagePage from "../features/manage/pages/ManagePage/ManagePage";
import EditPage from "../features/post/pages/EditPage/EditPage";
import IndexPage from "../features/post/pages/IndexPage/IndexPage";
import MyBlogPage from "../features/post/pages/MyBlogPage/MyBlogPage";
import PostDetailPage from "../features/post/pages/PostDetailPage/PostDetailPage";
import SearchResultPage from "../features/post/pages/SearchResultPage/SearchResultPage";
import TagPostsPage from "../features/post/pages/TagPostsPage/TagPostsPage";
import UserBlogPage from "../features/post/pages/UserBlogPage/UserBlogPage";
import WritePage from "../features/post/pages/WritePage/WritePage";
import SettingsPage from "../features/settings/pages/SettingsPage/SettingsPage";
import PrivacyPage from "../pages/PrivacyPage/PrivacyPage";
import TermsPage from "../pages/TermsPage/TermsPage";

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
        path="/oauth2/redirect"
        element={<OAuth2RedirectPage />}
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Header />
            <SettingsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/manage"
        element={
          <ProtectedRoute>
            <Header />
            <ManagePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/posts/write"
        element={
          <ProtectedRoute>
            <Header />
            <WritePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/posts/:id/edit"
        element={
          <ProtectedRoute>
            <Header />
            <EditPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/posts/:id"
        element={
          <>
            <Header />
            <PostDetailPage />
          </>
        }
      />

      <Route
        path="/my-blog"
        element={
          <ProtectedRoute>
            <Header />
            <MyBlogPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/users/:userId/blog"
        element={
          <>
            <Header />
            <UserBlogPage />
          </>
        }
      />

      <Route
        path="/tags/:tagName"
        element={
          <>
            <Header />
            <TagPostsPage />
          </>
        }
      />

      <Route
        path="/search"
        element={
          <>
            <Header />
            <SearchResultPage />
          </>
        }
      />

      <Route
        path="/admin"
        element={
          <AdminRoute>
            <Header />
            <AdminDashboardPage />
          </AdminRoute>
        }
      />

      <Route
        path="/terms"
        element={
          <>
            <Header />
            <TermsPage />
            <Footer />
          </>
        }
      />

      <Route
        path="/privacy"
        element={
          <>
            <Header />
            <PrivacyPage />
            <Footer />
          </>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
