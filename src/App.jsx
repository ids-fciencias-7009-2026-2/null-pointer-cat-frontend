import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Register from "./pages/Register"
import Login from "./pages/Login"
import Home from "./pages/Home"
import Logout from "./pages/Logout"
import Profile from "./pages/Profile"
import ProfileEdit from "./pages/ProfileEdit.jsx"
import MyAnimals from "./pages/MyAnimals"
import MyPosts from "./pages/MyPosts.jsx"
import RegisterAnimal from "./pages/RegisterAnimal"
import AnimalDetail from "./pages/AnimalDetail.jsx"
import { getToken } from "./utils/auth"

export default function App() {
  const isAuthenticated = !!getToken()

  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />

        {/* Rutas Protegidas */}
        <Route
          path="/home"
          element={isAuthenticated ? <Home /> : <Navigate to="/login" state={{ message: "You need to sign in to access the homepage" }} />}
        />
        
        <Route
          path="/profile"
          element={isAuthenticated ? <Profile /> : <Navigate to="/login" />}
        />

        <Route
          path="/profile/edit"
          element={isAuthenticated ? <ProfileEdit /> : <Navigate to="/login" />}
        />

        <Route
          path="/register-animal"
          element={isAuthenticated ? <RegisterAnimal /> : <Navigate to="/login" />}
        />

        <Route
          path="/my-posts"
          element={isAuthenticated ? <MyPosts /> : <Navigate to="/login" />}
        />

        <Route
          path="/animal/:id"
          element={isAuthenticated ? <AnimalDetail /> : <Navigate to="/login" />}
        />
      </Routes>
    </BrowserRouter>
  )
}