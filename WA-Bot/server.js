
require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const MessagingResponse = require("twilio").twiml.MessagingResponse;

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.post("/webhook", (req, res) => {

    const incomingMsg = req.body.Body.toLowerCase();

    const twiml = new MessagingResponse();

    if (incomingMsg === "hi") {
        twiml.message("Hello 👋 Welcome to our WhatsApp bot!");
    } else {
        twiml.message("Send 'hi' to start.");
    }

    res.writeHead(200, { "Content-Type": "text/xml" });
    res.end(twiml.toString());
});

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});