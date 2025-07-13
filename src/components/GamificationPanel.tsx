import { Trophy, Award, Gem, Calendar, Target } from "lucide-react";
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

interface UserStats {
  level: number;
  xp: number;
  xpToNext: number;
  streakDays: number;
  totalTasks: number;
  completedToday: number;
}

interface GamificationPanelProps {
  character: Character;
  userStats: UserStats;
}

export const GamificationPanel = ({ character, userStats }: GamificationPanelProps) => {
  const achievements = [
    {
      id: 1,
      name: "First Steps",
      description: "Complete your first task",
      icon: Target,
      unlocked: true,
      rarity: "common"
    },
    {
      id: 2,
      name: "Streak Master",
      description: "Maintain a 7-day streak",
      icon: Calendar,
      unlocked: userStats.streakDays >= 7,
      rarity: "rare"
    },
    {
      id: 3,
      name: "Productivity King",
      description: "Complete 100 total tasks",
      icon: Trophy,
      unlocked: userStats.totalTasks >= 100,
      rarity: "epic"
    }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common": return "text-gray-400";
      case "rare": return "text-blue-400";
      case "epic": return "text-purple-400";
      case "legendary": return "text-yellow-400";
      default: return "text-gray-400";
    }
  };

  const weeklyGoal = {
    current: userStats.completedToday * 7, // Simulated weekly progress
    target: 35,
    name: "Weekly Quest Goal"
  };

  return (
    <div className="space-y-6">
      {/* Weekly Goal */}
      <div className="gaming-card p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Gem className="w-5 h-5 text-accent" />
            <h3 className="font-semibold">Weekly Goal</h3>
          </div>
          <Badge variant="secondary" className="text-xs">
            {Math.round((weeklyGoal.current / weeklyGoal.target) * 100)}%
          </Badge>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{weeklyGoal.name}</span>
            <span>{weeklyGoal.current} / {weeklyGoal.target}</span>
          </div>
          <Progress 
            value={(weeklyGoal.current / weeklyGoal.target) * 100} 
            className="h-2"
          />
        </div>
        
        <div className="mt-3 p-2 bg-accent/10 rounded-lg border border-accent/20">
          <p className="text-xs text-accent">
            🎁 Reward: New character unlock!
          </p>
        </div>
      </div>

      {/* Achievements */}
      <div className="gaming-card p-4">
        <div className="flex items-center space-x-2 mb-4">
          <Award className="w-5 h-5 text-warning" />
          <h3 className="font-semibold">Achievements</h3>
        </div>
        
        <div className="space-y-3">
          {achievements.map((achievement) => {
            const IconComponent = achievement.icon;
            return (
              <div
                key={achievement.id}
                className={`flex items-center space-x-3 p-3 rounded-lg border transition-all ${
                  achievement.unlocked
                    ? 'bg-success/10 border-success/20 animate-glow-pulse'
                    : 'bg-muted/20 border-border opacity-60'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  achievement.unlocked 
                    ? 'bg-success/20' 
                    : 'bg-muted/30'
                }`}>
                  <IconComponent className={`w-4 h-4 ${
                    achievement.unlocked 
                      ? 'text-success' 
                      : 'text-muted-foreground'
                  }`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <p className={`font-medium text-sm ${
                      achievement.unlocked ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                      {achievement.name}
                    </p>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getRarityColor(achievement.rarity)}`}
                    >
                      {achievement.rarity}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {achievement.description}
                  </p>
                </div>
                
                {achievement.unlocked && (
                  <div className="text-success text-xl animate-bounce-gentle">
                    ✨
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Daily Stats */}
      <div className="gaming-card p-4">
        <h3 className="font-semibold mb-4 flex items-center space-x-2">
          <Trophy className="w-5 h-5 text-warning" />
          <span>Today's Progress</span>
        </h3>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 bg-muted/20 rounded-lg border border-border">
            <p className="text-2xl font-bold text-accent">{userStats.completedToday}</p>
            <p className="text-xs text-muted-foreground">Tasks Done</p>
          </div>
          
          <div className="text-center p-3 bg-muted/20 rounded-lg border border-border">
            <p className="text-2xl font-bold text-warning">{userStats.streakDays}</p>
            <p className="text-xs text-muted-foreground">Day Streak</p>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Next milestone</span>
            <span className="text-xs text-primary">+50 XP</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Complete 2 more tasks to unlock bonus XP!
          </p>
        </div>
      </div>
    </div>
  );
};