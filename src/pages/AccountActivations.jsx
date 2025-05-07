"use client"

import { useEffect, useState } from "react"
import { useParams, useSearchParams, useNavigate } from "react-router-dom"
import { Spinner } from "react-bootstrap"
import { toast } from "react-toastify"
import { activateAccount } from "../services/accountActivationService"

const AccountActivations = () => {
  const { token } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [activating, setActivating] = useState(true)

  useEffect(() => {
    const email = searchParams.get("email")

    if (!token || !email) {
      toast.error("Invalid activation link")
      navigate("/")
      return
    }

    const processActivation = async () => {
      try {
        await activateAccount(token, email)
        toast.success("The account has been activated. Please log in.")
        setTimeout(() => {
          navigate("/login")
        }, 3000)
      } catch (error) {
        console.error("Activation Error:", error)
        toast.error("Account activation failed. Please try again.")
        navigate("/")
      } finally {
        setActivating(false)
      }
    }

    processActivation()
  }, [token, searchParams, navigate])

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h1>Activating your account...</h1>
      <p>Please wait while we process your activation.</p>
      {activating && (
        <div className="text-center mt-4">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}
    </div>
  )
}

export default AccountActivations
