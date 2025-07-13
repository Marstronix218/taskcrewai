import { useState } from "react";
import { DashboardHeader } from "@/components/DashboardHeader";
import { TodoSection } from "@/components/TodoSection";
import { CharacterCompanion } from "@/components/CharacterCompanion";
import { GamificationPanel } from "@/components/GamificationPanel";
import { StatsOverview } from "@/components/StatsOverview";

const Index = () => {
  const [activeCharacter, setActiveCharacter] = useState({
    id: 1,
    name: "Luna",
    type: "Buddy",
    level: 5,
    bondPoints: 150,
    avatar: "🌙",
    personality: "cheerful"
  });

  const [userStats, setUserStats] = useState({
    level: 12,
    xp: 1250,
    xpToNext: 1500,
    streakDays: 7,
    totalTasks: 156,
    completedToday: 3
  });

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={{ name: "Adventurer", level: userStats.level }} />
      
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Stats Overview */}
        <StatsOverview stats={userStats} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            <TodoSection 
              onTaskComplete={(xp) => {
                setUserStats(prev => ({ 
                  ...prev, 
                  xp: prev.xp + xp,
                  completedToday: prev.completedToday + 1 
                }));
              }}
            />
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            <CharacterCompanion 
              character={activeCharacter}
              userStats={userStats}
            />
            <GamificationPanel 
              character={activeCharacter}
              userStats={userStats}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
