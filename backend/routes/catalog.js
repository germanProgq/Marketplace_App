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
router.get('/catalog', async (req, res) => {
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
        GROUP BY
          c.id, ct.CategoryName
        ORDER BY
          CASE
            WHEN c.Priority = 'sponsor(2)' THEN 1
            WHEN c.Priority = 'sponsor(1)' THEN 2
            WHEN c.Priority = 'ad' THEN 3
            ELSE 4
          END
      `);
  
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching catalog items:', error);
      res.status(500).json({ error: 'An error occurred while fetching catalog items.' });
    }
  });  

 // Endpoint to add a catalog item
router.post('/add', upload.array('ItemImages', 10), async (req, res) => {
    const { ItemName, ItemDescription, ItemPrice, CategoryName, Priority, ItemLinks } = req.body;
    const itemImages = req.files.map(file => file.path);
    const itemLinksArray = JSON.parse(ItemLinks);
  
    try {
      const categoryResult = await client.query('SELECT id FROM Category WHERE CategoryName = $1', [CategoryName]);
      let categoryId;
      if (categoryResult.rows.length > 0) {
        categoryId = categoryResult.rows[0].id;
      } else {
        const newCategoryResult = await client.query('INSERT INTO Category (CategoryName) VALUES ($1) RETURNING id', [CategoryName]);
        categoryId = newCategoryResult.rows[0].id;
      }
  
      const result = await client.query(
        'INSERT INTO Catalog (ItemName, ItemDescription, ItemPrice, CategoryID, Priority, images, links) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
        [ItemName, ItemDescription, ItemPrice, categoryId, Priority, itemImages, itemLinksArray]
      );
      res.status(201).json({ message: 'Catalog item added successfully', id: result.rows[0].id });
    } catch (error) {
      console.error('Error adding catalog item:', error);
      res.status(500).send('Server Error');
    }
  });
  
  
//Endpoint to delete an item from the catalog
router.delete('/catalog/:id', isAuthenticated, checkRole(['admin', 'owner']), async (req, res) => {
    const catalogId = parseInt(req.params.id);
  
    if (isNaN(catalogId)) {
      return res.status(400).json({ error: 'Invalid catalog ID' });
    }
  
    try {
      const deleteResult = await client.query(
        'DELETE FROM Catalog WHERE id = $1',
        [catalogId]
      );
  
      if (deleteResult.rowCount === 0) {
        return res.status(404).json({ error: 'Item not found' });
      }
  
      res.status(200).json({ message: 'Item deleted successfully' });
    } catch (error) {
      console.error('Error deleting item:', error);
      res.status(500).json({ error: 'An error occurred while deleting the item' });
    }
  });
    module.exports = router