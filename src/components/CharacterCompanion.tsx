import { useState } from "react";
import { Heart, MessageCircle, Star, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface Character {
  id: number;
  name: string;
  type: string;
  level: number;
  bondPoints: number;
  avatar: string;
  personality: string;
}

interface CharacterCompanionProps {
  character: Character;
  userStats: {
    completedToday: number;
    streakDays: number;
  };
}

export const CharacterCompanion = ({ character, userStats }: CharacterCompanionProps) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Great job completing those tasks! You're on fire today! 🔥",
      timestamp: new Date(),
      isCharacter: true
    }
  ]);

  const [newMessage, setNewMessage] = useState("");

  const bondProgress = (character.bondPoints % 100);
  const bondLevel = Math.floor(character.bondPoints / 100) + 1;

  const getMotivationalMessage = () => {
    if (userStats.completedToday === 0) {
      return "Ready to start your daily quest? I believe in you! ✨";
    } else if (userStats.completedToday < 3) {
      return "You're making great progress! Keep going! 💪";
    } else {
      return "Amazing work today! You're absolutely crushing it! 🏆";
    }
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      const userMsg = {
        id: messages.length + 1,
        text: newMessage,
        timestamp: new Date(),
        isCharacter: false
      };
      
      setMessages([...messages, userMsg]);
      setNewMessage("");
      
      // Simulate character response
      setTimeout(() => {
        const responses = [
          "That's the spirit! I'm so proud of your dedication! ✨",
          "You're becoming stronger every day! Keep it up! 💫",
          "I love seeing your progress! We make a great team! 🌟",
          "Your determination is inspiring! Let's conquer today together! ⚡"
        ];
        
        const charMsg = {
          id: messages.length + 2,
          text: responses[Math.floor(Math.random() * responses.length)],
          timestamp: new Date(),
          isCharacter: true
        };
        
        setMessages(prev => [...prev, charMsg]);
      }, 1000);
    }
  };

  return (
    <div className="character-card p-6">
      {/* Character Header */}
      <div className="text-center mb-6">
        <div className="relative inline-block">
          <div className="w-20 h-20 text-4xl rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center border-4 border-primary/20 animate-bounce-gentle">
            {character.avatar}
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-success rounded-full border-2 border-background flex items-center justify-center">
            <span className="text-xs">🟢</span>
          </div>
        </div>
        
        <h3 className="text-xl font-bold mt-3 glow-text">{character.name}</h3>
        <Badge variant="secondary" className="text-xs">
          {character.type} • Level {character.level}
        </Badge>
      </div>

      {/* Bond Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-1">
            <Heart className="w-4 h-4 text-red-400" />
            <span className="text-sm font-medium">Bond Level {bondLevel}</span>
          </div>
          <span className="text-xs text-muted-foreground">
            {character.bondPoints} points
          </span>
        </div>
        <Progress value={bondProgress} className="h-2" />
      </div>

      {/* Motivational Message */}
      <div className="bg-muted/30 rounded-lg p-4 mb-4 border border-border">
        <div className="flex items-start space-x-3">
          <span className="text-2xl">{character.avatar}</span>
          <div className="flex-1">
            <p className="text-sm leading-relaxed">{getMotivationalMessage()}</p>
            <div className="flex items-center space-x-2 mt-2">
              <Badge variant="outline" className="text-xs">
                <Sparkles className="w-3 h-3 mr-1" />
                Daily Boost
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Chat */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-sm">Quick Chat</h4>
          <MessageCircle className="w-4 h-4 text-muted-foreground" />
        </div>
        
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Send a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            className="flex-1 px-3 py-2 text-sm bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <Button size="sm" onClick={sendMessage} className="gaming-button text-xs">
            Send
          </Button>
        </div>
        
        {/* Recent Messages */}
        <div className="max-h-32 overflow-y-auto space-y-2">
          {messages.slice(-3).map((msg) => (
            <div
              key={msg.id}
              className={`text-xs p-2 rounded-lg ${
                msg.isCharacter 
                  ? 'bg-primary/10 text-primary-foreground border border-primary/20' 
                  : 'bg-muted/50 text-muted-foreground ml-4'
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};