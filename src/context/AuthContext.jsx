import { createContext, useContext, useReducer, useEffect } from "react"

// Auth Context
const AuthContext = createContext()

// Auth Actions
const AUTH_ACTIONS = {
  LOGIN_START: "LOGIN_START",
  LOGIN_SUCCESS: "LOGIN_SUCCESS",
  LOGIN_FAILURE: "LOGIN_FAILURE",
  LOGOUT: "LOGOUT",
  SET_LOADING: "SET_LOADING",
  UPDATE_USER: "UPDATE_USER",
}

// Initial State
const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true,
  error: null,
}

// Auth Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
      return {
        ...state,
        loading: true,
        error: null,
      }
    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null,
      }
    case AUTH_ACTIONS.LOGIN_FAILURE:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload,
      }
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      }
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      }
    case AUTH_ACTIONS.UPDATE_USER:
      return {
        ...state,
        user: action.payload,
      }
    default:
      return state
  }
}

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Check for existing token on app load
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("token")
      const userId = localStorage.getItem("userId")

      if (token && userId) {
        try {
          // Verify token by fetching user data
          const response = await fetch(`http://localhost:8000/api/v1/getuser/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          })

          if (response.ok) {
            const userData = await response.json()
            // console.log("User data :", userData.user)

            dispatch({
              type: AUTH_ACTIONS.LOGIN_SUCCESS,
              payload: {
                user: userData.user,
                token: token,
              },
            })

          } 
          else {
            // Token is invalid, clear storage
            localStorage.removeItem("token")
            localStorage.removeItem("userId")
            dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false })
          }
        } catch (error) {
          console.error("Error verifying token:", error)
          localStorage.removeItem("token")
          localStorage.removeItem("userId")
          dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false })
        }
      } else {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false })
      }
    }

    initializeAuth()
  }, [])

  // Login function
  const login = async (credentials) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START })

    try {
      const response = await fetch("http://localhost:8000/api/v1/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      })

      const data = await response.json()
      // console.log("data is :",data)

      if (response.ok) {
        // Store token and user ID in localStorage
        localStorage.setItem("token", data.accessToken)
        localStorage.setItem("userId", data.user.user_id)

        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: {
            user: data.user,
            token: data.token,
          },
        })

        return { success: true, data }
      } else {
        dispatch({
          type: AUTH_ACTIONS.LOGIN_FAILURE,
          payload: data.message || "Login failed",
        })
        return { success: false, error: data.message || "Login failed" }
      }
    } catch (error) {
      console.error("Login error:", error)
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: "Network error. Please try again.",
      })
      return { success: false, error: "Network error. Please try again." }
    }
  }


  // Register function
  const register = async (userData) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START })

    try {
      console.log("userdata is :",JSON.stringify(userData))
      
      const response = await fetch("http://localhost:8000/api/v1/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })

      console.log("response is : ",response)

      const data = await response.json()

      if (response.ok) {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false })
        return { success: true, data }
      } else {
        dispatch({
          type: AUTH_ACTIONS.LOGIN_FAILURE,
          payload: data.message || "Registration failed",
        })
        return { success: false, error: data.message || "Registration failed" }
      }
    } catch (error) {
      console.error("Registration error:", error)
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: "Network error. Please try again.",
      })
      return { success: false, error: "Network error. Please try again." }
    }
  }


  // Logout function
  const logout = () => {``
    localStorage.removeItem("token")
    localStorage.removeItem("userId")
    dispatch({ type: AUTH_ACTIONS.LOGOUT })
  }

  // Update user function
  const updateUser = async (updatedData) => {
    try {
      // console.log("Updated Data :", updatedData)

      const user_id = localStorage.getItem("userId")
      const token = localStorage.getItem("token")
      
      // console.log("token is :", token)
      

      const response = await fetch(`http://localhost:8000/api/v1/updateuser/${user_id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      })
      // console.log("response is : ",response)

      if (response.ok) {
        // const updatedUser = await response.json()
        dispatch({
          type: AUTH_ACTIONS.UPDATE_USER,
          payload: "User Updated successfully",
        })
        return { success: true, data: "user updated" }
      } else {
        const data = await response.json()
        return { success: false, error: data.message || "Update failed" }
      }
    } catch (error) {
      console.error("Update error:", error)
      return { success: false, error: "Network error. Please try again." }
    }
  }

  // Delete user function
  const deleteUser = async () => {
    try {
      const user_id = localStorage.getItem("userId")
      const token = localStorage.getItem("token")

      const response = await fetch(`http://localhost:8000/api/v1/deleteuser/${user_id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        logout() // Clear auth state after successful deletion
        return { success: true }
      } else {
        const data = await response.json()
        return { success: false, error: data.message || "Delete failed" }
      }
    } catch (error) {
      console.error("Delete error:", error)
      return { success: false, error: "Network error. Please try again." }
    }
  }

  const value = {
    ...state,
    login,
    register,
    logout,
    updateUser,
    deleteUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
