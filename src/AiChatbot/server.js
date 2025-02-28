require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { OpenAI } = require("openai");

const app = express();
const openai = new OpenAI({ apiKey: "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" }); // Use environment variable for API key

app.use(cors()); // Allow all domains by default
app.use(bodyParser.json()); // Parse incoming JSON requests

const ALLOWED_TOPICS = [
    "bay of bengal", "sundarbans", "mangroves", "ocean", "marine",
    "fish", "coral", "pollution", "sea", "whale", "shark", "underwater",
    "ecosystem", "species", "conservation"
];

function isValidQuestion(userInput) {
    return ALLOWED_TOPICS.some(topic => userInput.toLowerCase().includes(topic));
}

async function chatWithRay(prompt) {
    if (!isValidQuestion(prompt)) {
        return "I can only discuss marine-related topics. Ask me something about the ocean!";
    }

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini", // Use a valid model (e.g., GPT-4)
            messages: [
                { role: "system", content: "You are Mr. Ray, a marine expert and guide for ocean conservation." },
                { role: "user", content: prompt }
            ]
        });

        return response.choices[0].message.content.trim();
    } catch (error) {
        console.error("OpenAI API Error:", error);
        return "Sorry, I couldn't process your request at the moment.";
    }
}

app.post("/chat", async (req, res) => {
    const userInput = req.body.message || "";
    const responseText = await chatWithRay(userInput);
    res.json({ response: responseText });
});

const PORT = process.env.PORT || 1000; // Ensure the port matches your frontend settings (default: 5000)
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
