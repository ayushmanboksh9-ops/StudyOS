import { useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useDataStore } from "@/stores/dataStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, CalendarRange, CheckCircle2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function MonthlyPlanner() {
  const { user } = useAuthStore();
  const { monthlyGoals, addMonthlyGoal, toggleMonthlyGoal } = useDataStore();

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    goal: "",
    month: "",
  });

  const handleAddGoal = () => {
    if (!formData.goal || !formData.month) {
      return;
    }

    addMonthlyGoal({
      goal: formData.goal,
      month: formData.month,
      completed: false,
      userId: user!.id,
    });

    setFormData({ goal: "", month: "" });
    setShowForm(false);
  };

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const activeGoals = monthlyGoals.filter((g) => !g.completed);
  const completedGoals = monthlyGoals.filter((g) => g.completed);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Monthly Planner</h1>
          <p className="text-gray-600 mt-1">Set approximate monthly goals</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="gradient-primary text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Goal
        </Button>
      </div>

      {showForm && (
        <Card className="border-2 border-violet-200 animate-fade-in">
          <CardHeader>
            <CardTitle>Add Monthly Goal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Month</Label>
              <Select value={formData.month} onValueChange={(v) => setFormData({ ...formData, month: v })}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month} value={month}>
                      {month} 2026
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Goal Description</Label>
              <Textarea
                placeholder="e.g., Finish entire syllabus revision"
                value={formData.goal}
                onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                className="mt-1"
                rows={3}
              />
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
            <CalendarRange className="w-5 h-5 text-violet-600" />
            Active Monthly Goals
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeGoals.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <CalendarRange className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>No active monthly goals. Add one to get started!</p>
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
                      onCheckedChange={() => toggleMonthlyGoal(goal.id)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-violet-600 bg-violet-100 px-2 py-1 rounded">
                          {goal.month}
                        </span>
                      </div>
                      <p className="text-gray-900 font-medium">{goal.goal}</p>
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
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-1 rounded">
                          {goal.month}
                        </span>
                      </div>
                      <p className="text-gray-900 line-through">{goal.goal}</p>
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
