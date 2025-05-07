"use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import { Row, Col, Card, Alert, Spinner } from "react-bootstrap"
import ReactPaginate from "react-paginate"
import MicropostItem from "../components/Micropost/MicropostItem"
import UserStats from "../components/User/UserStats"
import FollowButton from "../components/User/FollowButton"
import { getUser } from "../services/userService"

const UserProfile = () => {
  const { id } = useParams()
  const { user: currentUser } = useSelector((state) => state.session)
  const [user, setUser] = useState(null)
  const [microposts, setMicroposts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [page, setPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)

  const fetchUserProfile = async () => {
    setLoading(true)
    try {
      const response = await getUser(id, { page })
      setUser(response.user)
      setMicroposts(response.microposts)
      setTotalCount(response.total_count)
      setError("")
    } catch (error) {
      console.error(error)
      setError("Failed to load user profile")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUserProfile()
  }, [id, page])

  const handlePageChange = (selectedItem) => {
    setPage(selectedItem.selected + 1)
  }

  const handleFollowChange = () => {
    fetchUserProfile()
  }

  const handleMicropostDeleted = () => {
    fetchUserProfile()
  }

  if (loading) {
    return (
      <div className="text-center py-4">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    )
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>
  }

  return (
    <Row>
      <Col md={4}>
        <Card className="mb-4">
          <Card.Body>
            {user && (
              <>
                <div className="d-flex align-items-center mb-3">
                  <img
                    className="rounded-circle me-3"
                    src={`https://secure.gravatar.com/avatar/${user.gravatar_id}?s=80`}
                    alt={user.name}
                    width="80"
                    height="80"
                  />
                  <h3 className="h4 mb-0">{user.name}</h3>
                </div>
                <div>
                  {totalCount} micropost{totalCount !== 1 ? "s" : ""}
                </div>
              </>
            )}
          </Card.Body>
        </Card>

        <Card>
          <Card.Body>
            {user && (
              <>
                <UserStats userId={user.id} following={user.following} followers={user.followers} />

                {currentUser && currentUser.id !== user.id && (
                  <div className="text-center mt-3">
                    <FollowButton
                      userId={user.id}
                      isFollowing={user.current_user_following_user}
                      onFollowChange={handleFollowChange}
                    />
                  </div>
                )}
              </>
            )}
          </Card.Body>
        </Card>
      </Col>

      <Col md={8}>
        <h3 className="mb-4">Microposts</h3>

        {microposts.length === 0 ? (
          <Alert variant="info">No microposts found</Alert>
        ) : (
          <>
            {microposts.map((item) => (
              <MicropostItem key={item.id} micropost={item} onDelete={handleMicropostDeleted} />
            ))}

            {totalCount > 5 && (
              <div className="d-flex justify-content-center mt-4">
                <ReactPaginate
                  previousLabel={"Previous"}
                  nextLabel={"Next"}
                  breakLabel={"..."}
                  pageCount={Math.ceil(totalCount / 5)}
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
      </Col>
    </Row>
  )
}

export default UserProfile
