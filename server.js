const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Unir múltiples usos de app.use()
app.use(express.json());
app.use(cors({
  origin: function (origin, callback) {
    const whitelist = [
      'https://pwncat.com',
      'https://api.pwncat.com',
      'https://www.pwncat.com',
      'https://es.pwncat.com',
      'https://en.pwncat.com',
      // Agrega más subdominios si es necesario
    ];

    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
}));

// Configurar la conexión a PostgreSQL
const pool = new Pool({
  connectionString: process.env.DB_CONNECTION_STRING,
  ssl: {
    rejectUnauthorized: false, // Solo necesario si estás utilizando SSL
  },
});

// Ruta para guardar un mensaje con validación de email
app.post('/api/v0/saveMessage', async (req, res) => {
  try {
    const { fullName, email, description } = req.body;

    // Validación del formato del correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Si el correo electrónico es válido, procede con la inserción en la base de datos
    const queryText = 'INSERT INTO messages (full_name, email, description) VALUES ($1, $2, $3)';
    await pool.query(queryText, [fullName, email, description]);
    return res.status(201).json({ message: 'Message saved successfully' });
  } catch (error) {
    console.error('Error saving the message:', error);
    return res.status(500).json({ error: 'Error saving the message' });
  }
});

// Iniciar el servidor en el puerto especificado en la variable de entorno o en el puerto 3000
const PORT = process.env.PORT || 443;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
