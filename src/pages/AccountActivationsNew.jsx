"use client"

import { useState } from "react"
import { Form, Button, Alert, Row, Col } from "react-bootstrap"
import { toast } from "react-toastify"
import { resendActivationEmail } from "../services/accountActivationService"

const AccountActivationsNew = () => {
  const [email, setEmail] = useState("")
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await resendActivationEmail({
        resend_activation_email: {
          email,
        },
      })

      // Clear form and errors
      setEmail("")
      setErrors({})

      // Show success message
      toast.success("The activation email has been sent again, please check your email")
    } catch (error) {
      console.error(error)
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors)
      } else {
        toast.error("Failed to send activation email. Please try again.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <h1>Resend Activation Email</h1>

      <Row>
        <Col md={6} className="mx-auto">
          <Form onSubmit={handleSubmit}>
            {Object.keys(errors).length > 0 && (
              <Alert variant="danger">
                <ul>
                  {Object.keys(errors).map((field) =>
                    errors[field].map((error, index) => (
                      <li key={`${field}-${index}`}>
                        {field} {error}
                      </li>
                    )),
                  )}
                </ul>
              </Alert>
            )}

            <Form.Group className="mb-3">
              <Form.Label htmlFor="email">Email</Form.Label>
              <Form.Control type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </Form.Group>

            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Resend activation email"}
            </Button>
          </Form>
        </Col>
      </Row>
    </>
  )
}

export default AccountActivationsNew
