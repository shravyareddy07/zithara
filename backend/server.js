const express = require('express');
const { Client } = require('pg');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;
app.use(cors());

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'customerdb',
  password: 'root',
  port: 5432,
});

client.connect();

app.get('/customers', async (req, res) => {
    try {
      let orderByClause = '';
  
      // Check if sortBy parameter is provided
      if (req.query.sortBy) {
        const sortBy = req.query.sortBy.toLowerCase();
  
        // Handle sorting by date
        if (sortBy === 'date') {
          orderByClause = 'ORDER BY DATE(created_at) DESC';
        }
      }
      
      
      // Construct the SQL query with the orderByClause
      let query = `SELECT * FROM customers`;
  
      // Check if search parameter is provided
      if (req.query.search) {
        const searchParam = req.query.search.toLowerCase();
        query += ` WHERE LOWER(customer_name) LIKE '%${searchParam}%' OR LOWER(location) LIKE '%${searchParam}%'`;
      }
  
      // Add orderByClause to the query
      
      query += ` ${orderByClause}`;
  
      const result = await client.query(query);
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching customers:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  
  

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
