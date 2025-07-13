import { Target, Flame, Trophy, Zap } from "lucide-react";

interface StatsOverviewProps {
  stats: {
    level: number;
    xp: number;
    xpToNext: number;
    streakDays: number;
    totalTasks: number;
    completedToday: number;
  };
}

export const StatsOverview = ({ stats }: StatsOverviewProps) => {
  const xpProgress = (stats.xp / stats.xpToNext) * 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* XP Progress */}
      <div className="gaming-card p-4 md:col-span-2">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-accent" />
            <span className="font-semibold">Level {stats.level}</span>
          </div>
          <span className="text-sm text-muted-foreground">
            {stats.xp} / {stats.xpToNext} XP
          </span>
        </div>
        <div className="xp-bar">
          <div 
            className="xp-fill" 
            style={{ width: `${xpProgress}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {stats.xpToNext - stats.xp} XP to next level
        </p>
      </div>

      {/* Streak */}
      <div className="gaming-card p-4">
        <div className="flex items-center space-x-2 mb-2">
          <Flame className="w-5 h-5 text-warning streak-flame" />
          <span className="font-semibold">Streak</span>
        </div>
        <p className="text-2xl font-bold glow-text">{stats.streakDays}</p>
        <p className="text-xs text-muted-foreground">days</p>
      </div>

      {/* Today's Progress */}
      <div className="gaming-card p-4">
        <div className="flex items-center space-x-2 mb-2">
          <Target className="w-5 h-5 text-success" />
          <span className="font-semibold">Today</span>
        </div>
        <p className="text-2xl font-bold text-success">{stats.completedToday}</p>
        <p className="text-xs text-muted-foreground">tasks done</p>
      </div>
    </div>
  );
};