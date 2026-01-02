# 🍳 Make a Meal - Backend API

**AI-powered recipe generation API using Google Gemini**

This is the backend service for Make a Meal, providing AI-powered meal suggestions and recipe generation based on user-provided ingredients. Built with Express.js and Google's Gemini AI.

🔗 **Frontend Repository**: [https://github.com/Kupiwa/meal-ideas-frontend](https://github.com/Kupiwa/meal-ideas-frontend)

🔗 **Live Demo**: [https://meal-ideas-frontend.vercel.app](https://meal-ideas-frontend.vercel.app)

## 🛠️ Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Google Gemini API** - AI language model (gemini-1.5-flash)
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

## ✨ Features

- 🤖 **AI Meal Suggestions**: Generate 3 meal ideas from ingredient lists
- 📝 **Detailed Recipes**: Get step-by-step cooking instructions
- 💬 **Contextual Conversations**: Maintain chat history for follow-up questions
- 🔒 **Secure API**: Environment-based configuration
- 🌐 **CORS Enabled**: Ready for cross-origin requests
- ⚡ **Fast Responses**: Optimized with Gemini 1.5 Flash model

## 📋 Prerequisites

- **Node.js** (v16 or higher)
- **npm** (v8 or higher)
- **Google Gemini API Key** ([Get it here](https://makersuite.google.com/app/apikey))

## 🔧 Installation

### 1. Clone the repository

```bash
git clone https://github.com/Kupiwa/meal-ideas.git
cd meal-ideas
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory:

```env
GOOGLE_API_KEY=your_gemini_api_key_here
PORT=5000
```

**Get your Google Gemini API key:**
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy and paste into your `.env` file

## 🎮 Running the Application

### Development Mode (with auto-reload)

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

The server will start on `http://localhost:5000`

## 📁 Project Structure

```
meal-ideas/
├── server.js          # Main Express server and API endpoints
├── package.json       # Dependencies and scripts
├── .env              # Environment variables (not in git)
├── .gitignore        # Git ignore rules
└── README.md         # Documentation
```

## 🔌 API Endpoints

### Health Check

```http
GET /api/health
```

**Response:**
```json
{
  "status": "ok",
  "message": "Server is running"
}
```

---

### Get Meal Suggestions

```http
POST /api/get-suggestions
```

**Request Body:**
```json
{
  "ingredients": ["chicken", "tomatoes", "onions", "garlic"]
}
```

**Response:**
```json
{
  "meals": [
    {
      "name": "Chicken Tomato Stir-Fry",
      "description": "A quick and flavorful stir-fry...",
      "ingredients_used": ["chicken", "tomatoes", "onions", "garlic"],
      "additional_needed": ["oil", "soy sauce", "salt"],
      "prep_time": "10 mins",
      "cook_time": "15 mins",
      "servings": "4"
    }
    // ... 2 more meals
  ]
}
```

---

### Get Detailed Recipe

```http
POST /api/get-recipe
```

**Request Body:**
```json
{
  "mealName": "Chicken Tomato Stir-Fry",
  "ingredients": ["chicken", "tomatoes", "onions", "garlic"],
  "conversationHistory": []
}
```

**Response:**
```json
{
  "recipe": "## Ingredients\n\n- 500g chicken breast...",
  "conversationHistory": [
    {
      "role": "user",
      "content": "I want to make Chicken Tomato Stir-Fry..."
    },
    {
      "role": "assistant",
      "content": "## Ingredients\n\n- 500g chicken breast..."
    }
  ]
}
```

---

### Ask Follow-up Question

```http
POST /api/ask-followup
```

**Request Body:**
```json
{
  "question": "Can you suggest substitutes for chicken?",
  "conversationHistory": [
    // Previous conversation messages
  ]
}
```

**Response:**
```json
{
  "response": "Great question! Here are some substitutes...",
  "conversationHistory": [
    // Updated conversation history
  ]
}
```

## 🔑 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GOOGLE_API_KEY` | Google Gemini API key | Yes |
| `PORT` | Server port (default: 5000) | No |

## 🤖 AI Model Configuration

The API uses **Google Gemini 2.5 Flash** (`gemini-2.5-flash`):
- Fast response times
- Cost-effective for high-volume requests
- Good quality for recipe generation
- Context window: 1M tokens

## 🚀 Deployment (Render)

This project is deployed on Render. To deploy your own:

### Automatic Deployment (Recommended)

1. Fork this repository
2. Go to [Render](https://render.com)
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Configure:
   - **Name**: meal-ideas (or your choice)
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. Add environment variable:
   - Key: `GOOGLE_API_KEY`
   - Value: Your Gemini API key
7. Click "Create Web Service"

### Manual Deployment

```bash
# Install Render CLI (optional)
npm i -g render

# Deploy
render deploy
```

### Important Render Settings

- **Region**: Choose closest to your users
- **Instance Type**: Free tier works fine for testing
- **Auto-Deploy**: Enable for automatic deployments on push
- **Health Check Path**: `/api/health`

## 🔒 Security Considerations

- API key stored in environment variables (never committed to git)
- CORS enabled for specified origins
- Input validation on all endpoints
- Rate limiting recommended for production (not implemented yet)

## 📊 Error Handling

All endpoints return appropriate HTTP status codes:

- `200` - Success
- `400` - Bad Request (missing/invalid parameters)
- `500` - Internal Server Error (AI API failures, etc.)

Error Response Format:
```json
{
  "error": "Error message description",
  "details": "Additional error details"
}
```
## 🗺️ Roadmap

- [ ] Add request rate limiting
- [ ] Implement logging with Winston
- [ ] Add request validation middleware
- [ ] Create automated tests
- [ ] Add API documentation with Swagger
- [ ] Implement caching for repeated requests
- [ ] Add user authentication
- [ ] Database integration for saved recipes

## 🔗 Related Links

- **Frontend Repository**: [meal-ideas-frontend](https://github.com/Kupiwa/meal-ideas-frontend)
- **Live Demo**: [meal-ideas-frontend.vercel.app](https://meal-ideas-frontend.vercel.app)
- **Google Gemini API**: [ai.google.dev](https://ai.google.dev/)

## 👏 Acknowledgments

- [Google Gemini](https://ai.google.dev/) for powerful AI capabilities
- [Express.js](https://expressjs.com/) for the web framework
- [Render](https://render.com/) for hosting

---

**Made with ❤️ by [Kupiwa](https://github.com/Kupiwa)**

If you found this project helpful, please consider giving it a ⭐!# meal-ideas
