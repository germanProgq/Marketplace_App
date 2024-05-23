const express = require('express');
const router = express.Router();
const {Client} = require('pg');
const cors = require('cors');
const dotenv = require('dotenv')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const isAuthenticated = require('./assets/authentication')
const checkRole = require('./assets/roleauth')
const catalogRoutes = require('./routes/catalog')
const cartRoutes = require('./routes/cart')
const userRoutes = require('./routes/user')
const Buffer = require('buffer').Buffer




dotenv.config();

const { body, validationResult } = require('express-validator');
const { isatty } = require('tty');
const { error } = require('console');

const createHashedPassword = async(textPass) => {
  const saltRounds = 10;
  return bcrypt.hash(textPass, saltRounds);
};

const SECRET_KEY = process.env.JWT_SECRET_KEY || 'default_secret_key';
const base64EncodedKey = Buffer.from(SECRET_KEY).toString('base64')

app = express();

const client = new Client ({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: process.env.DB_DATABASE_PORT,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
})

client.connect()
    .then(() => {return client.query(`CREATE TABLE IF NOT EXISTS Messages (id SERIAL PRIMARY KEY, first_name VARCHAR(50), last_name VARCHAR(50), email VARCHAR(100), message TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);`);})
    .then(() => {return client.query(`CREATE TABLE IF NOT EXISTS Category (id SERIAL PRIMARY KEY, CategoryName VARCHAR(50) NOT NULL);`);})
    .then(() => {return client.query(`CREATE TABLE IF NOT EXISTS Catalog (id SERIAL PRIMARY KEY, ItemName VARCHAR(100) NOT NULL, ItemDescription TEXT, ItemPrice DECIMAL(10, 2), CategoryID INT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (CategoryID) REFERENCES Category(id));`);})
    .then(() => {return client.query(`CREATE TABLE IF NOT EXISTS DeletedUsers (id SERIAL PRIMARY KEY, username VARCHAR(50) UNIQUE NOT NULL, password VARCHAR(100) NOT NULL, email VARCHAR(100) UNIQUE NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);`);})  
    .then(() => {return client.query(`CREATE TABLE IF NOT EXISTS Users (id SERIAL PRIMARY KEY, username VARCHAR(50) UNIQUE NOT NULL, password VARCHAR(100) NOT NULL, email VARCHAR(100) UNIQUE NOT NULL, role VARCHAR(20) DEFAULT 'user', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);`);})
    .then(() => {return client.query(`CREATE TABLE IF NOT EXISTS ItemImages (id SERIAL PRIMARY KEY, CatalogID INT, ImagePath VARCHAR(255), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (CatalogID) REFERENCES Catalog(id) ON DELETE CASCADE);`);})
    .then(() => {return client.query(`CREATE TABLE IF NOT EXISTS Carts (id SERIAL PRIMARY KEY, email VARCHAR(255) NOT NULL);`);})
    .then(() => {return client.query(`CREATE INDEX IF NOT EXISTS idx_carts_email ON Carts (email);`)})
    .then(() => {return client.query(`CREATE TABLE IF NOT EXISTS Orders (id SERIAL PRIMARY KEY, items JSONB, user_email VARCHAR(255), timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP, location VARCHAR(255), phone VARCHAR(20), payment_method VARCHAR(50));`);})
    .then(() => {return client.query(`CREATE TABLE IF NOT EXISTS CartItems (cart_id INTEGER, item_id VARCHAR(255), item_quantity INTEGER DEFAULT 1, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (cart_id, item_id), FOREIGN KEY (cart_id) REFERENCES Carts(id) ON DELETE CASCADE);`);})
    .then(() => {return client.query(`CREATE INDEX IF NOT EXISTS idx_cartitems_cart_id ON CartItems (cart_id);`)})  
    .then(() => {return client.query(`CREATE TABLE IF NOT EXISTS Orders (id SERIAL PRIMARY KEY, cart_id INTEGER, user_email VARCHAR(255), items JSONB, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (cart_id) REFERENCES Carts(id), FOREIGN KEY (user_email) REFERENCES Carts(email));`)})
    .then(() => {return client.query(`CREATE TABLE IF NOT EXISTS IP (id SERIAL PRIMARY KEY, user_id INT, ipv4 VARCHAR(15), ipv6 VARCHAR(39), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);`)})
    .then(() => {return client.query(`CREATE TABLE IF NOT EXISTS AuditLogs (id SERIAL PRIMARY KEY, user_id INT, action VARCHAR(255), timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE);`)}) 
    .then(() => {return client.query(`CREATE TABLE IF NOT EXISTS Tickets (id SERIAL PRIMARY KEY, user_id INT, subject VARCHAR(255), description TEXT, status VARCHAR(50) DEFAULT 'open', priority VARCHAR(50) DEFAULT 'normal', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES Users(id));`)}) 
    .then(() => {return client.query(`CREATE TABLE IF NOT EXISTS TicketComments (id SERIAL PRIMARY KEY, ticket_id INT, user_id INT, comment TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (ticket_id) REFERENCES Tickets(id), FOREIGN KEY (user_id) REFERENCES Users(id));`)}) 
    .then(() => {return client.query(`CREATE TABLE IF NOT EXISTS Purchases (id SERIAL PRIMARY KEY, user_id INT NOT NULL, item_id INT NOT NULL, createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES Users(id), FOREIGN KEY (item_id) REFERENCES Catalog(id));`);})
    .then(() => {return client.query(`CREATE TABLE IF NOT EXISTS Reviews (id SERIAL PRIMARY KEY, item_id INT NOT NULL, user_id INT NOT NULL, rating INT NOT NULL, comment TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (item_id) REFERENCES Catalog(id), FOREIGN KEY (user_id) REFERENCES Users(id));`);})


  .then(() => {console.log('Database connection established.\nMessages, Users, ItemImages, Category, Catalog, Carts, Orders tables are ready.');})
  .catch((err) => {console.error('Error: ', err + ".");});

router.use('/catalog', catalogRoutes )
router.use('/cart', cartRoutes)
router.use('/user', userRoutes)

//POST endpoint for contact section
router.post('/contact', async (req, res) => {
  const { FirstName, LastName, email, Message } = req.body;
  (async () => {
    try {
      const result = await client.query(
        'INSERT INTO Messages (first_name, last_name, email, message) VALUES ($1, $2, $3, $4) RETURNING id',
        [FirstName, LastName, email, Message]
      );
  
      res.status(201).send(`Your message has been sent!`);
      console.log('Message Inserted');
    } catch (err) {
      console.error('Error:', err);
      res.status(500).send('An error occurred. Please try again later');
    } finally {
      // await client.end();
    }
  })();
});

app.use(async (req, res, next) => {
  const userIp = req.ip;

  const ipv4 = userIp.split(':').pop();
  const ipv6 = userIp;

  await client.query(
    'INSERT INTO IP (user_id, ipv4, ipv6) VALUES ($1, $2, $3)',
    [req.user?.id || null, ipv4, ipv6]
  );

  next();
});

//POST endpoint for user sign up
router.post('/sign',
  [
    body('username').isString().isLength({ min: 1 }).trim(), // Validate username
    body('email').isEmail().normalizeEmail(), // Validate and normalize email
    body('password').isString().isLength({ min: 6 }).trim(), // Validate password length
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }); // Return validation errors
    }

    const { username, email, password } = req.body;

    try {
      const hashedPassword = await bcrypt.hash(password, 10); // Hash the password with bcrypt

      const result = await client.query(
        'INSERT INTO Users (username, password, email) VALUES ($1, $2, $3) RETURNING id',
        [username, hashedPassword, email]
      );

      res.status(201).json({ message: 'User created', userId: result.rows[0].id });
      console.log('User Created.');
    } catch (err) {
      if (err.code === '23505') {
        res.status(409).json({ message: 'Username or email is already registered' });
      } else {
        console.error('Error inserting user:', err);
        res.status(500).json({ message: 'An error occurred while processing your request.' });
      }
    }
  }
);

// POST endpoint for user login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await client.query(
      'SELECT * FROM Users WHERE username = $1',
      [username]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = result.rows[0];
    const isCorrectPass = await bcrypt.compare(password, user.password);

    if (!isCorrectPass) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username, email: user.email, role: user.role },
      SECRET_KEY,
      { expiresIn: '1h' } 
    );
    const userIp = req.ip;
    const ipv4 = userIp.split(':').pop();
    const ipv6 = userIp;

    // Store IP in the database
    await client.query(
      'INSERT INTO IP (user_id, ipv4, ipv6) VALUES ($1, $2, $3)',
      [user.id, ipv4, ipv6]
    );


    res.status(200).json({ message: 'Login successful', token});
    console.log('User logged in successfully.');
  } catch (err) {
    console.error('Error logging in:', err);
    res.status(500).json({ message: 'An error occurred while processing your request' });
  }
});

//POST for automatic user login usung token
router.post('/token-login', async(req, res) => {
  const {token} = req.body;
  try {
    const verify = jwt.verify(token, SECRET_KEY)
    if (!verify) {
      return res.status(400).send({error: 'Could not verify token'})
    }
    const decoded = jwt.decode(token, SECRET_KEY);
    const userId = decoded.userId; // Extract user ID from decoded token

    const result =  await client.query('SELECT * FROM Users WHERE id = $1', [userId])
    if (result.rows === 0) {
      return res.status(404).send({error: 'User not found'})
    }
    const user = result.rows[0]
    const newToken = jwt.sign(
      { userId: user.id, username: user.username, email: user.email, role: user.role },
      SECRET_KEY,
      { expiresIn: '1h' } 
    );
    const userIp = req.ip;
    const ipv4 = userIp.split(':').pop();
    const ipv6 = userIp;

    // Store IP in the database
    await client.query(
      'INSERT INTO IP (user_id, ipv4, ipv6) VALUES ($1, $2, $3)',
      [user.id, ipv4, ipv6]
    );

    res.status(200).json({user:user, token: newToken }); // Return the new access token
    console.log('User logged in successfully.');
  } catch (err) {
    console.error('Error logging in:', err);
    res.status(500).json({ message: 'An error occurred while processing your request' });
  }
})




app.use(cors());
//Endpoint to get items by id
router.get('/items/:id', async (req, res) => {
  const itemId = req.params.id;
  try {
    const result = await client.query(`
      SELECT 
        c.id,
        c.ItemName,
        c.ItemDescription,
        c.ItemPrice,
        ct.CategoryName,
        json_agg(i.ImagePath) AS ItemImages
      FROM 
        Catalog c
      LEFT JOIN
        Category ct ON c.CategoryID = ct.id
      LEFT JOIN
        ItemImages i ON c.id = i.CatalogID
      WHERE
        c.id = $1
      GROUP BY
        c.id, ct.CategoryName
    `, [itemId]);

    if (result.rows.length > 0) {
      res.json(result.rows[0]); // Send the item details
    } else {
      res.status(404).json({ error: 'Item not found' });
    }
  } catch (error) {
    console.error('Error during database query:', error);
    res.status(500).json({ error: 'An error occurred while fetching item details.' });
  }
});

//Endpoint to fetch user info
router.get('/user-info/:username', async (req, res) => {
  try {
    const { username } = req.params;
    if (!username) {
      return res.status(400).json({ error: 'Username parameter is required' });
    }

    const result = await client.query(
      "SELECT * FROM Users WHERE username = $1", [username.toString()]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(result.rows);
   
  } catch (err) {
    console.error('Error fetching user information:', err);
    res.status(500).json({ error: 'An error occurred while processing your request' });
  }
});

async function usernameExists(username) {
  const result = await client.query('SELECT 1 FROM Users WHERE username = $1', [username]);
  return result.rowCount > 0;
}
//Endpoint to update a user's username
router.post('/update-username', async (req, res) => {
  const { username, newUsername } = req.body;

  try {
    const exists = await usernameExists(newUsername);

    if (exists) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const updateResult = await client.query(
      'UPDATE Users SET username = $1 WHERE username = $2 RETURNING username',
      [newUsername, username]
    );

    if (updateResult.rowCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ message: 'Username updated', newUsername: updateResult.rows[0].username });
  } catch (error) {
    console.error('Error updating username:', error);
    return res.status(500).json({ message: error.message || 'Internal server error' });
  }
});

//Endpoint to grant admin (Owner only)
router.put('/owner/grant-admin', isAuthenticated, checkRole(['owner']), async (req, res) => {
  const { email, username } = req.body;

  if (!email && !username) {
    return res.status(400).json({ error: 'Email or username must be provided' });
  }

  let condition;
  let value;

  // Determine whether granting admin by email or username
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

    // Update the user role to 'admin'
    await client.query(
      `UPDATE Users SET role = 'admin' WHERE ${condition}`,
      [value]
    );

    res.status(200).json({ message: 'Admin privileges granted successfully' });
  } catch (error) {
    console.error('Error granting admin privileges:', error);
    res.status(500).json({ error: 'An error occurred while granting admin privileges' });
  }
});

//Endpoint to see FULL user data
router.get('/owner/user/download', isAuthenticated, checkRole(['owner']), async (req, res) => {
  const { email, username } = req.query; // Get email or username from query parameters

  if (!email && !username) {
    return res.status(400).json({ error: 'Email or username must be provided' });
  }

  let condition;
  let value;

  if (email) {
    condition = 'email = $1';
    value = email;
  } else {
    condition = 'username = $1';
    value = username;
  }

  try {
    // Retrieve user information from the database
    const userResult = await client.query(
      `SELECT * FROM Users WHERE ${condition}`,
      [value]
    );

    if (userResult.rowCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = userResult.rows[0];

    // Fetch IP addresses for the user
    const ipResult = await client.query(
      'SELECT ipv4, ipv6 FROM IP WHERE user_id = $1',
      [user.id]
    );

    const userInfo = `
  User ID: ${user.id}
  Username: ${user.username}
  Email: ${user.email}
  Role: ${user.role}
  Created At: ${user.created_at}
  IP Addresses:
  ${ipResult.rows.map(ip => `IPv4: ${ip.ipv4}, IPv6: ${ip.ipv6}`).join('\n')}
  `;

    // Set headers for file download
    res.setHeader('Content-Disposition', `attachment; filename=user_info.txt`);
    res.setHeader('Content-Type', 'text/plain');

    // Send the data as a text file
    res.status(200).send(userInfo);
  } catch (error) {
    console.error('Error fetching user information:', error);
    res.status(500).json({ error: 'An error occurred while fetching user information' });
  }
});

// Endpoint for admin to impersonate a user
router.post('/admin/impersonate', isAuthenticated, checkRole(['admin', 'owner']), async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    // Retrieve user by username
    const userResult = await client.query(
      'SELECT * FROM Users WHERE username = $1',
      [username]
    );

    if (userResult.rowCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = userResult.rows[0];

    // Ensure the target user has the 'user' role (to prevent impersonating admins/owners)
    if (user.role === 'owner' || user.role === 'admin') {
      return res.status(403).json({ error: 'Cannot impersonate users with roles Admin or Owner' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Incorrect password' });
    }

    // Generate a JWT token to impersonate the user
    const token = jwt.sign(
      { id: user.id, role: user.role },
      SECRET_KEY,
      { expiresIn: '1h' } // Set an appropriate expiration time
    );

    // Log the impersonation action for auditing purposes
    await client.query(
      'INSERT INTO AuditLogs (admin_id, user_id, action, timestamp) VALUES ($1, $2, $3, CURRENT_TIMESTAMP)',
      [req.user.id, user.id, 'Impersonated User']
    );

    res.status(200).json({ token });
  } catch (error) {
    console.error('Error during impersonation:', error);
    res.status(500).json({ error: 'An error occurred while impersonating the user' });
  }
});

// Endpoint to create a new support ticket
router.post('/tickets', isAuthenticated, async (req, res) => {
  const { subject, description } = req.body; // Ticket details from the frontend
  const { user } = req; // Authenticated user from JWT middleware

  if (!subject || !description) {
    return res.status(400).json({ error: 'Subject and description are required.' });
  }

  try {
    const result = await client.query(
      'INSERT INTO Tickets (user_id, subject, description) VALUES ($1, $2, $3) RETURNING id, created_at',
      [user.userId, subject, description]
    );

    res.status(201).json({
      message: 'Ticket created successfully.',
      ticket: {
        id: result.rows[0].id,
        created_at: result.rows[0].created_at,
      },
    });
  } catch (error) {
    console.error('Error creating ticket:', error);
    res.status(500).json({ error: 'An error occurred while creating the ticket.' });
  }
});

// Endpoint to get a user's previous tickets
router.get('/tickets', isAuthenticated, async (req, res) => {
  const { user } = req; // Authenticated user

  try {
    const result = await client.query(
      'SELECT * FROM Tickets WHERE user_id = $1 ORDER BY created_at DESC',
      [user.userId]
    );

    res.status(200).json({
      tickets: result.rows, // Return the list of tickets
    });
  } catch (error) {
    console.error('Error retrieving tickets:', error);
    res.status(500).json({ error: 'An error occurred while retrieving tickets.' });
  }
});

// Endpoint for admins to add replies to a specific ticket
router.post('/admin/tickets/:ticketId/comments', isAuthenticated, checkRole(['admin', 'owner']), async (req, res) => {
  const { ticketId } = req.params; // Ticket ID from the route parameter
  const { comment } = req.body; // The comment/reply text
  const { user } = req; // Authenticated admin

  if (!comment) {
    return res.status(400).json({ error: 'Comment is required.' });
  }

  try {
    // Check if the ticket exists
    const ticketResult = await client.query(
      'SELECT * FROM Tickets WHERE id = $1',
      [ticketId]
    );

    if (ticketResult.rowCount === 0) {
      return res.status(404).json({ error: 'Ticket not found.' });
    }

    // Add a reply to the ticket
    const result = await client.query(
      'INSERT INTO TicketComments (ticket_id, user_id, comment) VALUES ($1, $2, $3) RETURNING id, created_at',
      [ticketId, user.userId, comment]
    );

    res.status(201).json({
      message: 'Reply added successfully.',
      comment: {
        id: result.rows[0].id,
        created_at: result.rows[0].created_at,
      },
    });
  } catch (error) {
    console.error('Error adding reply to ticket:', error);
    res.status(500).json({ error: 'An error occurred while adding the reply.' });
  }
});

// Endpoint to get all open tickets, sorted by priority
router.get('/admin/tickets/open', isAuthenticated, checkRole(['admin', 'owner']), async (req, res) => {
  try {
    const result = await client.query(
      'SELECT * FROM Tickets WHERE status = $1 ORDER BY priority, created_at DESC',
      ['open'] // Filter for open tickets, sorted by priority and then by creation time
    );

    res.status(200).json({
      tickets: result.rows, // Return the list of open tickets
    });
  } catch (error) {
    console.error('Error retrieving open tickets:', error);
    res.status(500).json({ error: 'An error occurred while retrieving open tickets.' });
  }
});

//Endpoint to close a ticket by Id
router.put('/admin/tickets/:ticketId/close', isAuthenticated, checkRole(['admin', 'owner']), async (req, res) => {
  const { ticketId } = req.params; // Retrieve the ticket ID from the URL

  try {
    // Check if the ticket exists and is not already closed
    const ticketResult = await client.query(
      'SELECT * FROM Tickets WHERE id = $1',
      [ticketId]
    );

    if (ticketResult.rowCount === 0) {
      return res.status(404).json({ error: 'Ticket not found.' });
    }

    const ticket = ticketResult.rows[0];

    if (ticket.status === 'closed') {
      return res.status(400).json({ error: 'Ticket is already closed.' });
    }

    // Update the ticket status to 'closed'
    await client.query(
      'UPDATE Tickets SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      ['closed', ticketId]
    );

    res.status(200).json({ message: 'Ticket closed successfully.' });
  } catch (error) {
    console.error('Error closing the ticket:', error);
    res.status(500).json({ error: 'An error occurred while closing the ticket.' });
  }
});

router.get('/reviews/:itemId', async (req, res) => {
  const itemId = req.params.itemId;

  try {
    const result = await client.query(`
      SELECT r.id, r.rating, r.comment, r.created_at, u.username
      FROM Reviews r
      INNER JOIN Users u ON r.user_id = u.id
      WHERE r.item_id = $1
    `, [itemId]);

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'An error occurred while fetching reviews.' });
  }
});

// Endpoint to add a review for an item
router.post('/reviews/:userEmail/:itemId', isAuthenticated, async (req, res) => {
  const { rating, comment } = req.body;
  const itemId = req.params.itemId;
  const userEmail = req.params.userEmail;

  try {
    const resUserId = await client.query(`SELECT * FROM Users
    WHERE email = $1`, [userEmail])
    userId = (resUserId.rows[0].id)
    // Check if the user has purchased the item
    const purchaseResult = await client.query(`
      SELECT * FROM Purchases
      WHERE user_id = $1 AND item_id = $2
    `, [userId, itemId]);

    if (purchaseResult.rows.length === 0) {
      return res.status(403).json({ error: 'You must purchase the item before adding a review.' });
    }

    // Insert the review into the database
    const insertResult = await pool.query(`
      INSERT INTO Reviews (item_id, userId, rating, comment)
      VALUES ($1, $2, $3, $4)
      RETURNING id
    `, [itemId, userId, rating, comment]);

    res.status(201).json({ message: 'Review added successfully.', reviewId: insertResult.rows[0].id });
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ error: 'An error occurred while adding the review.' });
  }
});

//Endpoint to update user role
router.put('/grant-role', isAuthenticated, checkRole(['admin', 'owner']), async (req, res) => {
  const { email, username, role } = req.body; 

  try {
    let userResult
    if (email) {
      userResult = await client.query('SELECT role FROM Users where email = $1', [email])
    }
    else if (username) {
      userResult = await client.query('SELECT role FROM Users where username = $1', [username])
    }
    if (userResult.rows[0].role === 'owner') {
      return res.status(400).json({error: 'Cannot change owner`s role'})
    }
    let queryResult;
    if (email) {
      queryResult = await client.query('UPDATE Users SET role = $1 WHERE email = $2', [role, email]);
    } else if (username) {
      queryResult = await client.query('UPDATE Users SET role = $1 WHERE username = $2', [role, username]);
    }

    if (queryResult.rowCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: `Role "${role}" granted to user successfully` });
  } catch (error) {
    console.error('Error granting role:', error);
    res.status(500).json({ error: 'An error occurred while granting role' });
  }
});

//Endpoint for user profile
router.get('/profile/:username', async (req, res) => {
  const { username } = req.params;

  try {
    // Fetch user profile information from the database using the username
    const userResult = await client.query('SELECT * FROM Users WHERE username = $1', [username]);
    
    if (userResult.rowCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = userResult.rows[0];

    // Fetch orders associated with the user
    const ordersResult = await client.query('SELECT * FROM Orders WHERE user_email = $1', [user.email]);
    const orders = ordersResult.rows;
    const totalOrderAmount = orders.reduce((acc, order) => acc + order.amount, 0);

    res.status(200).json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      orders: orders,
      totalOrderAmount: totalOrderAmount,
      numOfOrders: orders.length,
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'An error occurred while fetching user profile' });
  }
});


const REFRESH_SECRET_KEY = process.env.JWT_REFRESH_SECRET_KEY;
router.post('/refresh-token', async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ error: 'Refresh token is required' }); // Validate input
  }

  try {
    // Verify the refresh token using the refresh secret key
    const decoded = jwt.verify(refreshToken, REFRESH_SECRET_KEY); // Use refresh secret key
    const userId = decoded.userId; // Extract user ID from decoded token

    // Query the database to confirm the user exists
    const result = await client.query('SELECT * FROM Users WHERE id = $1', [userId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'User not found' }); // Handle user not found
    }

    const user = result.rows[0];

    // Issue a new access token
    const newToken = jwt.sign(
      { userId: user.id, username: user.username, email: user.email, role: user.role }, 
      SECRET_KEY, 
      { expiresIn: '1h' }
    );

    res.status(200).json({user:user, token: newToken }); // Return the new access token
  } catch (error) {
    console.error('Error refreshing token:', error);
    return res.status(401).json({ error: 'Invalid refresh token' });
  }
});

module.exports = router;