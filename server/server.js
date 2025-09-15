// =========================
// SERVER SETUP
// =========================
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const ADMIN_KEY = process.env.ADMIN_KEY || 'supersecretkey123';

// =========================
// MIDDLEWARE
// =========================
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../'))); // Serve frontend files

// =========================
// CONTACT ENDPOINT (JSON Logging)
// =========================
app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;

  if(!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }

  const newMessage = { name, email, message, timestamp: new Date().toISOString() };
  const filePath = path.join(__dirname, 'contacts.json');

  fs.readFile(filePath, 'utf8', (err, data) => {
    let messages = [];

    if(err && err.code !== 'ENOENT') {
      console.error('Error reading contacts.json:', err);
      return res.status(500).json({ success: false, message: 'Server error.' });
    }

    try {
      messages = data ? JSON.parse(data) : [];
    } catch(parseErr) {
      console.error('JSON parse error:', parseErr);
      messages = []; // reset if corrupted
    }

    messages.push(newMessage);

    fs.writeFile(filePath, JSON.stringify(messages, null, 2), (err) => {
      if(err) {
        console.error('Error writing to contacts.json:', err);
        return res.status(500).json({ success: false, message: 'Server error.' });
      }
      return res.json({ success: true });
    });
  });
});

// =========================
// ADMIN ENDPOINT TO VIEW CONTACTS
// =========================
app.get('/api/messages', (req, res) => {
  const key = req.headers['x-admin-key'];
  if(key !== ADMIN_KEY) {
    return res.status(403).json({ success: false, message: 'Unauthorized' });
  }

  const filePath = path.join(__dirname, 'contacts.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if(err) {
      if(err.code === 'ENOENT') return res.json([]);
      console.error('Error reading contacts.json:', err);
      return res.status(500).json({ success: false, message: 'Server error.' });
    }

    try {
      const messages = JSON.parse(data);
      return res.json(messages);
    } catch(parseErr) {
      console.error('JSON parse error:', parseErr);
      return res.status(500).json({ success: false, message: 'Server error.' });
    }
  });
});

// =========================
// START SERVER
// =========================
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
