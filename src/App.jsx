/**
 * Root application component.
 *
 * Defines the client-side routing structure of the application
 * using React Router DOM. Each route maps a URL path to its
 * corresponding page component.
 *
 * Public routes (no authentication required):
 * - /login    → Login page
 * - /register → Register page
 *
 * The root path "/" redirects automatically to "/login".
 *
 * Note: Protected routes (home, profile, edit-profile) will be
 * incorporated in subsequent iterations as the application grows.
 */

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirects the root path to the login page by default. */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Public route: accessible without authentication. */}
        <Route path="/register" element={<Register />} />

        {/* Public route: accessible without authentication. */}
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}