const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

const OPTIMAPAY_URL =
"https://optimapaybridge.co.ke/api/v2/topup.php";


// STK PUSH

app.post("/stkpush", async (req, res) => {

    console.log("STK request received:", req.body);


    try {

        let phone = req.body.phone;


        if(!phone){

            return res.json({

                success:false,

                message:"Phone number required"

            });

        }


        // Convert phone format

        phone = phone.toString().replace(/\s/g,"");


        if(phone.startsWith("0")){

            phone = "254" + phone.substring(1);

        }



        const data = {

            phone: phone,

            amount: 100,

            user_callback_url:
            "https://globallink-backend.onrender.com/callback"

        };


        console.log("Sending to OptimaPay:", data);



        const response = await axios.post(

            OPTIMAPAY_URL,

            data,

            {

                headers:{

                    "X-API-KEY": process.env.OPTIMA_API_KEY,

                    "X-API-SECRET": process.env.OPTIMA_API_SECRET,

                    "Content-Type":"application/json"

                }

            }

        );



        console.log("OptimaPay Response:", response.data);



        res.json(response.data);



    } catch(error){


        console.log(
            "OptimaPay Error:",
            error.response?.data || error.message
        );


        res.status(500).json({

            success:false,

            message:"Failed to send STK Push"

        });


    }

});




// CALLBACK

app.post("/callback",(req,res)=>{


    console.log("===== CALLBACK =====");

    console.log(req.body);


    res.json({

        success:true

    });


});




// TEST

app.get("/",(req,res)=>{

    res.send("GlobalLink Kenya Backend Running");

});



app.listen(PORT,()=>{

    console.log(`Server running on port ${PORT}`);

});
