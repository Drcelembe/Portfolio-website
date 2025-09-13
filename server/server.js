const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const filePath = path.join(__dirname, '../data/contacts.json');
  const newEntry = { name, email, message, date: new Date().toISOString() };
  
  let data = [];
  if (fs.existsSync(filePath)) {
    data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

  res.status(200).json({ message: 'Message received.' });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
