import API from "./api"

export const getMicroposts = async (params = {}) => {
  return API.get("", { params })
}

export const createMicropost = async (formData) => {
  return API.post("/microposts", formData)
}

export const deleteMicropost = async (id) => {
  return API.delete(`/microposts/${id}`)
}
