import React from 'react';
import axios from 'axios';
import { useUser } from '../Layout/assets/usercontext';

const API = process.env.API || 'http://localhost:4000';

// Component to close a ticket by changing its status to 'closed'
const CloseTicketButton = ({ ticketId, onTicketClosed }) => {
  const { user } = useUser(); // Get the current user context

  const handleCloseTicket = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`, // Include JWT token for authorization
      },
    };

    try {
      const response = await axios.put(
        `${API}/admin/tickets/${ticketId}/close`, // Backend endpoint to close a ticket
        {},
        config
      );

      if (response.status === 200) {
        if (typeof onTicketClosed === 'function') {
          onTicketClosed(); // Callback function to refresh the component or display a success message
        }
        alert("Ticket closed successfully.");
      } else {
        alert("Failed to close the ticket.");
      }
    } catch (error) {
      alert(error.response?.data?.error || 'An error occurred while closing the ticket.');
    }
  };

  return (
    <button onClick={handleCloseTicket} style={{ padding: '0.5em', borderRadius: '8px' }}>
      Close Ticket
    </button>
  );
};

export default CloseTicketButton;
