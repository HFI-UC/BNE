import { Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "./layouts/MainLayout";
import { HomePage } from "./pages/HomePage";
import { ArchivePage } from "./pages/ArchivePage";
import { LoginPage } from "./pages/LoginPage";
import { BookingsPage } from "./pages/BookingsPage";
import { ResourcesPage } from "./pages/ResourcesPage";
import { AdminDashboard } from "./pages/AdminDashboard";
import { ArticleDetailPage } from "./pages/ArticleDetailPage";
import { ProtectedRoute } from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="archive" element={<ArchivePage />} />
        <Route path="articles/:slug" element={<ArticleDetailPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route
          path="bookings"
          element={
            <ProtectedRoute>
              <BookingsPage />
            </ProtectedRoute>
          }
        />
        <Route path="resources" element={<ResourcesPage />} />
        <Route
          path="admin"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
