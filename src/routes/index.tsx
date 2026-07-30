import { Routes, Route, Navigate } from "react-router-dom";
import { PublicLayout } from "../layouts/PublicLayout";
import { AuthLayout } from "../layouts/AuthLayout";
import { DashboardLayout } from "../layouts/DashboardLayout";

// Lazy-loaded or directly imported pages
import LandingPage from "../pages/Landing";
import LoginPage from "../pages/Login";
import RegisterPage from "../pages/Register";
import DashboardPage from "../pages/Dashboard";
import NotFoundPage from "../pages/NotFound";

import BookingsPage from "../pages/Dashboard/Bookings";
import AvailabilityPage from "../pages/Dashboard/Availability";
import SettingsPage from "../pages/Dashboard/Settings";
import CalendarPage from "../pages/Dashboard/Calendar";
import AnalyticsPage from "../pages/Dashboard/Analytics";
import OnboardingPage from "../pages/Onboarding";
import EventEditPage from "../pages/Dashboard/EventEdit";
import BookingPage from "../pages/Booking";
import DemoPreviewPage from "../pages/Preview";
import BlogsPage from "../pages/Blogs";
import BlogPostDetailPage from "../pages/Blogs/BlogPostDetail";

export function AppRoutes() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/blogs" element={<BlogsPage />} />
        <Route path="/blogs/:slug" element={<BlogPostDetailPage />} />
        <Route path="/features" element={<div className="py-20 text-center text-ink font-bold">Features (Coming Soon)</div>} />
        <Route path="/pricing" element={<div className="py-20 text-center text-ink font-bold">Pricing (Coming Soon)</div>} />
        <Route path="/integrations" element={<div className="py-20 text-center text-ink font-bold">Integrations (Coming Soon)</div>} />
      </Route>

      {/* Auth Pages */}
      <Route element={<AuthLayout />}>
        <Route path="/login/*" element={<LoginPage />} />
        <Route path="/register/*" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Protected Dashboard Pages */}
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dashboard/bookings" element={<BookingsPage />} />
        <Route path="/dashboard/availability" element={<AvailabilityPage />} />
        <Route path="/dashboard/calendar" element={<CalendarPage />} />
        <Route path="/dashboard/settings" element={<SettingsPage />} />
        <Route path="/dashboard/analytics" element={<AnalyticsPage />} />
      </Route>

      {/* Standalone Protected Pages */}
      <Route path="/dashboard/events/:id/edit" element={<EventEditPage />} />
      <Route path="/onboard" element={<OnboardingPage />} />
      <Route path="/onboarding" element={<Navigate to="/onboard" replace />} />
      <Route path="/book/:username/:slug" element={<BookingPage />} />
      <Route path="/booking/:bookingId/cancel" element={<BookingPage action="cancel" />} />
      <Route path="/booking/:bookingId/reschedule" element={<BookingPage action="reschedule" />} />
      <Route path="/preview" element={<DemoPreviewPage />} />

      {/* Catch-all 404 Route */}
      <Route element={<PublicLayout />}>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
