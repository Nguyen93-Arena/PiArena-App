require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

const paymentRoutes = require('./routes/payments');

app.use(cors());
app.use(express.json());

app.use('/api/payment', paymentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
});
