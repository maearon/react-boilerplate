import API from "./api"

export const requestPasswordReset = async (email) => {
  return API.post("/password_resets", {
    password_reset: { email },
  })
}

export const resetPassword = async (token, params) => {
  return API.patch(`/password_resets/${token}`, params)
}
