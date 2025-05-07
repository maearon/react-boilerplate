"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useSelector } from "react-redux"
import { ListGroup, Button, Spinner } from "react-bootstrap"
import ReactPaginate from "react-paginate"
import { toast } from "react-toastify"
import { getUsers, deleteUser } from "../services/userService"

const Users = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const { user: currentUser } = useSelector((state) => state.session)

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const response = await getUsers({ page })
      setUsers(response.users)
      setTotalCount(response.total_count)
    } catch (error) {
      console.error(error)
      toast.error("Failed to fetch users")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [page])

  const handlePageChange = (selectedItem) => {
    setPage(selectedItem.selected + 1)
  }

  const confirmDelete = async (userId, userName) => {
    if (window.confirm(`Are you sure you want to delete ${userName}?`)) {
      try {
        const response = await deleteUser(userId)
        if (response.flash) {
          toast.success(response.flash[1])
        } else {
          toast.success("User deleted successfully")
        }
        fetchUsers()
      } catch (error) {
        console.error(error)
        toast.error("Failed to delete user")
      }
    }
  }

  return (
    <div className="container py-4">
      <h1 className="mb-4">All users</h1>

      {loading ? (
        <div className="text-center py-4">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <>
          {users.length === 0 ? (
            <div className="text-center py-4">
              <p>No users found.</p>
            </div>
          ) : (
            <ListGroup>
              {users.map((user) => (
                <ListGroup.Item key={user.id} className="d-flex align-items-center">
                  <img
                    src={`https://secure.gravatar.com/avatar/${user.gravatar_id}?s=50`}
                    alt={user.name}
                    className="rounded-circle me-3"
                    width="40"
                    height="40"
                  />

                  <Link to={`/users/${user.id}`} className="flex-grow-1">
                    {user.name}
                  </Link>

                  {currentUser && currentUser.id !== user.id && (
                    <Button variant="danger" size="sm" onClick={() => confirmDelete(user.id, user.name)}>
                      delete
                    </Button>
                  )}
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}

          {totalCount > 10 && (
            <div className="d-flex justify-content-center mt-4">
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
    </div>
  )
}

export default Users
