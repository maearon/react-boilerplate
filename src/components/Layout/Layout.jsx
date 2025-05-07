"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Outlet } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import Header from "./Header"
import Footer from "./Footer"
import { checkAuth } from "../../store/sessionSlide"
import "react-toastify/dist/ReactToastify.css"
import "bootstrap/dist/css/bootstrap.min.css"

const Layout = () => {
  const dispatch = useDispatch()
  const { initialized } = useSelector((state) => state.session)

  useEffect(() => {
    dispatch(checkAuth())
  }, [dispatch])

  if (!initialized) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <main className="container flex-grow-1 py-4">
        <Outlet />
      </main>
      <Footer />
      <ToastContainer position="top-center" autoClose={5000} />
    </div>
  )
}

export default Layout
