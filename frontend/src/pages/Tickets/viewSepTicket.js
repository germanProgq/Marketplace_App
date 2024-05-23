import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useUser } from '../Layout/assets/usercontext';

const API = process.env.API || 'http://localhost:4000';

// Component to view and add comments to a specific ticket
const TicketDetail = () => {
  const { ticketId } = useParams(); // Retrieve the ticket ID from the URL
  const { user } = useUser(); // Current user context
  const [ticket, setTicket] = useState(null); // Ticket details
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchTicketDetails = async () => {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`, // Include JWT token for authorization
        },
      };

      try {
        const response = await axios.get(
          `${API}/user/tickets/${ticketId}`, // Backend endpoint for retrieving ticket details and comments
          config
        );

        if (response.status === 200) {
          setTicket(response.data.ticket); // Store ticket information
          setComments(response.data.comments); // Store existing comments
        } else {
          setMessage("Failed to fetch ticket details.");
        }
      } catch (error) {
        setMessage(error.response?.data?.error || 'An error occurred while fetching the ticket details.');
      }
    };

    fetchTicketDetails(); // Fetch the ticket details on component mount
  }, [ticketId, user.token]); // Dependency array to re-fetch when ticket ID or token changes

  const handleAddComment = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`, // Include JWT token for authorization
      },
    };

    if (!newComment.trim()) {
      setMessage("Please enter a valid comment."); // Ensure a non-empty comment
      return;
    }

    try {
      const response = await axios.post(
        `${API}/user/tickets/${ticketId}/comments`, // Backend endpoint for adding comments
        {
          comment: newComment.trim(),
        },
        config
      );

      if (response.status === 201) {
        setComments([...comments, response.data.comment]); // Update comments list
        setNewComment(''); // Clear the input field
        setMessage("Comment added successfully.");
      } else {
        setMessage("Failed to add comment.");
      }
    } catch (error) {
      setMessage(error.response?.data?.error || 'An error occurred while adding the comment.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1vh' }}>
      {ticket ? (
        <div>
          <h3 style={{ fontSize: '30px' }}>{ticket.subject}</h3>
          <p>Status: {ticket.status}</p>
          <p>Created At: {new Date(ticket.created_at).toLocaleString()}</p>

          <h4>Comments:</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2vw' }}>
            {comments.map((comment) => (
              <div key={comment.id} style={{ padding: '0.5em', border: '1px solid #ccc', borderRadius: '8px' }}>
                <p>{comment.comment}</p>
                <p style={{ color: 'var(--primary)' }}>Posted At: {new Date(comment.created_at).toLocaleString()}</p>
              </div>
            ))}
          </div>

          {/* Only allow comments if the ticket is not closed */}
          {ticket.status !== 'closed' ? (
            <div style={{ width: '70vw', display: 'flex', flexDirection: 'column', gap: '3vw', marginTop: '20vh' }}>
              <textarea
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment"
                style={{ padding: '0.5em', borderRadius: '8px', resize: 'vertical', height: '20vh' }}
              />
              <button onClick={handleAddComment} style={{ padding: '0.5em', borderRadius: '8px' }}>
                Add Comment
              </button>
            </div>
          ) : (
            <p>Comments are not allowed on closed tickets.</p> // Message if ticket is closed
          )}

          <p>{message}</p> {/* Display success or error messages */}
        </div>
      ) : (
        <p>Loading ticket details...</p> // Indicate when the ticket information is loading
      )}
    </div>
  );
};

export default TicketDetail;
