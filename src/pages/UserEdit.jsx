"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Form, Button, Card, Row, Col, Alert, Spinner } from "react-bootstrap"
import { toast } from "react-toastify"
import { editUser, updateUser } from "../services/userService"

const UserEdit = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [user, setUser] = useState({ name: "", email: "" })
  const [gravatar, setGravatar] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState([])

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  })

  const fetchUserData = async () => {
    setLoading(true)
    try {
      const data = await editUser(id)
      setUser(data.user)
      setGravatar(data.gravatar)
      setFormData({
        ...formData,
        name: data.user.name,
        email: data.user.email,
      })
    } catch (error) {
      console.error(error)
      toast.error("Failed to fetch user data")
      navigate("/")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUserData()
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setErrors([])

    try {
      const response = await updateUser(id, {
        user: {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          password_confirmation: formData.password_confirmation,
        },
      })

      if (response.flash_success) {
        toast.success(response.flash_success[1])
        navigate(`/users/${id}`)
      }

      if (response.error) {
        setErrors(Array.isArray(response.error) ? response.error : [response.error])
      }
    } catch (error) {
      console.error(error)
      if (error.response?.data?.errors) {
        const errorData = error.response.data.errors
        const errorMessages = []
        Object.keys(errorData).forEach((key) => {
          errorData[key].forEach((message) => {
            errorMessages.push(`${key} ${message}`)
          })
        })
        setErrors(errorMessages)
      } else {
        toast.error("Failed to update profile")
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-4">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    )
  }

  return (
    <div className="container py-4">
      <h1 className="mb-4">Update your profile</h1>

      <Row>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body className="text-center">
              <img
                src={gravatar || "/placeholder.svg"}
                alt={user.name}
                className="rounded-circle mb-3"
                width="80"
                height="80"
              />
              <h3 className="h5">{user.name}</h3>
              <p className="mt-2">
                <a href="https://gravatar.com/emails" target="_blank" rel="noopener noreferrer">
                  change
                </a>
              </p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={8}>
          <Card>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                {errors.length > 0 && (
                  <Alert variant="danger" className="mb-4">
                    <ul className="mb-0">
                      {errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </Alert>
                )}

                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} required />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password_confirmation"
                    value={formData.password_confirmation}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Button type="submit" variant="primary" disabled={submitting}>
                  {submitting ? "Saving changes..." : "Save changes"}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default UserEdit
