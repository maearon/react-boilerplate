import API from "./api"

export const getUsers = async (params = {}) => {
  return API.get("/users", { params })
}

export const getUser = async (id, params = {}) => {
  return API.get(`/users/${id}`, { params })
}

export const editUser = async (id) => {
  return API.get(`/users/${id}/edit`)
}

export const updateUser = async (id, params) => {
  return API.patch(`/users/${id}`, params)
}

export const createUser = async (params) => {
  return API.post("/users", params)
}

export const deleteUser = async (id) => {
  return API.delete(`/users/${id}`)
}

export const getFollowers = async (id, page) => {
  return API.get(`/users/${id}/followers`, { params: { page } })
}

export const getFollowing = async (id, page) => {
  return API.get(`/users/${id}/following`, { params: { page } })
}
