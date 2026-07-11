const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const OPTIMAPAY_URL = "https://optimapaybridge.co.ke/api/v2/topup.php";


app.post("/stkpush", async (req, res) => {

    console.log("STK request received:", req.body);

    try { 

        const { phone } = req.body;

        if (!phone) {
            return res.status(400).json({
                success: false,
                message: "Phone number is required"
            });
        }

        const data = {
    phone: phone,
    amount: 100,
    user_callback_url: "https://globallink-backend.onrender.com/callback"
};
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

        console.log("OptimaPay Error:", error.response?.data || error.message);

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
