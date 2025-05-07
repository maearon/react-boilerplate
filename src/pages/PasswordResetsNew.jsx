"use client"

import { useState } from "react"
import { Form, Button, Row, Col } from "react-bootstrap"
import { toast } from "react-toastify"
import { requestPasswordReset } from "../services/passwordResetService"

const PasswordResetsNew = () => {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await requestPasswordReset({
        password_reset: {
          email,
        },
      })

      toast.success("The password reset email has been sent, please check your email")
      setEmail("")
    } catch (error) {
      console.error(error)
      toast.error("Failed to send password reset email. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <h1>Forgot password</h1>

      <Row>
        <Col md={6} className="mx-auto">
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="email">Email</Form.Label>
              <Form.Control type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </Form.Group>

            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </Form>
        </Col>
      </Row>
    </>
  )
}

export default PasswordResetsNew
