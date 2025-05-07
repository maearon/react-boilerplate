"use client"

import { useState, useEffect } from "react"
import { useParams, Link, useLocation } from "react-router-dom"
import { ListGroup, Nav, Spinner } from "react-bootstrap"
import ReactPaginate from "react-paginate"
import { toast } from "react-toastify"
import { getFollowers, getFollowing } from "../services/userService"

const ShowFollow = ({ type: propType }) => {
  const { id } = useParams()
  const location = useLocation()
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [users, setUsers] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [profileUser, setProfileUser] = useState({
    name: "",
    gravatar: "",
    micropost: 0,
    following: 0,
    followers: 0,
  })

  // Determine type from props or route
  const type = propType || (location.pathname.includes("/following") ? "following" : "followers")

  const fetchData = async () => {
    setLoading(true)
    try {
      let response
      if (type === "following") {
        response = await getFollowing(id, page)
      } else {
        response = await getFollowers(id, page)
      }

      setUsers(response.users)
      setTotalCount(response.total_count)
      setProfileUser(response.user)
    } catch (error) {
      console.error(error)
      toast.error(`Failed to fetch ${type}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [id, type, page])

  const handlePageChange = (selectedItem) => {
    setPage(selectedItem.selected + 1)
  }

  return (
    <div className="container py-4">
      {/* User info */}
      <div className="text-center mb-4">
        <img
          src={`https://secure.gravatar.com/avatar/${profileUser.gravatar}?s=100`}
          alt={profileUser.name}
          className="rounded-circle mb-3"
          width="100"
          height="100"
        />
        <h1 className="h4">{profileUser.name}</h1>
        <div>
          {profileUser.micropost} micropost{profileUser.micropost !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Tabs */}
      <Nav className="nav-tabs justify-content-center mb-4">
        <Nav.Item>
          <Nav.Link as={Link} to={`/users/${id}`}>
            Profile
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={Link} to={`/users/${id}/following`} active={type === "following"}>
            Following
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={Link} to={`/users/${id}/followers`} active={type === "followers"}>
            Followers
          </Nav.Link>
        </Nav.Item>
      </Nav>

      {/* Content */}
      {loading ? (
        <div className="text-center py-4">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <>
          <h2 className="h5 mb-4">
            {type === "following" ? "Following" : "Followers"} ({totalCount})
          </h2>

          {users.length === 0 ? (
            <div className="text-center py-4">
              <p>No {type === "following" ? "following" : "followers"} yet.</p>
            </div>
          ) : (
            <>
              <ListGroup className="mb-4">
                {users.map((followUser) => (
                  <ListGroup.Item key={followUser.id} className="d-flex align-items-center">
                    <img
                      src={`https://secure.gravatar.com/avatar/${followUser.gravatar_id}?s=40`}
                      alt={followUser.name}
                      className="rounded-circle me-3"
                      width="40"
                      height="40"
                    />
                    <Link to={`/users/${followUser.id}`} className="flex-grow-1">
                      {followUser.name}
                    </Link>
                  </ListGroup.Item>
                ))}
              </ListGroup>

              {totalCount > 10 && (
                <div className="d-flex justify-content-center">
                  <ReactPaginate
                    previousLabel={"Previous"}
                    nextLabel={"Next"}
                    breakLabel={"..."}
                    pageCount={Math.ceil(totalCount / 10)}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={handlePageChange}
                    containerClassName={"pagination"}
                    activeClassName={"active"}
                    pageClassName={"page-item"}
                    pageLinkClassName={"page-link"}
                    previousClassName={"page-item"}
                    previousLinkClassName={"page-link"}
                    nextClassName={"page-item"}
                    nextLinkClassName={"page-link"}
                    breakClassName={"page-item"}
                    breakLinkClassName={"page-link"}
                  />
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  )
}

export default ShowFollow
