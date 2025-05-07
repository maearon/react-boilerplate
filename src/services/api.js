import axios from "axios"

// Base API URL
const BASE_URL = "https://ruby-rails-boilerplate-3s9t.onrender.com/api"

// Create axios instance
const API = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "x-lang": "EN",
  },
  withCredentials: true,
})

// Request interceptor
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token")
    const rememberToken = localStorage.getItem("remember_token") || sessionStorage.getItem("remember_token")

    if (token && token !== "undefined") {
      config.headers.Authorization = `Bearer ${token} ${rememberToken || ""}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Response interceptor
API.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // For 401 errors when accessing /sessions endpoint, don't reject the promise
    if (error.response && error.response.status === 401 && error.config.url.includes("/sessions")) {
      console.log("Handling 401 error silently for auth check")
      // Return an empty successful response instead of rejecting
      return Promise.resolve({ user: null, loggedIn: false })
    }
    return Promise.reject(error)
  },
)

export default API
