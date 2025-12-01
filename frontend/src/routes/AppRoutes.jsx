import { Route, Routes } from "react-router-dom";
import Footer from "../components/layout/Footer/Footer";
import Header from "../components/layout/Header/Header";
import Layout from "../components/layout/Layout";
import ProtectedRoute from "../components/routes/ProtectedRoute";
import IndexPage from "../features/post/pages/IndexPage/IndexPage";
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
    </Routes>
  );
};

export default AppRoutes;
