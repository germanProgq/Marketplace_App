import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../Layout/assets/usercontext';

const API = process.env.API || 'http://localhost:4000';

// Component to view all open tickets, sorted by priority
const AdminOpenTickets = () => {
  const { user } = useUser(); // Current user context
  const navigate = useNavigate(); // Navigation hook for routing
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchOpenTickets = async () => {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`, // Include JWT token for authorization
        },
      };

      try {
        const response = await axios.get(
          `${API}/admin/tickets/open`, // Backend endpoint for open tickets
          config
        );

        if (response.status === 200) {
          setTickets(response.data.tickets); // Store open tickets in state
        } else {
          setMessage("Failed to fetch open tickets.");
        }
      } catch (error) {
        setMessage(error.response?.data?.error || 'An error occurred while fetching open tickets.');
      } finally {
        setLoading(false); // Indicate loading is complete
      }
    };

    fetchOpenTickets(); // Fetch the list of open tickets on component mount
  }, [user.token]); // Dependency array to refetch when token changes

  const handleTicketClick = (ticketId) => {
    navigate(`/admin/tickets/${ticketId}`); // Navigate to the ticket detail page
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1vh' }}>
      <h3 style={{fontSize:'50px'}}>Open Tickets</h3>
      {loading ? (
        <p>Loading open tickets...</p> // Display loading message while fetching data
      ) : (
        <div style={{display: 'flex', flexDirection:'column', gap:'3vw'}}>
          {tickets.length > 0 ? (
            tickets.map((ticket) => (
              <div
                key={ticket.id}
                onClick={() => handleTicketClick(ticket.id)} // Navigate to the ticket detail page
                style={{ padding: '1em', border: '1px solid #ccc', borderRadius: '8px', cursor: 'pointer' }}
              >
                <h4>{ticket.subject}</h4>
                <p>Priority: {ticket.priority}</p>
                <p>Status: {ticket.status}</p>
                <p>Created At: {new Date(ticket.created_at).toLocaleString()}</p>
              </div>
            ))
          ) : (
            <p>No open tickets found.</p> // Display if there are no open tickets
          )}
        </div>
      )}
      <p>{message}</p> {/* Display error messages */}
    </div>
  );
};

export default AdminOpenTickets;
