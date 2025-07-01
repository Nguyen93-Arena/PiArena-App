const axios = require('axios');

const validatePayment = async (paymentId) => {
  try {
    const response = await axios.get(`https://api.minepi.com/v2/payments/${paymentId}`, {
      headers: {
        Authorization: `Key ${process.env.PI_API_KEY}`
      }
    });

    const payment = response.data;

    if (!payment || payment.status !== 'pending') {
      throw new Error('❌ Payment is not pending or already processed.');
    }

    return payment;
  } catch (error) {
    throw new Error(`❌ Failed to validate payment: ${error.message}`);
  }
};

module.exports = { validatePayment };
