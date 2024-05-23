const express = require('express');
const router = express.Router();
const {Client} = require('pg');
const cors = require('cors');
const dotenv = require('dotenv')
const jwt = require('jsonwebtoken')
const multer = require('multer')
const isAuthenticated = require('../assets/authentication')
const checkRole = require('../assets/roleauth')
const fs = require('fs')

dotenv.config();  
router.use(cors());
router.use(express.json());
router.use(express.urlencoded({ extended: true }));


//Endpoint to update user email
router.put('/change-email', isAuthenticated, checkRole(['user', 'owner']), async (req, res) => {
    const { newEmail } = req.body; // New email provided by the user
    const { user } = req; // Authenticated user from JWT middleware
  
    if (!newEmail) {
      return res.status(400).json({ error: 'New email is required.' });
    }
  
    try {
      // Check if the new email is already registered
      const emailCheck = await client.query(
        'SELECT * FROM Users WHERE email = $1',
        [newEmail]
      );
  
      if (emailCheck.rowCount > 0) {
        return res.status(409).json({ error: 'Email is already in use.' });
      }
  
      // Update the user's email in the database
      await client.query(
        'UPDATE Users SET email = $1 WHERE id = $2',
        [newEmail, user.userId]
      );
  
      res.status(200).json({ message: 'Email changed successfully.' });
    } catch (error) {
      console.error('Error changing email:', error);
      res.status(500).json({ error: 'An error occurred while changing your email.' });
    }
  });
  
  // Endpoint to change user username
  router.put('/change-username', isAuthenticated, checkRole(['user', 'owner']), async (req, res) => {
    const { newUsername } = req.body; // New username provided by the user
    const { user } = req; // Authenticated user from JWT middleware
  
    if (!newUsername) {
      return res.status(400).json({ error: 'New username is required.' });
    }
  
    try {
      // Check if the new username is already registered
      const usernameCheck = await client.query(
        'SELECT * FROM Users WHERE username = $1',
        [newUsername]
      );
  
      if (usernameCheck.rowCount > 0) {
        return res.status(409).json({ error: 'Username is already in use.' });
      }
  
      // Update the user's username in the database
      await client.query(
        'UPDATE Users SET username = $1 WHERE id = $2',
        [newUsername, user.userId]
      );
  
      res.status(200).json({ message: 'Username changed successfully.' });
    } catch (error) {
      console.error('Error changing username:', error);
      res.status(500).json({ error: 'An error occurred while changing your username.' });
    }
  });
  
  // Endpoint to change user password and invalidate sessions
  router.put('/change-password', isAuthenticated, checkRole(['user', 'owner']), async (req, res) => {
    const { currentPassword, newPassword } = req.body; // Current and new passwords
    const { user } = req; // Authenticated user from JWT middleware
  
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new passwords are required.' });
    }
  
    try {
      // Get the stored hashed password for the user
      const userResult = await client.query(
        'SELECT * FROM Users WHERE id = $1',
        [user.userId]
      );
  
      if (userResult.rowCount === 0) {
        return res.status(404).json({ error: 'User not found.' });
      }
  
      const storedHashedPassword = userResult.rows[0].password; // Hashed password from DB
  
      // Validate the current password
      const isPasswordValid = await bcrypt.compare(currentPassword, storedHashedPassword);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Incorrect current password.' });
      }
  
      // Hash the new password
      const newHashedPassword = await bcrypt.hash(newPassword, 10);
  
      // Update the user's password in the database
      await client.query(
        'UPDATE Users SET password = $1 WHERE id = $2',
        [newHashedPassword, user.userId]
      );
  
      // Generate a new JWT token to invalidate the old token
      const newToken = jwt.sign(
        { id: user.userId, role: user.role },
        SECRET_KEY,
        { expiresIn: '1h' } // Set a new expiration time
      );
  
      // Return the new token, indicating the user needs to re-authenticate
      res.status(200).json({
        message: 'Password changed successfully.',
        newToken,
      });
    } catch (error) {
      console.error('Error changing password:', error);
      res.status(500).json({ error: 'An error occurred while changing your password.' });
    }
  });
  
  //Ednpoint to delete users
  router.delete('/', isAuthenticated, checkRole(['admin', 'owner']), async (req, res) => {
    const { email, username } = req.body;
  
    if (!email && !username) {
      return res.status(400).json({ error: 'Email or username must be provided' });
    }
  
    try {
      // Get the user details before deleting
      const userCondition = email ? 'email = $1' : 'username = $1';
      const userValue = email || username;
  
      const userResult = await client.query(
        `SELECT * FROM Users WHERE ${userCondition}`,
        [userValue]
      );
  
      if (userResult.rowCount === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Store user information in DeletedUsers
      const user = userResult.rows[0];
      if (user.role === 'user' || checkRole(['owner'])) {
      await client.query(
        `INSERT INTO DeletedUsers (username, password, email, created_at)
         VALUES ($1, $2, $3, CURRENT_TIMESTAMP)`,
        [user.username, user.password, user.email]
      );
  
      // Delete the user from the Users table
      await client.query(`DELETE FROM Users WHERE ${userCondition}`, [userValue]);
  
      res.status(200).json({ message: 'User deleted and info stored successfully' });
      }
      else {
        res.status(228).json({message: 'Please, do not delete other admins'})
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ error: 'An error occurred while deleting the user' });
    }
  });
  //Ednpoint to change user stuff (admin)
  router.put('/update', isAuthenticated, checkRole(['admin', 'owner']), async (req, res) => {
    const { targetEmail, targetUsername, newUsername, newEmail, newPassword } = req.body;
  
    let targetField;
    let targetValue;
  
    // Determine the target field (email or username)
    if (targetEmail) {
      targetField = 'email';
      targetValue = targetEmail;
    } else if (targetUsername) {
      targetField = 'username';
      targetValue = targetUsername;
    } else {
      return res.status(400).json({ error: 'Target email or username is required' });
    }
  
    try {
      // Validate if the user exists
      const userResult = await client.query(
        `SELECT * FROM Users WHERE ${targetField} = $1`,
        [targetValue]
      );
  
      if (userResult.rowCount === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      const updates = [];
      const values = [];
      let i = 2; // Starting index for placeholders
  
      // Push updates and associated values in the correct order
      if (newUsername) {
        // Check for unique username
        const usernameCheck = await client.query(
          `SELECT * FROM Users WHERE username = $1`,
          [newUsername]
        );
        if (usernameCheck.rowCount > 0) {
          return res.status(409).json({ error: 'Username already in use' });
        }
        updates.push(`username = $${i}`); // Ensure correct placeholder
        values.push(newUsername);
        i++; // Increment index
      }
  
      if (newEmail) {
        // Check for unique email
        const emailCheck = await client.query(
          `SELECT * FROM Users WHERE email = $1`,
          [newEmail]
        );
        if (emailCheck.rowCount > 0) {
          return res.status(409).json({ error: 'Email already in use' });
        }
        updates.push(`email = $${i}`); // Ensure correct placeholder
        values.push(newEmail);
        i++; // Increment index
      }
  
      if (newPassword) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        updates.push(`password = $${i}`); // Ensure correct placeholder
        values.push(hashedPassword);
      }
  
      // Construct the UPDATE query with correct indexing
      const updateQuery = `UPDATE Users SET ${updates.join(', ')} WHERE ${targetField} = $1`;
      
      // Execute the query with correct parameter count
      await client.query(
        updateQuery,
        [targetValue, ...values] // Ensure parameter count matches placeholders
      );
  
      res.status(200).json({ message: 'User information updated successfully' });
    } catch (error) {
      console.error('Error updating user information:', error);
      res.status(500).json({ error: 'An error occurred while updating the user' });
    }
  });
  //Endpoint for user to delete their account
router.delete('/delete-account', isAuthenticated, async (req, res) => {
    const { confirmationPassword } = req.body; // Password for confirmation
    const { user } = req; // Authenticated user from JWT middleware
  
    if (!confirmationPassword) {
      return res.status(400).json({ error: 'Confirmation password is required.' });
    }
  
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized. Please log in to delete your account.' });
    }
  
    try {
      // Get user details from the database
      const userResult = await client.query(
        'SELECT * FROM Users WHERE id = $1',
        [user.id]
      );
  
      if (userResult.rowCount === 0) {
        return res.status(404).json({ error: 'User not found.' });
      }
  
      const storedHashedPassword = userResult.rows[0].password; // Hashed password from DB
      const username = userResult.rows[0].username; // Retrieve the username
      const email = userResult.rows[0].email; // Retrieve the email
  
      // Validate the confirmation password
      const isPasswordValid = await bcrypt.compare(confirmationPassword, storedHashedPassword);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Incorrect confirmation password. Cannot delete account.' });
      }
  
      // Check if the record already exists in DeletedUsers
      const deletedUserCheck = await client.query(
        'SELECT * FROM DeletedUsers WHERE username = $1',
        [username]
      );
  
      if (deletedUserCheck.rowCount > 0) {
        return res.status(409).json({ error: 'This username already exists in DeletedUsers.' });
      }
  
      // Store user information in DeletedUsers
      await client.query(
        `INSERT INTO DeletedUsers (username, email, password, created_at)
         VALUES ($1, $2, $3, CURRENT_TIMESTAMP)`,
        [username, email, storedHashedPassword]
      );
  
      // If everything is okay, proceed with account deletion
      await client.query(
        'DELETE FROM Users WHERE id = $1',
        [user.id]
      );
  
      res.status(200).json({ message: 'Account deleted successfully.' });
    } catch (error) {
      console.error('Error deleting account:', error);
      res.status(500).json({ error: 'An error occurred while deleting your account.' });
    }
  });

  // Endpoint for user to view tickets by ID
router.get('/tickets/:ticketId', isAuthenticated, async (req, res) => {
    const { ticketId } = req.params; // Ticket ID from the route parameter
    const { user } = req; // Authenticated user
  
    try {
      // Retrieve the ticket details
      const ticketResult = await client.query(
        'SELECT * FROM Tickets WHERE id = $1 AND user_id = $2',
        [ticketId, user.userId] // Ensure the ticket belongs to the authenticated user
      );
  
      if (ticketResult.rowCount === 0) {
        return res.status(404).json({ error: 'Ticket not found.' });
      }
  
      const ticket = ticketResult.rows[0]; // Get ticket information
  
      // Retrieve the comments for the ticket
      const commentsResult = await client.query(
        'SELECT * FROM TicketComments WHERE ticket_id = $1 ORDER BY created_at',
        [ticketId] // Order comments by creation time
      );
  
      res.status(200).json({
        ticket,
        comments: commentsResult.rows, // Return the list of comments
      });
    } catch (error) {
      console.error('Error retrieving ticket details:', error);
      res.status(500).json({ error: 'An error occurred while retrieving the ticket details.' });
    }
  });
  
  // Endpoint for user to comment on tickets
  router.post('/tickets/:ticketId/comments', isAuthenticated, async (req, res) => {
    const { ticketId } = req.params; // Ticket ID from the URL
    const { comment } = req.body; // The new comment
    const { user } = req; // Authenticated user
  
    if (!comment) {
      return res.status(400).json({ error: 'Comment is required.' });
    }
  
    try {
      // Ensure the ticket exists and belongs to the user
      const ticketResult = await client.query(
        'SELECT * FROM Tickets WHERE id = $1 AND user_id = $2',
        [ticketId, user.userId]
      );
  
      if (ticketResult.rowCount === 0) {
        return res.status(404).json({ error: 'Ticket not found.' });
      }
  
      // Add the new comment to the TicketComments table
      const result = await client.query(
        'INSERT INTO TicketComments (ticket_id, user_id, comment) VALUES ($1, $2, $3) RETURNING id, created_at',
        [ticketId, user.userId, comment]
      );
  
      res.status(201).json({
        message: 'Comment added successfully.',
        comment: {
          id: result.rows[0].id,
          created_at: result.rows[0].created_at,
        },
      });
    } catch (error) {
      console.error('Error adding comment to ticket:', error);
      res.status(500).json({ error: 'An error occurred while adding the comment.' });
    }
  });
  // Endpoint to revoke admin privileges (Owner only)
router.put('/revoke-admin', isAuthenticated, checkRole(['admin', 'owner']), async (req, res) => {
    const { email, username } = req.body;
  
    if (!email && !username) {
      return res.status(400).json({ error: 'Email or username must be provided' });
    }
  
    let condition;
    let value;
  
    // Determine whether to revoke by email or username
    if (email) {
      condition = 'email = $1';
      value = email;
    } else {
      condition = 'username = $1';
      value = username;
    }
  
    try {
      // Check if the user exists
      const userResult = await client.query(
        `SELECT * FROM Users WHERE ${condition}`,
        [value]
      );
  
      if (userResult.rowCount === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Revoke admin access by setting the role to 'user'
      await client.query(
        `UPDATE Users SET role = 'user' WHERE ${condition}`,
        [value]
      );
  
      res.status(200).json({ message: 'Admin privileges revoked successfully' });
    } catch (error) {
      console.error('Error revoking admin privileges:', error);
      res.status(500).json({ error: 'An error occurred while revoking admin privileges' });
    }
  });

module.exports = router