"use client"

import { useState } from "react"
import { Form, Button } from "react-bootstrap"
import { toast } from "react-toastify"
import { createMicropost } from "../../services/micropostService"

const MicropostForm = ({ onPostCreated }) => {
  const [content, setContent] = useState("")
  const [image, setImage] = useState(null)
  const [errors, setErrors] = useState([])
  const [submitting, setSubmitting] = useState(false)

  const handleImageInput = (e) => {
    const file = e.target.files[0]
    if (file) {
      const sizeInMB = file.size / 1024 / 1024
      if (sizeInMB > 512) {
        toast.error("Maximum file size is 512MB. Please choose a smaller file.")
        e.target.value = ""
        setImage(null)
      } else {
        setImage(file)
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setErrors([])

    const formData = new FormData()
    formData.append("micropost[content]", content)

    if (image) {
      formData.append("micropost[image]", image)
    }

    try {
      const response = await createMicropost(formData)

      if (response.flash) {
        toast.success(response.flash[1])
        setContent("")
        setImage(null)
        if (onPostCreated) onPostCreated()
      }

      if (response.error) {
        setErrors(response.error)
      }
    } catch (error) {
      toast.error("Failed to create micropost")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Form onSubmit={handleSubmit}>
      {errors.length > 0 && (
        <div className="alert alert-danger">
          <ul className="mb-0">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <Form.Group className="mb-3">
        <Form.Control
          as="textarea"
          placeholder="Compose new micropost..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
        />
      </Form.Group>

      <div className="d-flex">
        <Button type="submit" variant="primary" disabled={submitting} className="me-2">
          {submitting ? "Posting..." : "Post"}
        </Button>

        <Form.Group className="flex-grow-1">
          <Form.Control type="file" accept="image/jpeg,image/gif,image/png" onChange={handleImageInput} />
        </Form.Group>
      </div>
    </Form>
  )
}

export default MicropostForm
