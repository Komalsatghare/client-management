import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import DashboardLayout from "./Dashboard/DashboardLayout";
import LoginPage from "./homepage/Login/Login";
import LoginChoice from "./homepage/Login/LoginChoice";
import Homepage1 from "./homepage/Home/Homepage1";
import Projects from "./homepage/Projects/Projects"; // Import Projects page
import SignUp from "./homepage/SignUp/SignUp";
import Services from "./homepage/Services/Services";
import AboutPage from "./homepage/About/AboutPage";

import ProtectedRoute from "./ProtectedRoute";

// Client Dashboard Imports
import ClientLogin from "./homepage/ClientLogin/ClientLogin";
import ClientSignup from "./homepage/ClientSignup/ClientSignup";
import ClientProtectedRoute from "./ClientProtectedRoute";
import ClientDashboardLayout from "./ClientDashboard/ClientDashboardLayout";

function App() {
  return (
    <LanguageProvider>
      <Routes>
        <Route path="/" element={<Homepage1 />} />
        <Route path="/projects" element={<Projects />} /> {/* Add Projects route */}
        <Route path="/services" element={<Services />} />
        <Route path="/about" element={<AboutPage />} />
        {/* <Route path="/" element={<Navigate to="/admin-dashboard" replace />} /> */}

        {/* Auth Routes */}
        <Route path="/login" element={<LoginChoice />} />
        <Route path="/admin-login" element={<LoginPage />} />
        <Route path="/signup" element={<ClientSignup />} />
        <Route path="/client-login" element={<ClientLogin />} />

        {/* Protect the admin dashboard route */}
        <Route
          path="/admin-dashboard/*"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        />

        {/* Protect the client dashboard route */}
        <Route
          path="/client-dashboard/*"
          element={
            <ClientProtectedRoute>
              <ClientDashboardLayout />
            </ClientProtectedRoute>
          }
        />
      </Routes>
    </LanguageProvider>
  );
}

export default App;
