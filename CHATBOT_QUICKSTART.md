# Fleet AI Chatbot - Quick Start Guide ⚡

Get your AI fleet assistant up and running in 5 minutes!

## Step 1: Choose Your AI Provider

Pick one based on your preference:

| Provider | Model | Free Credits | Best For |
|----------|-------|--------------|----------|
| **Claude** (Recommended) | Sonnet 3.5 | $5 | Advanced reasoning, fleet analysis |
| **GPT-4** | Turbo | $5 | General purpose, reliable |
| **Gemini** | 1.5 Pro | Free tier (1500/day) | Budget-conscious users |

## Step 2: Get Your API Key

### For Claude (Recommended):
1. Go to https://console.anthropic.com
2. Sign up (email + verify)
3. Click **"API Keys"** in the left menu
4. Click **"Create Key"**
5. Copy the key (starts with `sk-ant-...`)

### For GPT-4:
1. Go to https://platform.openai.com
2. Sign up (email + verify)
3. Go to **API Keys** section
4. Click **"Create new secret key"**
5. Copy the key (starts with `sk-...`)

### For Gemini:
1. Go to https://ai.google.dev
2. Sign in with Google
3. Click **"Get API Key"**
4. Copy the key

## Step 3: Configure the Chatbot

1. **Start the app**:
   ```bash
   npm run dev
   ```

2. **Open in browser**: http://localhost:5173

3. **Go to Telematics** section (Dashboard, Vehicles, or Alerts page)

4. **Click the purple chat button** in the bottom-right corner

5. **Click the gear icon** (⚙️) in the chatbot header

6. **Select your AI provider** from the dropdown

7. **Paste your API key**

8. **Click "Save Settings"**

## Step 4: Start Chatting!

Try these example questions:

**Quick Health Check:**
```
Which vehicles need immediate attention?
```

**Cost Analysis:**
```
What's my total daily fuel cost?
```

**Vehicle Comparison:**
```
Compare the fuel efficiency of all my vehicles
```

**Maintenance Planning:**
```
Show me vehicles with active faults
```

**Performance Insights:**
```
Which vehicle has the best fuel efficiency?
```

## Pro Tips 💡

1. **Be Specific**: Include vehicle IDs when asking about specific vehicles
   - ✅ "What's wrong with VAN-001?"
   - ❌ "What's wrong with the van?"

2. **One Question at a Time**: Better responses when focused
   - ✅ "Which vehicles have low battery?"
   - ❌ "Tell me about battery, fuel, and maintenance"

3. **Use the Context**: The AI knows what page you're on
   - On Dashboard: Ask about overall fleet metrics
   - On Vehicles: Ask about specific vehicle details

4. **Save Conversations**: Click "+ New Chat" to start fresh topics

## Troubleshooting 🔧

**"Please configure your API key"**
- Make sure you clicked "Save Settings" after pasting the key

**"API request failed"**
- Double-check your API key is correct
- Verify you have credits remaining in your AI account
- Check your internet connection

**Slow responses?**
- Normal! AI typically takes 3-10 seconds
- Larger fleets = more data = slightly slower

**No response?**
- Check browser console (F12) for errors
- Try refreshing the page
- Try a different AI provider

## Cost Estimates 💰

Approximate cost per 100 queries:

- **Claude**: $0.50 - $1.00
- **GPT-4**: $1.00 - $2.00  
- **Gemini**: FREE (within limits)

Your $5 free credits = 500-1000 queries! 🎉

## Privacy & Security 🔒

- API keys stored only in your browser
- Fleet data sent to AI only when you ask a question
- Conversations saved locally in browser
- No external servers involved (except AI provider)

## Next Steps

Want to learn more? Check out:
- **[Complete Chatbot Guide](CHATBOT_GUIDE.md)** - Full documentation
- **[Main README](README.md)** - Full app features

## Support

Having issues? 
1. Read the **[Complete Guide](CHATBOT_GUIDE.md)**
2. Check browser console (F12) for errors
3. Verify your API key is valid
4. Try creating a new conversation

---

**Ready to chat with your fleet? Start asking questions! 🚀**

