import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../Layout/assets/usercontext';
import CloseTicketButton from './closeTicketButton'

const API = process.env.API || 'http://localhost:4000';

// Admin component to view and interact with a specific ticket
const AdminTicketDetail = () => {
  const { ticketId } = useParams(); // Retrieve the ticket ID from the URL
  const { user } = useUser(); // Current user context
  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [newReply, setNewReply] = useState(''); // State for new reply
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const clearAll = () => {
    setTimeout(() => {
      navigate('/admin/tickets'); // Redirect to another page after a delay
    }, 600);
  };

  useEffect(() => {
    const fetchTicketDetails = async () => {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`, // Include JWT token for authorization
        },
      };

      try {
        const response = await axios.get(
          `${API}/user/tickets/${ticketId}`, // Backend endpoint for fetching ticket details and comments
          config
        );

        if (response.status === 200) {
          setTicket(response.data.ticket); // Store ticket information
          setComments(response.data.comments); // Store existing comments
        } else {
          setMessage("Failed to fetch ticket details.");
        }
      } catch (error) {
        setMessage(error.response?.data?.error || 'An error occurred while fetching ticket details.');
      }
    };

    fetchTicketDetails(); // Fetch ticket details on component mount
  }, [ticketId, user.token]); // Dependency array to re-fetch when ticket ID or token changes

  const handleAddReply = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`, // Include JWT token for authorization
      },
    };

    if (!newReply.trim()) {
      setMessage("Please enter a valid reply."); // Ensure a non-empty reply
      return;
    }

    try {
      const response = await axios.post(
        `${API}/admin/tickets/${ticketId}/comments`, // Backend endpoint for adding replies
        {
          comment: newReply.trim(),
        },
        config
      );

      if (response.status === 201) {
        setComments([...comments, response.data.comment]); // Update comments list
        setNewReply(''); // Clear the input field
        setMessage("Reply added successfully.");
      } else {
        setMessage("Failed to add reply.");
      }
    } catch (error) {
      setMessage(error.response?.data?.error || 'An error occurred while adding the reply.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1vh' }}>
      {ticket ? (
        <div>
          <h3>{ticket.subject}</h3>
          <p>Status: {ticket.status}</p>
          <p>Created At: {new Date(ticket.created_at).toLocaleString()}</p>

          <h4>Comments:</h4>
          {comments.map((comment) => (
            <div key={comment.id} style={{ padding: '0.5em', border: '1px solid #ccc', borderRadius: '8px' }}>
              <p>{comment.comment}</p>
              <p>Posted At: {new Date(comment.created_at).toLocaleString()}</p>
            </div>
          ))}

          {/* Allow adding replies, even if the ticket is closed */}
          {ticket.status !== 'closed' && (
            <div style={{ marginTop: '1em' }}>
              <input
                type="text"
                value={newReply}
                onChange={(e) => setNewReply(e.target.value)}
                placeholder="Add a reply"
                style={{ padding: '0.5em', borderRadius: '8px' }}
              />
              <button
                onClick={handleAddReply}
                style={{ padding: '0.5em', borderRadius: '8px' }}
              >
                Add Reply
              </button>
            </div>
          )}

          {/* Close Ticket Button */}
          {ticket.status !== 'closed' && (
            <CloseTicketButton
              ticketId={ticketId}
              onTicketClosed={() => {
                setTicket((prev) => ({ ...prev, status: 'closed' })); // Update the ticket status locally
                clearAll(); // Redirect after closing the ticket
              }}
            />
          )}

          <p>{message}</p> {/* Display success or error messages */}
        </div>
      ) : (
        <p>Loading ticket details...</p> // Indicate when the ticket information is loading
      )}
    </div>
  );
};

export default AdminTicketDetail;
