import React from "react";
import { Routes, Route } from "react-router-dom";
import PublicLayout from "./ui/layout/publicLayout";
import LoginPage from "./pages/authentication/LoginPage";
import NotFoundPage from "./pages/UX/NotFoundPage";
import PrivateLayout from "./ui/layout/privateLayout";
import HomePage from "./pages/UX/HomePage";
import GoogleOauthCallBackPage from "./pages/authentication/GoogleOauthCallBackPage";
import UauthorisedPage from "./pages/UX/UauthorisedPage";
import RequireAuth from "./features/authentication/components/RequireAuth";
import RegisterPage from "./pages/authentication/RegisterPage";

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/auth/register" element={<RegisterPage />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route
          path="/auth/oauth/google/callback"
          element={<GoogleOauthCallBackPage />}
        />
      </Route>

      <Route element={<RequireAuth allowedRoles={[2005, 2009]} />}>
        <Route element={<PrivateLayout />}>
          <Route path="/" element={<HomePage />} />
        </Route>
        <Route path="/unauthorized" element={<UauthorisedPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}