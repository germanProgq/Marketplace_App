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

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = './uploads';
    if (!fs.existsSync(uploadDir)){
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

const client = new Client ({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_DATABASE_PORT,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  })
//Endpoint to get a cart by email
router.get('/:email', isAuthenticated, async (req, res) => {
    const email = req.params;
  
    if (req.user.email !== email.email) {
      return res.status(403).json({ error: 'Access denied' });
    }
  
    try {
      const cartResult = await client.query('SELECT id FROM Carts WHERE email = $1', [email.email]);
  
      if (cartResult.rowCount === 0) {
        return res.status(404).json({ error: 'Cart not found for this email' });
      }
  
      const cartId = cartResult.rows[0].id; // Get the cart ID
  
      const itemsResult = await client.query('SELECT * FROM CartItems WHERE cart_id = $1', [cartId]);
  
      res.status(200).json({ cartId, items: itemsResult.rows }); // Return the cart ID and items
    } catch (error) {
      console.error('Error retrieving cart:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }); 
  
  
  //POST endpoint to add items to the cart by email
  router.post('/add/:email/:itemId', async (req, res) => {
    try {
      const email = req.params.email;
      const itemId = req.params.itemId;
  
  
      let cartId;
      const cartResult = await client.query('SELECT * FROM Carts WHERE email = $1', [email]);
  
      if (cartResult.rows.length > 0) {
        cartId = cartResult.rows[0].id;
      } else {
        const newCartResult = await client.query(
          'INSERT INTO Carts (email) VALUES ($1) RETURNING id',
          [email]
        );
        cartId = newCartResult.rows[0].id;
      }
  
      const itemResult = await client.query(
        'SELECT * FROM CartItems WHERE cart_id = $1 AND item_id = $2',
        [cartId, itemId]
      );
  
      if (itemResult.rows.length > 0) {
          await client.query(
          'UPDATE CartItems SET item_quantity = item_quantity + 1 WHERE cart_id = $1 AND item_id = $2',
          [cartId, itemId]
        );
      } else {      
        await client.query(
          'INSERT INTO CartItems (cart_id, item_id, item_quantity) VALUES ($1, $2, $3)',
          [cartId, itemId, 1]
        );
      }
  
      res.status(201).json({ message: 'Item added to cart' });
    } catch (error) {
      console.error('Error adding item to cart:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  //Deletepoint to delete an item from a cart by email
  router.delete('/:email/:itemId', async (req, res) => {
    try {
      const email = req.params.email;
      const itemId = req.params.itemId;
  
        const cartResult = await client.query('SELECT * FROM Carts WHERE email = $1', [email]);
  
      if (cartResult.rows.length === 0) {
        return res.status(404).json({ error: 'Cart not found' });
      }
  
      const cartId = cartResult.rows[0].id;    
  
      const itemResult = await client.query(
        'SELECT * FROM CartItems WHERE cart_id = $1 AND item_id = $2',
        [cartId, itemId]
      );
  
      if (itemResult.rows.length === 0) {
        return res.status(404).json({ error: 'Item not found in cart' });
      }
  
      const itemQuantity = itemResult.rows[0].item_quantity;
  
      if (itemQuantity > 1) {
        await client.query(
          'UPDATE CartItems SET item_quantity = item_quantity - 1 WHERE cart_id = $1 AND item_id = $2',
          [cartId, itemId]
        );
        res.status(200).json({ message: 'Item quantity decreased' });
      } else {      
        await client.query(
          'DELETE FROM CartItems WHERE cart_id = $1 AND item_id = $2',
          [cartId, itemId]
        );
        res.status(200).json({ message: 'Item removed from cart' });
      }
    } catch (error) {
      console.error('Error updating cart:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });  

module.exports = router