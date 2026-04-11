import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Logout from "./pages/Logout";
import Profile from "./pages/Profile";
import ProfileEdit from "./pages/ProfileEdit.jsx";
import { getToken } from "./utils/auth";

export default function App() {
  const isAuthenticated = !!getToken();
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/home"
          element={
            isAuthenticated ? <Home /> : <Navigate to="/login" />
          }
        />
        <Route path="/logout" element={<Logout />} />
        <Route 
          path="/profile" 
          element={
            isAuthenticated ? <Profile /> : <Navigate to="/login" />
          } 
        />
        <Route 
          path="/profile/edit" 
          element={
            isAuthenticated ? <ProfileEdit /> : <Navigate to="/login" />
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}