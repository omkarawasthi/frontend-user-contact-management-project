import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "../styles/./Profile.css"
import { useAuth } from "../context/AuthContext"

const Profile = () => {
  const { user, logout, updateUser, deleteUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    first_name: user.first_name || "",
    last_name: user.last_name || "",
    email: user.email || "",
    phone_no: user.phone_no || "",
    aadhar_no: user.aadhar_no || "",
    date_of_birth: user.date_of_birth || "",
  })

  const navigate = useNavigate()

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)
    // console.log("form data :", formData)

    const result = await updateUser(formData)

    if (result.success) {
      alert("Profile updated successfully!")
      navigate("/profile");
      setIsEditing(false)
    } else {
      alert(result.error)
    }

    setLoading(false)
  }

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      setLoading(true)

      const result = await deleteUser()

      if (result.success) {
        alert("Account deleted successfully!")
        // User will be automatically redirected to auth page due to logout in deleteUser
      } else {
        alert(result.error)
        setLoading(false)
      }
    }
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>User Profile</h1>
        <div className="header-buttons">
          <button className="nav-button" onClick={() => navigate("/search")}>
            Search Users
          </button>
          <button className="logout-button" onClick={logout}>
            Logout
          </button>
        </div>
      </div>

      <div className="profile-card">
        {isEditing ? (
          <form onSubmit={handleUpdate} className="profile-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="first_name">First Name</label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="last_name">Last Name</label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
              />
            </div> */}

            <div className="form-group">
              <label htmlFor="phone_no">Phone Number</label>
              <input
                type="tel"
                id="phone_no"
                name="phone_no"
                value={formData.phone_no}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="aadhar_no">Aadhar Number</label>
              <input
                type="text"
                id="aadhar_no"
                name="aadhar_no"
                value={formData.aadhar_no}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="date_of_birth">Date of Birth</label>
              <input
                type="date"
                id="date_of_birth"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-buttons">
              <button type="submit" className="save-button" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </button>
              <button type="button" className="cancel-button" onClick={() => setIsEditing(false)}>
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="profile-info">
            <div className="info-row">
              <div className="info-item">
                <label>First Name:</label>
                <span>{user.first_name}</span>
              </div>
              <div className="info-item">
                <label>Last Name:</label>
                <span>{user.last_name}</span>
              </div>
            </div>

            <div className="info-item">
              <label>Email:</label>
              <span>{user.email}</span>
            </div>

            {/* <div className="info-item">
              <label>Username:</label>
              <span>{user.username}</span>
            </div> */}

            <div className="info-item">
              <label>Phone Number:</label>
              <span>{user.phone_no}</span>
            </div>

            <div className="info-item">
              <label>Aadhar Number:</label>
              <span>{user.aadhar_no}</span>
            </div>

            <div className="info-item">
              <label>Date of Birth:</label>
              <span>{new Date(user.date_of_birth).toLocaleDateString()}</span>
            </div>

            <div className="profile-buttons">
              <button className="update-button" onClick={() => setIsEditing(true)}>
                Update Profile
              </button>
              <button className="delete-button" onClick={handleDelete} disabled={loading}>
                {loading ? "Deleting..." : "Delete Account"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile
