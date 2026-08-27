const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const router = express.Router();

const genAI = new GoogleGenerativeAI(
    process.env.GenAI_Gemini_API_Key_1
);

router.post("/", async (req, res) => {

    console.log("Message Received:", req.body);

    try {

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash"
        });

        const result = await model.generateContent(`
        You are SmartLearn AI.

        Answer in clean markdown format.

        Rules:
        - Use headings when useful.
        - Use bullet points for lists.
        - Use code blocks for code.
        - Keep answers concise unless user asks for detail.
        - Avoid huge walls of text.

        Question:
        ${req.body.message}
        `);

        const reply = result.response.text();

        res.json({
            reply
        });

    } catch (err) {

        console.log("FULL ERROR:");
        console.log(err);

        res.status(500).json({
            error: "Failed"
        });

    }

});

module.exports = router;