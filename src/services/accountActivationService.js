import API from "./api"

export const resendActivationEmail = async (email) => {
  return API.post("/account_activations", {
    resend_activation_email: { email },
  })
}

export const activateAccount = async (token, email) => {
  return API.patch(`/account_activations/${token}`, { email })
}
