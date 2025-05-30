import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import { Icons } from './lib/icons';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('React Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
          <div className="flex flex-col items-center space-y-4 p-8 text-center">
            <Icons.error className="h-16 w-16 text-destructive" />
            <h1 className="text-2xl font-bold text-destructive">Something went wrong</h1>
            <p className="text-muted-foreground">{this.state.error?.message}</p>
            <button
              className="mt-4 rounded-md bg-primary px-4 py-2 text-primary-foreground"
              onClick={() => window.location.reload()}
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Lazy load pages with proper relative paths
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'));
const ProfilePage = lazy(() => import('./pages/user/ProfilePage'));
const ClientsPage = lazy(() => import('./pages/pos/ClientsPage'));
const BusinessesPage = lazy(() => import('./pages/pos/BusinessesPage'));
const TransactionsPage = lazy(() => import('./pages/pos/TransactionsPage'));
const ComplaintsPage = lazy(() => import('./pages/pos/ComplaintsPage'));
const OnboardingPage = lazy(() => import('./pages/pos/OnboardingPage'));
const ActivityLogsPage = lazy(() => import('./pages/admin/ActivityLogsPage'));
const SupportTicketsPage = lazy(() => import('./pages/support/SupportTicketsPage'));
const WebsiteContentPage = lazy(() => import('./pages/admin/WebsiteContentPage'));
const BlogManagementPage = lazy(() => import('./pages/admin/BlogManagementPage'));
const ReportsAnalyticsPage = lazy(() => import('./pages/admin/ReportsAnalyticsPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));

const LoadingFallback = () => (
  <div className="flex h-screen w-full items-center justify-center bg-background">
    <div className="flex flex-col items-center space-y-4">
      <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      <p className="text-lg font-medium text-muted-foreground">Loading...</p>
    </div>
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route element={<Layout />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              
              {/* POS Management */}
              <Route path="/clients" element={<ClientsPage />} />
              <Route path="/businesses" element={<BusinessesPage />} />
              <Route path="/transactions" element={<TransactionsPage />} />
              <Route path="/complaints" element={<ComplaintsPage />} />
              <Route path="/onboarding" element={<OnboardingPage />} />

              {/* Administration */}
              <Route path="/activity-logs" element={<ActivityLogsPage />} />
              <Route path="/website-content" element={<WebsiteContentPage />} />
              <Route path="/blog" element={<BlogManagementPage />} />
              <Route path="/reports" element={<ReportsAnalyticsPage />} />
              
              {/* Support */}
              <Route path="/support-tickets" element={<SupportTicketsPage />} />
              
              {/* General */}
              <Route path="/settings" element={<SettingsPage />} />

              {/* Fallback for any other authenticated routes */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </Suspense>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
