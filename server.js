require('dotenv').config(); // Load environment variables from .env

const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.APP_PORT || 3000;

// Middleware
app.use(express.static('public'));
app.use(bodyParser.json());

const path = require('path');

// Serve Admin Page
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

// MySQL connection with retry logic
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const maxRetries = 10; // Maximum number of retries
let retries = 0;

function connectWithRetry() {
  db.connect((err) => {
    if (err) {
      retries++;
      console.error(`Database connection failed: ${err.message}`);
      if (retries > maxRetries) {
        console.error('Max retries reached. Exiting...');
        process.exit(1); // Exit the app if connection cannot be established
      }
      console.log(`Retrying connection (${retries}/${maxRetries})...`);
      setTimeout(connectWithRetry, 5000); // Retry after 5 seconds
    } else {
      console.log('Connected to MySQL');
      startServer(); // Start the server only after the database connection is successful
    }
  });
}

// Start the Express server
function startServer() {
  // API to fetch products
app.get('/api/products', (req, res) => {
  db.query('SELECT * FROM products', (err, results) => {
    if (err) {
      console.error('Error fetching products:', err.message);
      return res.status(500).json({ error: 'Failed to fetch products' });
    }

    // Add default image for missing image values
    const products = results.map((product) => ({
      ...product,
      image: product.image || '/images/default.jpg',
    }));

    res.json(products);
  });
});

  // API to add items to the cart
  app.post('/api/cart', (req, res) => {
    const { customerId, productId, quantity } = req.body;

    // Log the request for debugging
    console.log(`Adding to cart: CustomerID=${customerId}, ProductID=${productId}, Quantity=${quantity}`);

    db.query(
      'INSERT INTO cart (customer_id, product_id, quantity) VALUES (?, ?, ?)',
      [customerId, productId, quantity],
      (err) => {
        if (err) {
          console.error('Error adding to cart:', err.message);
          return res.status(500).json({ error: 'Failed to add item to cart' });
        }
        res.json({ message: 'Item added to cart successfully' });
      }
    );
  });

  // API to fetch cart items for a customer
  app.get('/api/cart/:customerId', (req, res) => {
    const { customerId } = req.params;

    db.query(
      `SELECT cart.id, products.name, products.price, cart.quantity 
       FROM cart 
       JOIN products ON cart.product_id = products.id 
       WHERE cart.customer_id = ?`,
      [customerId],
      (err, results) => {
        if (err) {
          console.error('Error fetching cart:', err.message);
          return res.status(500).json({ error: 'Failed to fetch cart' });
        }
        res.json(results);
      }
    );
  });
// Add a new product
app.post('/api/products', (req, res) => {
  const { name, price, image } = req.body;

  db.query(
    'INSERT INTO products (name, price, image) VALUES (?, ?, ?)',
    [name, price, image],
    (err, result) => {
      if (err) {
        console.error('Error adding product:', err.message);
        return res.status(500).json({ error: 'Failed to add product' });
      }
      res.json({ message: 'Product added successfully', productId: result.insertId });
    }
  );
});

// Remove a product
app.delete('/api/products/:productId', (req, res) => {
  const { productId } = req.params;

  db.query('DELETE FROM products WHERE id = ?', [productId], (err) => {
    if (err) {
      console.error('Error deleting product:', err.message);
      return res.status(500).json({ error: 'Failed to delete product' });
    }
    res.json({ message: 'Product removed successfully' });
  });
});


  app.delete('/api/cart/:cartId', (req, res) => {
    const { cartId } = req.params;
  
    db.query('DELETE FROM cart WHERE id = ?', [cartId], (err) => {
      if (err) {
        console.error('Error removing item from cart:', err.message);
        return res.status(500).json({ error: 'Failed to remove item from cart' });
      }
      res.json({ message: 'Item removed from cart successfully' });
    });
  });
  // Start the server
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

// Initialize database connection
connectWithRetry();
