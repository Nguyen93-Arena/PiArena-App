const express = require('express');
const router = express.Router();
const axios = require('axios');
const { validatePayment } = require('../utils/pi-auth');

const PI_API_URL = 'https://api.minepi.com';

router.post('/approve', async (req, res) => {
  const { paymentId } = req.body;

  try {
    await validatePayment(paymentId);
    const response = await axios.post(`${PI_API_URL}/v2/payments/${paymentId}/approve`, {}, {
      headers: {
        Authorization: `Key ${process.env.PI_API_KEY}`
      }
    });
    res.json({ success: true, data: response.data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/complete', async (req, res) => {
  const { paymentId, txid } = req.body;

  try {
    const response = await axios.post(`${PI_API_URL}/v2/payments/${paymentId}/complete`, { txid }, {
      headers: {
        Authorization: `Key ${process.env.PI_API_KEY}`
      }
    });
    res.json({ success: true, data: response.data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
