const express = require('express');
const Razorpay = require('razorpay');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET
});

app.post('/api/create-order', async (req, res) => {
    const options = {
        amount: 23900,
        currency: "INR",
        receipt: "learn2hack_order"
    };
    try {
        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/payment-success', async (req, res) => {
    const { name, email } = req.body;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS
        }
    });

    const mailOptions = {
        from: `"learn2hack" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: 'Your Course Access Link',
        text: `Hi ${name},

Thank you for purchasing. Here is your course link:

https://drive.google.com/your-course-link`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.json({ message: 'Email sent' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to send email' });
    }
});

app.listen(3000, () => console.log("Server running on port 3000"));
