"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Form, Button, Alert, Row, Col } from "react-bootstrap"
import { toast } from "react-toastify"
import { createUser } from "../services/userService"

const Signup = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [passwordConfirmation, setPasswordConfirmation] = useState("")
  const [errorMessage, setErrorMessage] = useState([])
  const [submitting, setSubmitting] = useState(false)

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setErrorMessage([])

    try {
      const response = await createUser({
        user: {
          name,
          email,
          password,
          password_confirmation: passwordConfirmation,
        },
      })

      if (response.user) {
        if (response.flash) {
          toast.success(response.flash[1])
        }
        navigate("/")
      }

      if (response.error) {
        setErrorMessage(response.error)
      }
    } catch (error) {
      console.error(error)
      toast.error("Failed to create account. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <h1>Sign up</h1>

      <Row>
        <Col md={6} className="mx-auto">
          <Form onSubmit={handleSubmit}>
            {errorMessage.length > 0 && (
              <Alert variant="danger">
                <ul className="mb-0">
                  {errorMessage.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </Alert>
            )}

            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="off"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Confirmation</Form.Label>
              <Form.Control
                type="password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                required
              />
            </Form.Group>

            <Button type="submit" variant="primary" disabled={submitting}>
              {submitting ? "Creating account..." : "Create my account"}
            </Button>
          </Form>
        </Col>
      </Row>
      <br />
      <div className="text-center">
        <Link to="/account_activations/new" className="btn btn-success">
          Resend activation email
        </Link>
      </div>
    </>
  )
}

export default Signup
