import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Auth from "./components/Auth"
import Profile from "./components/Profile"
import Search from "./components/Search"
import "./App.css"
import { AuthProvider, useAuth } from "./context/AuthContext"

function AppContent() {
  const { user, loading, isAuthenticated } = useAuth()

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <Router future={{ v7_startTransition:true, v7_relativeSplatPath:true }}>
      <div className="App">
        <Routes>
          <Route path="/auth" element={!isAuthenticated ? <Auth /> : <Navigate to="/profile" />} />
          <Route path="/profile" element={isAuthenticated ? <Profile user={user} /> : <Navigate to="/auth" />} />
          <Route path="/search" element={isAuthenticated ? <Search /> : <Navigate to="/auth" />} />
          <Route path="/" element={<Navigate to={isAuthenticated ? "/profile" : "/auth"} />} />
        </Routes>
      </div>
    </Router>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App;