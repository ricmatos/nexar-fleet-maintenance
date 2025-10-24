import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Trash2, Plus, Bot, User, Sparkles } from 'lucide-react';

const ChatBot = ({ fleetData, vehicleData, currentPage, onOpenChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Notify parent when chatbot opens/closes
  useEffect(() => {
    if (onOpenChange) {
      onOpenChange(isOpen);
    }
  }, [isOpen, onOpenChange]);

  // Load conversations from localStorage
  useEffect(() => {
    const savedConversations = localStorage.getItem('fleet_chatbot_conversations');
    
    if (savedConversations) {
      const parsed = JSON.parse(savedConversations);
      setConversations(parsed);
      if (parsed.length > 0) {
        setActiveConversationId(parsed[0].id);
        setMessages(parsed[0].messages);
      }
    }
  }, []);

  // Save conversations to localStorage whenever they change
  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem('fleet_chatbot_conversations', JSON.stringify(conversations));
    }
  }, [conversations]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Built-in AI Analysis - No API Key Required!
  const analyzeFleetData = (query) => {
    const lowerQuery = query.toLowerCase();
    
    // Analyze vehicles
    const activeVehicles = vehicleData.filter(v => v.status === 'Active');
    const idleVehicles = vehicleData.filter(v => v.status === 'Idle');
    const criticalAlerts = vehicleData.filter(v => v.alerts.some(a => a.severity === 'Critical'));
    const lowHealthVehicles = vehicleData.filter(v => v.healthIndex < 70).sort((a, b) => a.healthIndex - b.healthIndex);
    const highCostVehicles = vehicleData.sort((a, b) => b.fuelCostPerMile - a.fuelCostPerMile);
    const lowEfficiencyVehicles = vehicleData.filter(v => v.avgFuelEfficiency < 19).sort((a, b) => a.avgFuelEfficiency - b.avgFuelEfficiency);
    const maintenanceDue = vehicleData.filter(v => v.alerts.some(a => a.type.includes('Due') || a.type.includes('Change')));
    
    // Question patterns
    if (lowerQuery.includes('attention') || lowerQuery.includes('immediate') || lowerQuery.includes('urgent') || lowerQuery.includes('critical')) {
      let response = `🚨 **Vehicles Requiring Immediate Attention:**\n\n`;
      
      const urgent = criticalAlerts.length > 0 ? criticalAlerts : lowHealthVehicles.slice(0, 3);
      
      urgent.forEach((v, idx) => {
        response += `${idx + 1}. **${v.id}** (Health: ${v.healthIndex}/100)\n`;
        response += `   - Type: ${v.type} | Status: ${v.status}\n`;
        response += `   - Critical Issues:\n`;
        v.alerts.forEach(a => {
          response += `     • ${a.type} (${a.severity})\n`;
        });
        if (v.healthIndex < 60) {
          response += `   ⚠️ PRIORITY: Very low health score\n`;
        }
        response += `\n`;
      });
      
      if (urgent.length === 0) {
        response = `✅ **Good News!**\n\nNo vehicles require immediate attention. Your fleet is operating within normal parameters.`;
      }
      
      return response;
    }
    
    if (lowerQuery.includes('health') || lowerQuery.includes('summary') || lowerQuery.includes('overview')) {
      let response = `📊 **Fleet Health Summary**\n\n`;
      response += `**Overall Metrics:**\n`;
      response += `• Total Vehicles: ${fleetData.totalVehicles}\n`;
      response += `• Fleet Health Index: ${fleetData.fleetHealthIndex}/100\n`;
      response += `• Active: ${fleetData.vehiclesActive} | Idle: ${fleetData.vehiclesIdle}\n`;
      response += `• Active Faults: ${fleetData.faultsOverTime?.current}\n`;
      response += `• Maintenance Due: ${fleetData.maintenanceDue} (${fleetData.maintenanceOverdue} overdue)\n\n`;
      
      response += `**Health Distribution:**\n`;
      const excellent = vehicleData.filter(v => v.healthIndex >= 80).length;
      const good = vehicleData.filter(v => v.healthIndex >= 70 && v.healthIndex < 80).length;
      const fair = vehicleData.filter(v => v.healthIndex >= 60 && v.healthIndex < 70).length;
      const poor = vehicleData.filter(v => v.healthIndex < 60).length;
      
      response += `• Excellent (80+): ${excellent} vehicles\n`;
      response += `• Good (70-79): ${good} vehicles\n`;
      response += `• Fair (60-69): ${fair} vehicles\n`;
      response += `• Poor (<60): ${poor} vehicles ⚠️\n`;
      
      return response;
    }
    
    if (lowerQuery.includes('cost') && (lowerQuery.includes('most') || lowerQuery.includes('expensive') || lowerQuery.includes('highest'))) {
      let response = `💰 **Highest Operating Cost Vehicles:**\n\n`;
      
      highCostVehicles.slice(0, 5).forEach((v, idx) => {
        response += `${idx + 1}. **${v.id}** - $${v.fuelCostPerMile.toFixed(2)}/mile\n`;
        response += `   - Type: ${v.type} (${v.fuelType})\n`;
        response += `   - Daily Cost: $${v.totalFuelCostDaily.toFixed(2)}\n`;
        response += `   - Efficiency: ${v.avgFuelEfficiency} mpg\n`;
        if (v.healthIndex < 70) {
          response += `   ⚠️ Low health (${v.healthIndex}/100) may be affecting costs\n`;
        }
        response += `\n`;
      });
      
      return response;
    }
    
    if (lowerQuery.includes('fuel') && (lowerQuery.includes('cost') || lowerQuery.includes('daily') || lowerQuery.includes('total'))) {
      let response = `⛽ **Fuel Cost Analysis:**\n\n`;
      response += `**Fleet Totals:**\n`;
      response += `• Daily Fuel Cost: $${fleetData.totalFuelCostDaily.toFixed(2)}\n`;
      response += `• Average Cost/mile: $${fleetData.fuelCostPerMile.toFixed(2)}\n`;
      response += `• Daily Consumption: ${fleetData.totalFuelConsumptionDaily?.toFixed(1)}L\n\n`;
      
      response += `**Cost Breakdown by Type:**\n`;
      const byType = {};
      vehicleData.forEach(v => {
        if (!byType[v.type]) byType[v.type] = { cost: 0, count: 0 };
        byType[v.type].cost += v.totalFuelCostDaily;
        byType[v.type].count += 1;
      });
      
      Object.entries(byType).forEach(([type, data]) => {
        response += `• ${type}: $${data.cost.toFixed(2)}/day (${data.count} vehicles)\n`;
      });
      
      const weeklyEstimate = fleetData.totalFuelCostDaily * 7;
      const monthlyEstimate = fleetData.totalFuelCostDaily * 30;
      response += `\n**Projections:**\n`;
      response += `• Weekly: ~$${weeklyEstimate.toFixed(2)}\n`;
      response += `• Monthly: ~$${monthlyEstimate.toFixed(2)}\n`;
      
      return response;
    }
    
    if (lowerQuery.includes('efficiency') || lowerQuery.includes('efficient')) {
      let response = `📈 **Fuel Efficiency Analysis:**\n\n`;
      response += `**Fleet Average:** ${fleetData.avgFuelEfficiency} mpg\n`;
      response += `**Baseline Target:** ${fleetData.baselineFuelEfficiency} mpg\n\n`;
      
      const efficient = vehicleData.filter(v => v.avgFuelEfficiency >= fleetData.baselineFuelEfficiency);
      const inefficient = vehicleData.filter(v => v.avgFuelEfficiency < fleetData.baselineFuelEfficiency);
      
      response += `**Above Target (${efficient.length} vehicles):**\n`;
      efficient.slice(0, 3).forEach(v => {
        response += `• ${v.id}: ${v.avgFuelEfficiency} mpg ✅\n`;
      });
      
      response += `\n**Below Target (${inefficient.length} vehicles):**\n`;
      inefficient.slice(0, 3).forEach(v => {
        response += `• ${v.id}: ${v.avgFuelEfficiency} mpg ⚠️\n`;
      });
      
      if (lowEfficiencyVehicles.length > 0) {
        response += `\n**Action Needed:**\n`;
        lowEfficiencyVehicles.slice(0, 2).forEach(v => {
          response += `• ${v.id} (${v.avgFuelEfficiency} mpg) - Check for maintenance issues\n`;
        });
      }
      
      return response;
    }
    
    if (lowerQuery.includes('fault') || lowerQuery.includes('alert') || lowerQuery.includes('dtc') || lowerQuery.includes('problem')) {
      let response = `🔧 **Active Faults & Alerts:**\n\n`;
      
      const withAlerts = vehicleData.filter(v => v.alerts.length > 0);
      
      if (withAlerts.length === 0) {
        return `✅ **Excellent!**\n\nNo active faults detected. All vehicles operating normally.`;
      }
      
      response += `**${withAlerts.length} vehicles with active alerts:**\n\n`;
      
      withAlerts.forEach(v => {
        response += `**${v.id}** (${v.type}):\n`;
        v.alerts.forEach(a => {
          const icon = a.severity === 'Critical' ? '🔴' : a.severity === 'High' ? '🟠' : a.severity === 'Medium' ? '🟡' : '⚪';
          response += `  ${icon} ${a.type} (${a.severity})\n`;
        });
        response += `\n`;
      });
      
      return response;
    }
    
    if (lowerQuery.includes('idle') || lowerQuery.includes('idling')) {
      let response = `⏸️ **Idle Time Analysis:**\n\n`;
      response += `**Current Status:**\n`;
      response += `• Idle Vehicles: ${idleVehicles.length}\n`;
      response += `• Active Vehicles: ${activeVehicles.length}\n`;
      response += `• Idle Percentage: ${fleetData.idlePercentage?.toFixed(1)}%\n\n`;
      
      const excessiveIdle = vehicleData.filter(v => {
        const idlePercent = v.fuelConsumptionDaily > 0 ? (v.fuelIdle / v.fuelConsumptionDaily) * 100 : 0;
        return idlePercent > 25;
      });
      
      if (excessiveIdle.length > 0) {
        response += `**⚠️ Excessive Idle Fuel Waste:**\n`;
        excessiveIdle.forEach(v => {
          const idlePercent = (v.fuelIdle / v.fuelConsumptionDaily) * 100;
          response += `• ${v.id}: ${idlePercent.toFixed(1)}% idle fuel (${v.fuelIdle.toFixed(1)}L/day)\n`;
        });
        response += `\n💡 Recommendation: Target <20% idle fuel for optimal efficiency\n`;
      } else {
        response += `✅ Idle fuel consumption is within acceptable range (<25%)\n`;
      }
      
      return response;
    }
    
    if (lowerQuery.includes('maintenance') || lowerQuery.includes('service') || lowerQuery.includes('due')) {
      let response = `🔧 **Maintenance Status:**\n\n`;
      response += `**Overview:**\n`;
      response += `• Vehicles Due: ${fleetData.maintenanceDue}\n`;
      response += `• Overdue: ${fleetData.maintenanceOverdue} ⚠️\n\n`;
      
      if (maintenanceDue.length > 0) {
        response += `**Vehicles Requiring Service:**\n\n`;
        maintenanceDue.forEach(v => {
          response += `**${v.id}:**\n`;
          const serviceAlerts = v.alerts.filter(a => a.type.includes('Due') || a.type.includes('Change'));
          serviceAlerts.forEach(a => {
            response += `  • ${a.type} (${a.severity})\n`;
          });
          response += `\n`;
        });
      } else {
        response += `✅ All maintenance schedules are up to date!\n`;
      }
      
      return response;
    }
    
    if (lowerQuery.includes('compare') || lowerQuery.includes('vs') || lowerQuery.includes('versus')) {
      // Extract vehicle IDs from query
      const vehicleIds = vehicleData.map(v => v.id).filter(id => lowerQuery.includes(id.toLowerCase()));
      
      if (vehicleIds.length >= 2) {
        const v1 = vehicleData.find(v => v.id === vehicleIds[0]);
        const v2 = vehicleData.find(v => v.id === vehicleIds[1]);
        
        let response = `📊 **Vehicle Comparison: ${v1.id} vs ${v2.id}**\n\n`;
        response += `| Metric | ${v1.id} | ${v2.id} |\n`;
        response += `|--------|---------|----------|\n`;
        response += `| Type | ${v1.type} | ${v2.type} |\n`;
        response += `| Health | ${v1.healthIndex}/100 | ${v2.healthIndex}/100 |\n`;
        response += `| Status | ${v1.status} | ${v2.status} |\n`;
        response += `| Efficiency | ${v1.avgFuelEfficiency} mpg | ${v2.avgFuelEfficiency} mpg |\n`;
        response += `| Cost/mile | $${v1.fuelCostPerMile} | $${v2.fuelCostPerMile} |\n`;
        response += `| Daily Cost | $${v1.totalFuelCostDaily.toFixed(2)} | $${v2.totalFuelCostDaily.toFixed(2)} |\n`;
        response += `| Alerts | ${v1.alerts.length} | ${v2.alerts.length} |\n`;
        
        const better = v1.healthIndex > v2.healthIndex ? v1.id : v2.id;
        response += `\n**Winner:** ${better} (better overall health)\n`;
        
        return response;
      } else {
        return `To compare vehicles, mention both vehicle IDs in your question.\nExample: "Compare VAN-001 and TRK-142"`;
      }
    }
    
    // Default: Provide helpful suggestions
    return `🤖 **I can help you with:**

• Fleet health overview and summaries
• Identify vehicles needing immediate attention
• Cost analysis and fuel expenses
• Fuel efficiency comparisons
• Active faults and alerts
• Idle time monitoring
• Maintenance scheduling
• Vehicle-to-vehicle comparisons

**Try asking:**
- "Which vehicles need immediate attention?"
- "What's my total fuel cost?"
- "Show me vehicles with active faults"
- "Which vehicles have poor efficiency?"
- "Compare VAN-001 and TRK-142"
- "Show me idle vehicles"

What would you like to know about your fleet?`;
  };

  // Handle send message
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate thinking time for more natural feel
    setTimeout(() => {
      const aiResponse = analyzeFleetData(userMessage.content);
      
      const assistantMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, assistantMessage]);
      updateActiveConversation([...messages, userMessage, assistantMessage]);
      setIsLoading(false);
    }, 800);
  };

  // Update active conversation
  const updateActiveConversation = (newMessages) => {
    setConversations(prev => {
      const updated = prev.map(conv => 
        conv.id === activeConversationId 
          ? { ...conv, messages: newMessages, updatedAt: new Date().toISOString() }
          : conv
      );
      return updated;
    });
  };

  // Start new conversation
  const startNewConversation = () => {
    const newConv = {
      id: Date.now(),
      title: `Chat ${conversations.length + 1}`,
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setConversations(prev => [newConv, ...prev]);
    setActiveConversationId(newConv.id);
    setMessages([]);
  };

  // Switch conversation
  const switchConversation = (convId) => {
    const conv = conversations.find(c => c.id === convId);
    if (conv) {
      setActiveConversationId(convId);
      setMessages(conv.messages);
    }
  };

  // Delete conversation
  const deleteConversation = (convId) => {
    const updated = conversations.filter(c => c.id !== convId);
    setConversations(updated);
    
    if (convId === activeConversationId) {
      if (updated.length > 0) {
        setActiveConversationId(updated[0].id);
        setMessages(updated[0].messages);
      } else {
        setActiveConversationId(null);
        setMessages([]);
      }
    }
  };

  // Suggested questions
  const suggestedQuestions = [
    "Which vehicles need immediate attention?",
    "What's my total daily fuel cost?",
    "Show me vehicles with active faults",
    "Which vehicles have poor fuel efficiency?",
    "Show me idle vehicles",
    "Give me a fleet health summary"
  ];

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-[#5b4b9d] to-[#6d5ba7] hover:from-[#6d5ba7] hover:to-[#7d6bb7] text-white rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 z-50 group"
        title="Open Fleet AI Assistant"
      >
        <MessageCircle className="w-6 h-6" />
        <Sparkles className="w-3 h-3 absolute -top-1 -right-1 text-yellow-300 animate-pulse" />
      </button>
    );
  }

  return (
    <>
      {/* Sidebar Chat - 33% width, slides from right */}
      <div 
        className="fixed top-0 right-0 h-full w-1/3 bg-white shadow-2xl flex flex-col z-50 border-l border-gray-200"
        style={{
          minWidth: '400px',
          animation: 'slideInRight 0.3s ease-out'
        }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#5b4b9d] to-[#6d5ba7] text-white p-4 flex items-center justify-between border-b border-purple-600">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center relative">
              <Bot className="w-6 h-6" />
              <Sparkles className="w-3 h-3 absolute -top-0.5 -right-0.5 text-yellow-300" />
            </div>
            <div>
              <h3 className="font-bold text-base">Fleet AI Assistant</h3>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conversation Tabs */}
        <div className="bg-gray-50 border-b border-gray-200 p-2">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <button
              onClick={startNewConversation}
              className="flex items-center gap-1 px-3 py-1.5 bg-[#5b4b9d] hover:bg-[#6d5ba7] text-white rounded-lg text-xs font-semibold whitespace-nowrap transition-colors"
            >
              <Plus className="w-3 h-3" />
              New Chat
            </button>
            {conversations.map(conv => (
              <button
                key={conv.id}
                onClick={() => switchConversation(conv.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  conv.id === activeConversationId
                    ? 'bg-white text-[#5b4b9d] border border-[#5b4b9d]'
                    : 'bg-white text-gray-700 border border-gray-300 hover:border-[#5b4b9d]'
                }`}
              >
                {conv.title}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteConversation(conv.id);
                  }}
                  className="hover:text-red-500"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.length === 0 && (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-gradient-to-br from-[#5b4b9d] to-[#6d5ba7] rounded-full flex items-center justify-center mx-auto mb-4 relative">
                <Bot className="w-10 h-10 text-white" />
                <Sparkles className="w-5 h-5 absolute -top-1 -right-1 text-yellow-300 animate-pulse" />
              </div>
              <h4 className="text-base font-semibold text-gray-900 mb-2">Welcome to Fleet AI!</h4>
              <p className="text-sm text-gray-600 mb-4">Ask me anything about your fleet. I analyze your data instantly!</p>
              
              <div className="space-y-2 mt-6">
                <p className="text-xs font-semibold text-gray-700 uppercase">Try asking:</p>
                <div className="grid grid-cols-1 gap-2">
                  {suggestedQuestions.slice(0, 4).map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => setInput(q)}
                      className="text-left px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs text-gray-700 hover:border-[#5b4b9d] hover:bg-purple-50 transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 bg-gradient-to-br from-[#5b4b9d] to-[#6d5ba7] rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-white" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                  msg.role === 'user'
                    ? 'bg-[#5b4b9d] text-white'
                    : 'bg-white text-gray-900 border border-gray-200'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                <p className="text-xs mt-1 opacity-60">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </p>
              </div>
              {msg.role === 'user' && (
                <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-white" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-[#5b4b9d] to-[#6d5ba7] rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-[#5b4b9d] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-[#5b4b9d] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-[#5b4b9d] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 p-4 bg-white">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about your fleet..."
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#5b4b9d] disabled:bg-gray-100"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="px-4 py-2.5 bg-gradient-to-r from-[#5b4b9d] to-[#6d5ba7] hover:from-[#6d5ba7] hover:to-[#7d6bb7] text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
};

export default ChatBot;
