# Fleet AI Chatbot Guide 🤖

## Overview

The Fleet AI Chatbot is an intelligent assistant that analyzes your real-time OBD-II fleet telematics data and provides insights through natural language conversations. It integrates with leading AI providers (Claude, GPT-4, or Gemini) to answer questions about your fleet's performance, health, and operational metrics.

## Features ✨

### 1. **Real-Time Fleet Analysis**
- Analyzes live OBD-II data from your entire fleet
- Provides insights on fuel efficiency, costs, vehicle health, and alerts
- Contextualizes responses based on the current page (Dashboard, Vehicles, or Alerts)

### 2. **Multi-Provider Support**
- **Claude (Anthropic)**: Advanced reasoning with Claude 3.5 Sonnet
- **GPT-4 (OpenAI)**: Powered by OpenAI's GPT-4 Turbo
- **Gemini (Google)**: Google's Gemini 1.5 Pro model

### 3. **Conversation Management**
- Create multiple chat sessions
- Switch between conversations
- Persistent history (saved in localStorage)
- Delete old conversations

### 4. **Smart Context Building**
The chatbot automatically includes:
- Fleet overview metrics (total vehicles, health index, fuel costs)
- Individual vehicle details (up to 20 vehicles with full telemetry)
- Active alerts and DTCs
- Current page context for targeted responses

## Setup Instructions 🛠️

### Step 1: Get an API Key

Choose one of the following AI providers:

#### Option A: Claude (Anthropic) - Recommended
1. Visit [console.anthropic.com](https://console.anthropic.com)
2. Sign up or log in
3. Navigate to **API Keys**
4. Create a new API key
5. Copy the key (starts with `sk-ant-...`)

**Pricing**: Claude offers $5 free credits for new users
- Claude 3.5 Sonnet: ~$3 per million input tokens, ~$15 per million output tokens

#### Option B: OpenAI (GPT-4)
1. Visit [platform.openai.com](https://platform.openai.com)
2. Sign up or log in
3. Go to **API Keys** section
4. Create a new secret key
5. Copy the key (starts with `sk-...`)

**Pricing**: New users get $5 free credits
- GPT-4 Turbo: ~$10 per million input tokens, ~$30 per million output tokens

#### Option C: Google (Gemini)
1. Visit [ai.google.dev](https://ai.google.dev)
2. Get started with Gemini API
3. Create an API key
4. Copy the key

**Pricing**: Gemini has generous free tier
- Gemini 1.5 Pro: Free for up to 1500 requests/day

### Step 2: Configure the Chatbot

1. **Start your development server**:
   ```bash
   npm run dev
   ```

2. **Open the application** in your browser (usually `http://localhost:5173`)

3. **Navigate to Telematics** section (Dashboard, Vehicles, or Alerts page)

4. **Click the chatbot button** (purple circle with message icon) in the bottom-right corner

5. **Open Settings**:
   - Click the gear icon in the chatbot header
   - Select your AI provider
   - Paste your API key
   - Click "Save Settings"

Your API key is stored securely in your browser's localStorage and never sent to any server except the chosen AI provider.

## How to Use 💬

### Starting a Conversation

1. **Open the chatbot** by clicking the floating button
2. Type your question in the input field
3. Press Enter or click the Send button

### Example Questions

**Fleet Overview:**
- "What's the overall health of my fleet?"
- "Which vehicles need immediate attention?"
- "Show me the total daily fuel cost"
- "What's my fleet's average fuel efficiency?"

**Vehicle-Specific:**
- "Which vehicle has the lowest health score?"
- "Show me all vehicles with active faults"
- "Which trucks are currently idle?"
- "Compare fuel efficiency between VAN-001 and TRK-142"

**Cost Analysis:**
- "What's my most expensive vehicle to operate?"
- "Calculate total weekly fuel cost"
- "Which vehicles exceed target cost per km?"

**Maintenance & Alerts:**
- "List all vehicles with critical alerts"
- "Which vehicles are due for maintenance?"
- "Show me vehicles with low battery warnings"
- "What DTCs are active in my fleet?"

**Performance Optimization:**
- "Which vehicles have excessive idle time?"
- "Identify vehicles with poor fuel efficiency"
- "Show me vehicles with high engine load"

### Managing Conversations

**Create New Chat:**
- Click the "+ New Chat" button
- Previous conversations are saved

**Switch Conversations:**
- Click on any conversation tab to switch
- All messages are preserved

**Delete Conversations:**
- Click the trash icon next to a conversation
- This action cannot be undone

## Data Provided to AI 📊

The chatbot automatically includes the following context with each query:

### Fleet-Level Metrics:
- Total vehicles, active/idle breakdown
- Fleet health index (0-100)
- Average fuel efficiency (km/L)
- Fuel cost per kilometer
- Daily fuel costs
- Active faults count
- Maintenance due/overdue
- Idle fuel loss percentage

### Vehicle-Level Details (up to 20 vehicles):
- Vehicle ID, VIN, type, fuel type, status
- Health score
- Fuel consumption (daily, moving, idle)
- Cost metrics (per km, daily)
- Engine parameters (RPM, load, torque)
- Vitals (battery voltage, coolant temp, oil pressure)
- Speed, odometer reading
- Active DTCs and alerts

### Current Context:
- Which page you're viewing (Dashboard, Vehicles, Alerts)
- Timestamp of the query

## Cost Estimation 💰

Each query sends approximately:
- **Input tokens**: 2,000-4,000 (depending on fleet size)
- **Output tokens**: 500-1,000 (depending on response length)

**Estimated costs per 100 queries:**
- Claude: ~$0.50 - $1.00
- GPT-4: ~$1.00 - $2.00
- Gemini: Free (within daily limits)

## Privacy & Security 🔒

- **API keys** are stored only in your browser's localStorage
- **Fleet data** is sent to the AI provider only when you ask a question
- **No data** is stored on external servers (except temporary processing by AI provider)
- **Conversations** are saved locally in your browser
- Clear your browser data to remove all stored conversations and API keys

## Troubleshooting 🔧

### "Please configure your API key in settings"
- Click the settings icon
- Verify your API key is entered correctly
- Make sure you selected the right provider
- Click "Save Settings"

### "API request failed" or "Error" messages
- **Invalid API key**: Check your API key is correct
- **Rate limits**: You may have exceeded the provider's rate limits
- **Network issues**: Check your internet connection
- **Quota exceeded**: Add billing information to your AI provider account

### Chatbot not responding
- Check browser console for errors (F12)
- Verify API key is still valid
- Try refreshing the page
- Try creating a new conversation

### Slow responses
- AI providers sometimes have high latency
- Larger fleet data = more tokens = slower processing
- Claude and GPT-4 typically respond in 2-10 seconds

## Best Practices 📝

1. **Be specific**: Instead of "tell me about my fleet", ask "which vehicles have health scores below 70?"

2. **Use vehicle IDs**: Reference specific vehicles when possible (e.g., "What's wrong with VAN-001?")

3. **Ask one thing at a time**: Multiple questions in one message may get partial answers

4. **Check context**: The AI only sees data from the current session - it doesn't remember previous visits

5. **Verify critical decisions**: While the AI is accurate, always verify important operational decisions with the raw data

## Technical Architecture 🏗️

```
User Query
    ↓
ChatBot Component
    ↓
Prepare Fleet Context (from dummyData.js)
    ↓
Send to AI Provider API
    ↓
AI Analysis & Response
    ↓
Display to User
```

### Key Components:

**ChatBot.jsx**: Main component
- Message handling
- Conversation management
- API integration
- UI rendering

**Data Flow**:
- Fleet metrics → `generateFleetMetrics()`
- Vehicle data → `generateVehicleData()`
- Context preparation → `prepareFleetContext()`

## Future Enhancements 🚀

Potential improvements:
- [ ] Export conversation to PDF
- [ ] Voice input/output
- [ ] Scheduled reports via chatbot
- [ ] Chart generation from queries
- [ ] Integration with fleet management actions
- [ ] Multi-language support
- [ ] Custom system prompts
- [ ] Usage analytics dashboard

## Support 💡

For issues or questions:
1. Check this guide first
2. Verify your API key and provider settings
3. Check browser console for errors
4. Review the AI provider's documentation

## License

This chatbot implementation is part of the Fleet Management Dashboard project.

---

**Made with ❤️ for fleet managers who want AI-powered insights**

