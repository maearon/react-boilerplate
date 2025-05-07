import { Link } from "react-router-dom"

const NotFound = () => {
  return (
    <div className="text-center py-5">
      <h1 className="display-1 mb-4">404</h1>
      <h2 className="mb-4">Page Not Found</h2>
      <p className="mb-4">The page you are looking for does not exist or has been moved.</p>
      <Link to="/" className="btn btn-primary">
        Go to Home
      </Link>
    </div>
  )
}

export default NotFound
