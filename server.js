import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const GEMINI_API_KEY = process.env.GOOGLE_API_KEY;

// Initialize Gemini with the correct model name from the documentation
const ai = new GoogleGenAI({apiKey: GEMINI_API_KEY});
// const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Get meal suggestions endpoint
app.post('/api/get-suggestions', async (req, res) => {
  try {
    const { ingredients } = req.body;

    if (!ingredients || ingredients.length === 0) {
      return res.status(400).json({ error: 'Ingredients are required' });
    }

    const prompt = `I have these ingredients available: ${ingredients.join(', ')}.

Please suggest 3 different meals I can make with these ingredients. For each meal:
1. Give it a name
2. List the main ingredients needed (from my list and make sure you use the metric system for measurements)
3. Mention any common ingredients that might be needed (like oil, water, etc.)
4. Provide a brief description
5. Estimate prep and cook time
6. Indicate serving size

Format your response as JSON with this structure:
{
  "meals": [
    {
      "name": "Meal Name",
      "description": "Brief description",
      "ingredients_used": ["ingredient1", "ingredient2"],
      "additional_needed": ["oil", "water"],
      "prep_time": "15 mins",
      "cook_time": "30 mins",
      "servings": "4"
    }
  ]
}

Only return the JSON, no other text.`;

    const result = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    });
    
    const text = result.text;
    
    const cleanedResponse = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleanedResponse);

    res.json(parsed);
  } catch (error) {
    console.error('Error getting suggestions:', error);
    res.status(500).json({ error: 'Failed to get meal suggestions', details: error.message });
  }
});

// Get detailed recipe endpoint
app.post('/api/get-recipe', async (req, res) => {
  try {
    const { mealName, ingredients, conversationHistory } = req.body;

    if (!mealName || !ingredients) {
      return res.status(400).json({ error: 'Meal name and ingredients are required' });
    }

    const prompt = `I want to make ${mealName}. My available ingredients are: ${ingredients.join(', ')}.

Please provide:
1. Complete ingredient list with quantities (use metric system of measurement where appropriate)
2. Step-by-step cooking instructions
3. If I'm missing any ingredients, suggest alternatives I might have

Be conversational and helpful.`;

    // Start a chat with history if available
    let result;
    if (conversationHistory && conversationHistory.length > 0) {
      const history = conversationHistory.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      }));
      
      const chat = ai.chats.create({
        model: "gemini-2.5-flash",
        history: history,
        });
    //   const chat = model.startChat({ history });
    //   result = await chat.sendMessage(prompt);
      const result = await chat.sendMessage(prompt);

    } else {
      result = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        });
    }

    const responseText = result.text;

    // Build updated conversation history
    const updatedHistory = conversationHistory && conversationHistory.length > 0
      ? [...conversationHistory, 
         { role: 'user', content: prompt },
         { role: 'assistant', content: responseText }]
      : [{ role: 'user', content: prompt },
         { role: 'assistant', content: responseText }];

    res.json({
      recipe: responseText,
      conversationHistory: updatedHistory
    });
  } catch (error) {
    console.error('Error getting recipe:', error);
    res.status(500).json({ error: 'Failed to get recipe', details: error.message });
  }
});

// Ask follow-up question endpoint
app.post('/api/ask-followup', async (req, res) => {
  try {
    const { question, conversationHistory } = req.body;

    if (!question || !conversationHistory) {
      return res.status(400).json({ error: 'Question and conversation history are required' });
    }

    // Convert conversation history to Gemini format
    const history = conversationHistory.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

      const chat = ai.chats.create({
        model: "gemini-2.5-flash",
        history: history,
        });
    //   const chat = model.startChat({ history });
    //   result = await chat.sendMessage(prompt);
    //   const result = await chat.sendMessage(prompt);

    // const chat = model.startChat({ history });
    const result = await chat.sendMessage(question);
    const responseText = result.text;

    const updatedHistory = [
      ...conversationHistory,
      { role: 'user', content: question },
      { role: 'assistant', content: responseText }
    ];

    res.json({
      response: responseText,
      conversationHistory: updatedHistory
    });
  } catch (error) {
    console.error('Error asking follow-up:', error);
    res.status(500).json({ error: 'Failed to process follow-up question', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});