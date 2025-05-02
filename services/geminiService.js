const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

// Get API key from environment variable
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
console.log("Gemini API Key available:", !!GEMINI_API_KEY);

// Function to send a prompt to Gemini API
async function sendToGemini(prompt) {
  try {
    // Check if API key is available
    if (!GEMINI_API_KEY) {
      console.warn('GEMINI_API_KEY is not set in environment variables');
      return {
        candidates: [{
          content: {
            parts: [{
              text: "AI insights are not available at the moment. Please check your configuration."
            }]
          }
        }]
      };
    }

    // Use native fetch API instead of axios
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error communicating with Gemini API:', error.message);
    // Return a fallback response instead of throwing
    return {
      candidates: [{
        content: {
          parts: [{
            text: "Unable to generate insights at this time. Please try again later."
          }]
        }
      }]
    };
  }
}

module.exports = { sendToGemini };