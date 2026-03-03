import { useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useDataStore } from "@/stores/dataStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Target } from "lucide-react";
import { format } from "date-fns";
import { useCustomSubjects } from "@/hooks/useCustomSubjects";
import SubjectSelector from "@/components/features/SubjectSelector";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function QuestionTracker() {
  const { user } = useAuthStore();
  const { practices, addPractice } = useDataStore();
  const { customSubjects, addCustomSubject } = useCustomSubjects();

  const [formData, setFormData] = useState({
    subject: "",
    date: format(new Date(), "yyyy-MM-dd"),
    totalQuestions: "",
    wrongQuestions: "",
  });

  const handleAddPractice = () => {
    if (!formData.subject || !formData.totalQuestions || !formData.wrongQuestions) {
      return;
    }

    addPractice({
      subject: formData.subject,
      date: formData.date,
      totalQuestions: parseInt(formData.totalQuestions),
      wrongQuestions: parseInt(formData.wrongQuestions),
      userId: user!.id,
    });

    setFormData({
      subject: "",
      date: format(new Date(), "yyyy-MM-dd"),
      totalQuestions: "",
      wrongQuestions: "",
    });
  };

  // Get all unique subjects from practices
  const allSubjects = Array.from(new Set(practices.map(p => p.subject)));

  // Prepare chart data
  const chartData = allSubjects.map((subject) => {
    const subjectPractices = practices.filter((p) => p.subject === subject);
    const total = subjectPractices.reduce((sum, p) => sum + p.totalQuestions, 0);
    const wrong = subjectPractices.reduce((sum, p) => sum + p.wrongQuestions, 0);
    const correct = total - wrong;

    return {
      subject,
      correct,
      wrong,
      total,
    };
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Question Practice Tracker</h1>
        <p className="text-gray-600 mt-1">Track your daily question practice and wrong answers</p>
      </div>

      <Tabs defaultValue="add" className="space-y-6">
        <TabsList>
          <TabsTrigger value="add">Add Practice</TabsTrigger>
          <TabsTrigger value="view">View Stats</TabsTrigger>
        </TabsList>

        <TabsContent value="add" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Log Practice Session</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Subject</Label>
                  <SubjectSelector
                    value={formData.subject}
                    onChange={(v) => setFormData({ ...formData, subject: v })}
                    customSubjects={customSubjects}
                    onAddCustomSubject={addCustomSubject}
                    placeholder="Select subject"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Total Questions</Label>
                  <Input
                    type="number"
                    min="0"
                    placeholder="e.g., 50"
                    value={formData.totalQuestions}
                    onChange={(e) => setFormData({ ...formData, totalQuestions: e.target.value })}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Wrong Questions</Label>
                  <Input
                    type="number"
                    min="0"
                    placeholder="e.g., 5"
                    value={formData.wrongQuestions}
                    onChange={(e) => setFormData({ ...formData, wrongQuestions: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>

              <Button onClick={handleAddPractice} className="gradient-primary text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add Practice
              </Button>
            </CardContent>
          </Card>

          {/* Recent Entries */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Entries</CardTitle>
            </CardHeader>
            <CardContent>
              {practices.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Target className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No practice logged yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {practices.slice(-10).reverse().map((practice) => {
                    const accuracy = ((practice.totalQuestions - practice.wrongQuestions) / practice.totalQuestions * 100).toFixed(1);
                    return (
                      <div key={practice.id} className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                        <div>
                          <div className="font-medium text-gray-900">{practice.subject}</div>
                          <div className="text-sm text-gray-600">
                            {format(new Date(practice.date), "MMM dd, yyyy")}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-gray-900">
                            {practice.totalQuestions - practice.wrongQuestions}/{practice.totalQuestions}
                          </div>
                          <div className={`text-sm ${parseFloat(accuracy) >= 80 ? "text-green-600" : parseFloat(accuracy) >= 60 ? "text-orange-600" : "text-red-600"}`}>
                            {accuracy}% accuracy
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="view" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Subject-wise Performance</CardTitle>
            </CardHeader>
            <CardContent>
              {practices.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <p>Start logging practice to see analytics</p>
                </div>
              ) : (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="subject" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="correct" fill="#10b981" name="Correct" />
                      <Bar dataKey="wrong" fill="#ef4444" name="Wrong" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Summary Stats */}
          <div className="grid md:grid-cols-3 gap-4">
            {chartData.map((data) => (
              <Card key={data.subject}>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{data.total}</div>
                    <div className="text-sm text-gray-600 mt-1">{data.subject}</div>
                    <div className="text-xs text-gray-500 mt-2">
                      {data.total > 0 ? ((data.correct / data.total) * 100).toFixed(1) : 0}% accuracy
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
