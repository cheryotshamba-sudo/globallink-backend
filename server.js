const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

const OPTIMAPAY_URL = "https://optimapaybridge.co.ke/api/v2/stkpush.php";

app.post("/stkpush", async (req, res) => {

    try {

        const { phone } = req.body;

        if (!phone) {
            return res.status(400).json({
                success: false,
                message: "Phone number is required"
            });
        }

        const data = {
            payment_account_id: process.env.PAYMENT_ACCOUNT_ID,
            phone: phone,
            amount: 100,
            reference: "GLOBALINK_" + Date.now(),
            description: "GlobalLink Kenya Account Activation Fee"
        };

        const response = await axios.post(
            OPTIMAPAY_URL,
            data,
            {
                headers: {
                    "X-API-Key": process.env.OPTIMAPAY_KEY,
                    "X-API-Secret": process.env.OPTIMAPAY_SECRET,
                    "Content-Type": "application/json"
                }
            }
        );

        res.json(response.data);

    } catch (error) {

        console.log(
            error.response?.data || error.message
        );

        res.status(500).json({
            success: false,
            message: "Unable to send STK Push"
        });
    }

});


app.get("/", (req, res) => {
    res.send("GlobalLink Kenya Backend Running");
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
