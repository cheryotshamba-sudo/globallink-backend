const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;

// Store payment status (replace with a database in production)
const payments = {};

// Initiate STK Push
app.post("/pay", async (req, res) => {
  try {
    let { phone, amount } = req.body;

    if (!phone || !amount) {
      return res.status(400).json({
        success: false,
        message: "Phone and amount are required."
      });
    }

    // Convert phone to 2547XXXXXXXX format
    phone = phone.replace(/\s+/g, "");
    if (phone.startsWith("07")) {
      phone = "254" + phone.substring(1);
    }

    const reference = "CHAT" + Date.now();

    const response = await axios.post(
      "https://autopay.co.ke/api/stk-push",
      {
        phone,
        amount,
        accountReference: reference,
        description: "Chat and Earn Activation",
        callbackUrl: process.env.CALLBACK_URL
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.AUTOPAY_SECRET_KEY}`,
          "Content-Type": "application/json",
          Accept: "application/json"
        }
      }
    );

    if (response.data.success) {
      payments[response.data.checkoutRequestId] = {
        phone,
        amount,
        reference,
        status: "pending"
      };
    }

    res.json(response.data);

  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.response?.data?.message ||
        error.message
    });
  }
});

// Webhook Callback
app.post("/autopay/callback", (req, res) => {

  console.log("AUTOPAY CALLBACK:", req.body);

  const data = req.body;

  const payment = Object.values(payments).find(
    p => p.reference === data.reference
  );

  if (payment && data.status === "SUCCESS") {
    payment.status = "completed";
  }

  res.sendStatus(200);
});

// Check Payment Status
app.post("/check-status", async (req, res) => {

  try {

    const { checkoutRequestId } = req.body;

    const response = await axios.post(
      "https://autopay.co.ke/api/check-status",
      {
        checkoutRequestId
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.AUTOPAY_SECRET_KEY}`,
          "Content-Type": "application/json",
          Accept: "application/json"
        }
      }
    );

    res.json(response.data);

  } catch (error) {

    res.status(500).json({
      success: false,
      message:
        error.response?.data?.message ||
        error.message
    });

  }

});

// Health Check
app.get("/", (req, res) => {
  res.send("Chat and Earn AUTOPAY Backend Running");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
