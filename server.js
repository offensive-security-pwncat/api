const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
app.use(express.json());

// Configurar la conexión a PostgreSQL
const pool = new Pool({
  connectionString: process.env.DB_CONNECTION_STRING, // Asegúrate de configurar esta variable de entorno
  ssl: {
    rejectUnauthorized: false, // Solo necesario si estás utilizando SSL
  },
});

// Ruta para guardar un mensaje
app.post('/api/v0/saveMessage', async (req, res) => {
  try {
    const { fullName, email, description } = req.body;
    const queryText = 'INSERT INTO messages (full_name, email, description) VALUES ($1, $2, $3)';
    await pool.query(queryText, [fullName, email, description]);
    res.status(201).json({ message: 'Message saved successfully' });
  } catch (error) {
    console.error('Error saving the message:', error);
    res.status(500).json({ error: 'Error saving the message' });
  }
});

// Iniciar el servidor en el puerto 3001 (puedes cambiar el puerto si es necesario)
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
