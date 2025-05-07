import { Routes, Route } from "react-router-dom"
import Layout from "./components/Layout/Layout"
import ProtectedRoute from "./components/Auth/ProtectedRoute"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import About from "./pages/About"
import Contact from "./pages/Contact"
import Users from "./pages/Users"
import UserProfile from "./pages/UserProfile"
import UserEdit from "./pages/UserEdit"
import ShowFollow from "./pages/ShowFollow"
import AccountActivations from "./pages/AccountActivations"
import AccountActivationsNew from "./pages/AccountActivationsNew"
import PasswordResetsNew from "./pages/PasswordResetsNew"
import PasswordResets from "./pages/PasswordResets"
import NotFound from "./pages/NotFound"
import "./App.css"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />

        <Route path="users" element={<Users />} />
        <Route path="users/:id" element={<UserProfile />} />
        <Route
          path="users/:id/edit"
          element={
            <ProtectedRoute>
              <UserEdit />
            </ProtectedRoute>
          }
        />
        <Route path="users/:id/following" element={<ShowFollow type="following" />} />
        <Route path="users/:id/followers" element={<ShowFollow type="followers" />} />

        <Route path="account_activations/:token/edit" element={<AccountActivations />} />
        <Route path="account_activations/new" element={<AccountActivationsNew />} />
        <Route path="password_resets/new" element={<PasswordResetsNew />} />
        <Route path="password_resets/:token" element={<PasswordResets />} />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App
