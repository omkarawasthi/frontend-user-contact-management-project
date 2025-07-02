import { useNavigate } from "react-router-dom"
import { toast } from 'react-toastify';
import { useState } from "react"
import "../styles/Search.css"

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [birthdayUsers, setBirthdayUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [emailLoading, setEmailLoading] = useState(false)
  const [showBirthdayUsers, setShowBirthdayUsers] = useState(false)

  const navigate = useNavigate()

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setLoading(true)
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8000/api/v1/users/search/?name=${searchQuery}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        const data = await response.json()
        setSearchResults(data.users)
      } 
      else {
        toast.error("Failed to search users")
      }
    } 
    catch (error) {
      console.error("Error searching users:", error)
      toast.error("Network error. Please try again.")
    }
    finally {
      setLoading(false)
    }
  }

  const fetchBirthdayUsers = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:8000/api/v1/birthday-users/7", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      console.log("response is :", response)

      if (response.ok) {
        const data = await response.json()
        
        console.log("data is :", data)

        setBirthdayUsers(data)
        setShowBirthdayUsers(true)
        setSearchResults([])
      } 
      else {
        toast.error("Failed to fetch birthday users")
      }
    } 

    catch (error) {
      console.error("Error fetching birthday users:", error)
      toast.error("Network error. Please try again.")
      alert("Network error. Please try again.")
    } 
    finally {
      setLoading(false)
    }
  }

  const sendBirthdayEmails = async () => {
    if (window.confirm("Send birthday emails to all users except those with birthdays in the next 7 days?")) {
      setEmailLoading(true)
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:8000/api/v1/send-birthday-emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        if (response.ok) {
          const data = await response.json()
          alert(`Emails sent successfully to ${data.emails_sent} users!`)
        } 
        else {
          const data = await response.json()
          alert(data.message || "Failed to send emails")
        }
      } 
      catch (error) {
        console.error("Error sending emails:", error)
        alert("Network error. Please try again.")
      }
      finally {
        setEmailLoading(false)
      }
    }
  }

  const UserCard = ({ user }) => (
    <div className="user-card">
      <div className="user-info">
        <h3>
          {user.first_name} {user.last_name}
        </h3>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Phone:</strong> {user.phone_no}
        </p>
        <p>
          <strong>Date of Birth:</strong> {user.dob}
        </p>
      </div>
    </div>
  )

  return (
    <div className="search-container">
      <div className="search-header">
        <h1>Search Users</h1>
        <button className="back-button" onClick={() => navigate("/profile")}>
          Back to Profile
        </button>
      </div>

      <div className="search-controls">
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-group">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, username, or date of birth (YYYY-MM-DD)"
              className="search-input"
            />
            <button type="submit" className="search-button" disabled={loading}>
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
        </form>

        <div className="birthday-controls">
          <button className="birthday-button" onClick={fetchBirthdayUsers} disabled={loading}>
            {loading ? "Loading..." : "Birthdays in Next 7 Days"}
          </button>

          {showBirthdayUsers && birthdayUsers?.length > 0 && (
            <button className="email-button" onClick={sendBirthdayEmails} disabled={emailLoading}>
              {emailLoading ? "Sending Emails..." : "Send Email to Others"}
            </button>
          )}
        </div>
      </div>

      <div className="results-container">
        {showBirthdayUsers && (
          <div className="birthday-section">
            <h2>Users with Birthdays in Next 7 Days ({birthdayUsers?.length})</h2>
            {birthdayUsers?.length === 0 ? (
              <p className="no-results">No users have birthdays in the next 7 days.</p>
            ) : (
              <div className="users-grid">
                {birthdayUsers.map((user) => (
                  <UserCard key={user.id} user={user} />
                ))}
              </div>
            )}
          </div>
        )}

        {searchResults.length > 0 && (
          <div className="search-section">
            <h2>Search Results ({searchResults.length})</h2>
            <div className="users-grid">
              {searchResults.map((user) => (
                <UserCard key={user.id} user={user} />
              ))}
            </div>
          </div>
        )}

        {searchQuery && searchResults.length === 0 && !loading && !showBirthdayUsers && (
          <p className="no-results">No users found matching your search.</p>
        )}
      </div>
    </div>
  )
}

export default Search;