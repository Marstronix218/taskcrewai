import { useState } from "react";
import { Plus, Circle, CheckCircle2, Clock, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface Task {
  id: number;
  title: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  category: string;
  xpReward: number;
}

interface TodoSectionProps {
  onTaskComplete: (xp: number) => void;
}

export const TodoSection = ({ onTaskComplete }: TodoSectionProps) => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      title: "Review project requirements",
      completed: false,
      priority: "high",
      category: "Work",
      xpReward: 25
    },
    {
      id: 2,
      title: "30-minute morning workout",
      completed: true,
      priority: "medium",
      category: "Health",
      xpReward: 15
    },
    {
      id: 3,
      title: "Read 20 pages of current book",
      completed: false,
      priority: "low",
      category: "Personal",
      xpReward: 10
    }
  ]);

  const [newTask, setNewTask] = useState("");

  const addTask = () => {
    if (newTask.trim()) {
      const task: Task = {
        id: Date.now(),
        title: newTask,
        completed: false,
        priority: "medium",
        category: "Personal",
        xpReward: 15
      };
      setTasks([...tasks, task]);
      setNewTask("");
    }
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        const updatedTask = { ...task, completed: !task.completed };
        if (updatedTask.completed && !task.completed) {
          onTaskComplete(task.xpReward);
        }
        return updatedTask;
      }
      return task;
    }));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "destructive";
      case "medium": return "default";
      case "low": return "secondary";
      default: return "default";
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high": return <Flag className="w-3 h-3" />;
      case "medium": return <Clock className="w-3 h-3" />;
      case "low": return <Circle className="w-3 h-3" />;
      default: return <Clock className="w-3 h-3" />;
    }
  };

  const incompleteTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  return (
    <div className="gaming-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold glow-text">Today's Quests</h2>
        <Badge variant="secondary" className="text-xs">
          {incompleteTasks.length} remaining
        </Badge>
      </div>

      {/* Add New Task */}
      <div className="flex space-x-2 mb-6">
        <Input
          placeholder="Add a new quest..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTask()}
          className="bg-muted/50"
        />
        <Button onClick={addTask} className="gaming-button shrink-0">
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Active Tasks */}
      <div className="space-y-3 mb-6">
        <h3 className="font-semibold text-muted-foreground text-sm uppercase tracking-wide">
          Active Quests
        </h3>
        {incompleteTasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center space-x-3 p-3 rounded-lg bg-muted/20 border border-border hover:border-primary/30 transition-all animate-fade-in"
          >
            <button
              onClick={() => toggleTask(task.id)}
              className="text-muted-foreground hover:text-accent transition-colors"
            >
              <Circle className="w-5 h-5" />
            </button>
            <div className="flex-1">
              <p className="font-medium">{task.title}</p>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant={getPriorityColor(task.priority)} className="text-xs">
                  {getPriorityIcon(task.priority)}
                  <span className="ml-1">{task.priority}</span>
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {task.category}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  +{task.xpReward} XP
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-muted-foreground text-sm uppercase tracking-wide">
            Completed Today
          </h3>
          {completedTasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center space-x-3 p-3 rounded-lg bg-success/10 border border-success/20 opacity-75"
            >
              <CheckCircle2 className="w-5 h-5 text-success" />
              <div className="flex-1">
                <p className="font-medium line-through text-muted-foreground">{task.title}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="outline" className="text-xs">
                    {task.category}
                  </Badge>
                  <Badge className="text-xs bg-success/20 text-success">
                    +{task.xpReward} XP Earned
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};