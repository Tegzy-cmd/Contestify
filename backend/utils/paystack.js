const axios = require('axios');

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const baseURL = 'https://api.paystack.co';

const paystack = axios.create({
  baseURL,
  headers: {
    Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
    'Content-Type': 'application/json'
  }
});

module.exports = paystack;
