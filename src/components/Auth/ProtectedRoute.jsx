import { Navigate, useLocation } from "react-router-dom"
import { useSelector } from "react-redux"
import { toast } from "react-toastify"

const ProtectedRoute = ({ children }) => {
  const { loggedIn, initialized } = useSelector((state) => state.session)
  const location = useLocation()

  if (!initialized) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  if (!loggedIn) {
    toast.error("Please log in to access this page")
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

export default ProtectedRoute
