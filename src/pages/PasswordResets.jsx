"use client"

import { useState, useEffect } from "react"
import { useParams, useSearchParams, useNavigate } from "react-router-dom"
import { Form, Button, Alert, Row, Col } from "react-bootstrap"
import { toast } from "react-toastify"
import { resetPassword } from "../services/passwordResetService"

const PasswordResets = () => {
  const { token } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [passwordConfirmation, setPasswordConfirmation] = useState("")
  const [errorMessage, setErrorMessage] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    // Get email from query params
    const emailParam = searchParams.get("email")

    if (!token || !emailParam) {
      toast.error("Invalid password reset link")
      navigate("/password_resets/new")
    } else {
      setEmail(emailParam)
    }
  }, [token, searchParams, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await resetPassword(token, {
        email,
        user: {
          password,
          password_confirmation: passwordConfirmation,
        },
      })

      if (response.flash?.[0] === "danger") {
        toast.error(response.flash[1])
      } else if (response.error) {
        setErrorMessage(response.error)
      } else if (response.flash?.[0] === "success") {
        toast.success("The password reset successfully, please try log in again")
        navigate("/login")
      } else {
        toast.success("The password reset successfully, please try log in again")
        navigate("/login")
      }
    } catch (error) {
      console.error(error)
      toast.error("Failed to reset password. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <h1>Reset password</h1>
      <Row>
        <Col md={6} className="mx-auto">
          <Form onSubmit={handleSubmit}>
            {errorMessage.length > 0 && (
              <Alert variant="danger">
                <ul>
                  {errorMessage.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </Alert>
            )}

            <input type="hidden" name="email" value={email} />

            <Form.Group className="mb-3">
              <Form.Label htmlFor="password">Password</Form.Label>
              <Form.Control
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label htmlFor="passwordConfirmation">Confirmation</Form.Label>
              <Form.Control
                type="password"
                id="passwordConfirmation"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                required
              />
            </Form.Group>

            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update password"}
            </Button>
          </Form>
        </Col>
      </Row>
    </>
  )
}

export default PasswordResets
