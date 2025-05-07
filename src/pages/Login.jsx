"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { Form, Button, Card, Row, Col, Alert } from "react-bootstrap"
import { loginUser } from "../store/sessionSlide"
import { toast } from "react-toastify"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(true)

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error } = useSelector((state) => state.session)

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      await dispatch(
        loginUser({
          email,
          password,
          remember_me: rememberMe,
        }),
      ).unwrap()

      toast.success("Logged in successfully")
      navigate("/")
    } catch (error) {
      // Error is handled by the reducer
    }
  }

  return (
    <Row className="justify-content-center">
      <Col md={6}>
        <Card>
          <Card.Header>
            <h1 className="text-center mb-0">Log in</h1>
          </Card.Header>
          <Card.Body>
            {error && <Alert variant="danger">{error.message || "Login failed. Please try again."}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  label="Remember me on this computer"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
              </Form.Group>

              <Button type="submit" variant="primary" className="w-100" disabled={loading}>
                {loading ? "Logging in..." : "Log in"}
              </Button>

              <div className="mt-3 text-center">
                New user? <Link to="/signup">Sign up now!</Link>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  )
}

export default Login
