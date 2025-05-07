import API from "./api"

export const login = async (credentials) => {
  try {
    const response = await API.post("/login", { session: credentials })

    if (response.tokens && response.tokens.access) {
      const { token } = response.tokens.access
      const rememberToken = response.tokens.refresh?.token || ""

      if (credentials.remember_me) {
        localStorage.setItem("token", token)
        localStorage.setItem("remember_token", rememberToken)
      } else {
        sessionStorage.setItem("token", token)
        sessionStorage.setItem("remember_token", rememberToken)
      }

      return response
    }
    throw new Error("Invalid response from server")
  } catch (error) {
    throw error
  }
}

export const logout = async () => {
  try {
    await API.delete("/logout")
    localStorage.removeItem("token")
    localStorage.removeItem("remember_token")
    sessionStorage.removeItem("token")
    sessionStorage.removeItem("remember_token")
    return true
  } catch (error) {
    // Even if API call fails, still clear local storage
    localStorage.removeItem("token")
    localStorage.removeItem("remember_token")
    sessionStorage.removeItem("token")
    sessionStorage.removeItem("remember_token")
    throw error
  }
}

export const checkAuthStatus = async () => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token")

  if (!token) {
    return { loggedIn: false, user: null }
  }

  try {
    const response = await API.get("/sessions")
    if (response && response.user) {
      return { loggedIn: true, user: response.user }
    }
    return { loggedIn: false, user: null }
  } catch (error) {
    return { loggedIn: false, user: null }
  }
}

export const isAuthenticated = () => {
  return !!(localStorage.getItem("token") || sessionStorage.getItem("token"))
}
