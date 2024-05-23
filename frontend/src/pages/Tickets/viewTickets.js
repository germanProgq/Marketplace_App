import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '../Layout/assets/usercontext';
import { Link } from 'react-router-dom';

const API = process.env.API || 'http://localhost:4000';

// Component to view a user's previous tickets
const ViewTickets = () => {
  const { user } = useUser(); // Current user context
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchTickets = async () => {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`, // Include JWT token for authorization
        },
      };

      try {
        const response = await axios.get(
          `${API}/tickets`, // Backend endpoint for retrieving user tickets
          config
        );

        if (response.status === 200) {
          setTickets(response.data.tickets); // Store the tickets in state
        } else {
          setMessage("Failed to fetch tickets.");
        }
      } catch (error) {
        setMessage(error.response?.data?.error || 'An error occurred while fetching tickets.');
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [user.token]); // Fetch tickets when the component is mounted

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4vw' }}>
      <h3 style={{fontSize:'50px'}}>Your Support Tickets</h3>
      {loading ? (
        <p>Loading...</p> // Display loading message while fetching data
      ) : (
        <div style={{display:'flex', flexDirection:'column', gap:'3vw'}}>
          {tickets.length > 0 ? (
            tickets.map((ticket) => (
              <div key={ticket.id} style={{ padding: '1em', border: '1px solid #ccc', borderRadius: '8px' }}>
                <h4>{ticket.subject}</h4>
                <p>Status: {ticket.status}</p>
                <p>Created At: {new Date(ticket.created_at).toLocaleString()}</p>
                <button>
                <Link to={`/user/tickets/${ticket.id}`} style={{textAlign:'center', textDecoration:'none', fontWeight:'800', color: 'var(--primary)', }}>More</Link>
                </button>
              </div>
            ))
          ) : (
            <p>No support tickets found.</p>
          )}
        </div>
      )}
      <p>{message}</p> {/* Display error messages */}
    </div>
  );
};

export default ViewTickets;
