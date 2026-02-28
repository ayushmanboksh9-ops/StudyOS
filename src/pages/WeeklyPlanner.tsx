import { useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useDataStore } from "@/stores/dataStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Target, CheckCircle2 } from "lucide-react";

export default function WeeklyPlanner() {
  const { user } = useAuthStore();
  const { weeklyGoals, addWeeklyGoal, toggleWeeklyGoal } = useDataStore();

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    goal: "",
    startDate: "",
    endDate: "",
  });

  const handleAddGoal = () => {
    if (!formData.goal) {
      return;
    }

    addWeeklyGoal({
      goal: formData.goal,
      startDate: formData.startDate || undefined,
      endDate: formData.endDate || undefined,
      completed: false,
      userId: user!.id,
    });

    setFormData({ goal: "", startDate: "", endDate: "" });
    setShowForm(false);
  };

  const activeGoals = weeklyGoals.filter((g) => !g.completed);
  const completedGoals = weeklyGoals.filter((g) => g.completed);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Weekly Planner</h1>
          <p className="text-gray-600 mt-1">Set and track your weekly goals</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="gradient-primary text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Goal
        </Button>
      </div>

      {showForm && (
        <Card className="border-2 border-violet-200 animate-fade-in">
          <CardHeader>
            <CardTitle>Add Weekly Goal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Goal Description</Label>
              <Textarea
                placeholder="e.g., Complete 5 chapters of Physics"
                value={formData.goal}
                onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                className="mt-1"
                rows={3}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Start Date (Optional)</Label>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div>
                <Label>End Date (Optional)</Label>
                <Input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleAddGoal} className="gradient-primary text-white">
                Add Goal
              </Button>
              <Button onClick={() => setShowForm(false)} variant="outline">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-violet-600" />
            Active Goals
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeGoals.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Target className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>No active goals. Add one to get started!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activeGoals.map((goal) => (
                <div
                  key={goal.id}
                  className="p-4 rounded-xl bg-gradient-to-r from-violet-50 to-blue-50 border border-violet-200"
                >
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={goal.completed}
                      onCheckedChange={() => toggleWeeklyGoal(goal.id)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <p className="text-gray-900 font-medium">{goal.goal}</p>
                      {(goal.startDate || goal.endDate) && (
                        <p className="text-sm text-gray-600 mt-1">
                          {goal.startDate && `From ${goal.startDate}`}
                          {goal.startDate && goal.endDate && " "}
                          {goal.endDate && `to ${goal.endDate}`}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              Completed Goals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {completedGoals.map((goal) => (
                <div
                  key={goal.id}
                  className="p-4 rounded-lg bg-green-50 border border-green-200 opacity-75"
                >
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-1" />
                    <div className="flex-1">
                      <p className="text-gray-900 line-through">{goal.goal}</p>
                      {(goal.startDate || goal.endDate) && (
                        <p className="text-sm text-gray-600 mt-1">
                          {goal.startDate && `From ${goal.startDate}`}
                          {goal.startDate && goal.endDate && " "}
                          {goal.endDate && `to ${goal.endDate}`}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
