import { Link } from "react-router-dom"

const Footer = () => {
  return (
    <footer className="footer mt-5 py-3 bg-light">
      <div className="container text-center">
        <div className="mb-2">
          <Link to="/about" className="me-2">
            About
          </Link>
          <Link to="/contact" className="me-2">
            Contact
          </Link>
          <a href="https://react.dev/" target="_blank" rel="noopener noreferrer">
            News
          </a>
        </div>
        <div>
          <a href="https://react.dev/" target="_blank" rel="noopener noreferrer">
            <img src="/react.svg" alt="React logo" width="100" height="30" />
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
