"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap"
import { logoutUser } from "../../store/sessionSlice"
import { toast } from "react-toastify"

const Header = () => {
  const { loggedIn, user } = useSelector((state) => state.session)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [expanded, setExpanded] = useState(false)

  const handleLogout = async (e) => {
    e.preventDefault()
    try {
      await dispatch(logoutUser()).unwrap()
      toast.success("Logged out successfully")
      navigate("/")
    } catch (error) {
      toast.error("Failed to log out")
    }
  }

  return (
    <Navbar bg="primary" variant="dark" expand="lg" expanded={expanded}>
      <Container>
        <Navbar.Brand as={Link} to="/">
          Sample App
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={() => setExpanded(expanded ? false : true)} />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" onClick={() => setExpanded(false)}>
              Home
            </Nav.Link>
            {loggedIn && (
              <Nav.Link as={Link} to="/users" onClick={() => setExpanded(false)}>
                Users
              </Nav.Link>
            )}
          </Nav>
          <Nav>
            {loggedIn ? (
              <NavDropdown title="Account" id="basic-nav-dropdown" align="end">
                <NavDropdown.Item as={Link} to={`/users/${user?.id}`} onClick={() => setExpanded(false)}>
                  Profile
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to={`/users/${user?.id}/edit`} onClick={() => setExpanded(false)}>
                  Settings
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item
                  onClick={(e) => {
                    handleLogout(e)
                    setExpanded(false)
                  }}
                >
                  Log out
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Nav.Link as={Link} to="/login" onClick={() => setExpanded(false)}>
                Log in
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Header
