const express = require('express');
const axios = require('axios');
const router = express.Router();

router.post('/', async (req, res) => {
  const { authCode } = req.body;
  try {
    const response = await axios.post(
      'https://api.minepi.com/v2/me',
      { authCode },
      {
        headers: {
          Authorization: `Key ${process.env.PI_API_KEY}`,
        },
      }
    );
    res.json({ success: true, user: response.data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
