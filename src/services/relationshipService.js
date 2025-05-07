import API from "./api"

export const followUser = async (followedId) => {
  return API.post("/relationships", { followed_id: followedId })
}

export const unfollowUser = async (id) => {
  return API.delete(`/relationships/${id}`)
}
