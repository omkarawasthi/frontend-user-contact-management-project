import { useState } from "react"
import "../styles/Auth.css"
import { useAuth } from "../context/AuthContext"

const Auth = () => {
  const { login, register, loading, error } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    username: "",
    password: "",
    phone_no: "",
    aadhar_no: "",
    date_of_birth: "",
    loginField: "", // for username/email login
  })

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (isLogin) {
      const result = await login({
        email: formData.loginField,
        password: formData.password,
      })

      if (!result.success) {
        alert(result.error)
      }
    } else {
      const result = await register({
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        username: formData.username,
        password: formData.password,
        phone_no: formData.phone_no,
        aadhar_no: formData.aadhar_no,
        date_of_birth: formData.date_of_birth,
      })

      if (result.success) {
        alert("Account created successfully! Please login.")
        setIsLogin(true)
        setFormData({
          first_name: "",
          last_name: "",
          email: "",
          username: "",
          password: "",
          phone_no: "",
          aadhar_no: "",
          date_of_birth: "",
          loginField: "",
        })
      } else {
        alert(result.error)
      }
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>{isLogin ? "Login" : "Sign Up"}</h1>
          <p>{isLogin ? "Welcome back!" : "Create your account"}</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {isLogin ? (
            <>
              <div className="form-group">
                <label htmlFor="loginField">Username or Email</label>
                <input
                  type="text"
                  id="loginField"
                  name="loginField"
                  value={formData.loginField}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter username or email"
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter password"
                />
              </div>
            </>
          ) : (
            <>
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
                    placeholder="First name"
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
                    placeholder="Last name"
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
                  placeholder="Enter email"
                />
              </div>

              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  placeholder="Choose username"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  placeholder="Create password"
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone_no">Phone Number</label>
                <input
                  type="tel"
                  id="phone_no"
                  name="phone_no"
                  value={formData.phone_no}
                  onChange={handleInputChange}
                  required
                  placeholder="Phone number"
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
                  placeholder="Aadhar number"
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
            </>
          )}

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Processing..." : isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        <div className="auth-switch">
          <p>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button type="button" className="switch-button" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? "Sign Up" : "Login"}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Auth
