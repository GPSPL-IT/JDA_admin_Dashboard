import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";
import LoadingSpinner from "./components/LoadingSpinner";

// Lazy load components for better performance
const Layout = lazy(() => import("./components/Layout"));
const Home = lazy(() => import("./pages/Home"));
const Report = lazy(() => import("./pages/Report"));
const Admin = lazy(() => import("./pages/Admin"));
const Events = lazy(() => import("./pages/Events"));
const Gallary = lazy(() => import("./pages/Gallary"));
const AdminLayout = lazy(() => import("./components/admin/AdminLayout"));
const ZoneDetails = lazy(() => import("./components/ZoneDetails"));
const SpeciesDetails = lazy(() => import("./components/SpeciesDetails"));

// Loading component for Suspense fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <LoadingSpinner />
  </div>
);

const App = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={
                <Layout>
                  <Home />
                </Layout>
              } />
              <Route path="/reports" element={
                <Layout>
                  <Report />
                </Layout>
              } />
              <Route path="/events" element={
                <Layout>
                  <Events />
                </Layout>
              } />
              <Route path="/gallery" element={
                <Layout>
                  <Gallary />
                </Layout>
              } />

              {/* Details Routes */}
              <Route path="/zone/:zoneName" element={
                <Layout>
                  <ZoneDetails />
                </Layout>
              } />
              <Route path="/species/:speciesName" element={
                <Layout>
                  <SpeciesDetails />
                </Layout>
              } />

              {/* Admin Routes */}
              <Route path="/admin" element={
                <Layout>
                  <Admin />
                </Layout>
              } />
              <Route path="/admin/dashboard/*" element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              } />

              {/* Catch all route - redirect to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
