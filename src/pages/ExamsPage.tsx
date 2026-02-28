import { useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useDataStore } from "@/stores/dataStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Clock, Calendar as CalendarIcon } from "lucide-react";
import { format, differenceInDays } from "date-fns";

export default function ExamsPage() {
  const { user } = useAuthStore();
  const { exams, addExam } = useDataStore();

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    time: "",
  });

  const handleAddExam = () => {
    if (!formData.name || !formData.date || !formData.time) {
      return;
    }

    addExam({
      name: formData.name,
      date: formData.date,
      time: formData.time,
      userId: user!.id,
    });

    setFormData({ name: "", date: "", time: "" });
    setShowForm(false);
  };

  const upcomingExams = exams
    .filter((e) => new Date(e.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const pastExams = exams
    .filter((e) => new Date(e.date) < new Date())
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Exams</h1>
          <p className="text-gray-600 mt-1">Schedule and track your exams</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="gradient-primary text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Exam
        </Button>
      </div>

      {showForm && (
        <Card className="border-2 border-violet-200 animate-fade-in">
          <CardHeader>
            <CardTitle>Schedule New Exam</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Exam Name</Label>
              <Input
                type="text"
                placeholder="e.g., JEE Main Mock Test 1"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
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
                <Label>Time</Label>
                <Input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleAddExam} className="gradient-primary text-white">
                Schedule Exam
              </Button>
              <Button onClick={() => setShowForm(false)} variant="outline">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upcoming Exams */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Exams</CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingExams.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <CalendarIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>No upcoming exams scheduled</p>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingExams.map((exam) => {
                const daysLeft = differenceInDays(new Date(exam.date), new Date());
                const isUrgent = daysLeft <= 7;

                return (
                  <div
                    key={exam.id}
                    className={`p-6 rounded-xl border-2 ${
                      isUrgent
                        ? "bg-gradient-to-r from-red-50 to-orange-50 border-red-200 animate-glow"
                        : "bg-gradient-to-r from-violet-50 to-blue-50 border-violet-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <div className={`w-20 h-20 rounded-2xl ${isUrgent ? "bg-red-600" : "gradient-primary"} flex flex-col items-center justify-center text-white shadow-lg`}>
                          <div className="text-3xl font-bold">{daysLeft}</div>
                          <div className="text-xs">days</div>
                        </div>

                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{exam.name}</h3>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <CalendarIcon className="w-4 h-4" />
                              {format(new Date(exam.date), "MMMM dd, yyyy")}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {exam.time}
                            </span>
                          </div>
                        </div>
                      </div>

                      {isUrgent && (
                        <div className="text-red-600 font-semibold text-lg">
                          🔥 Coming Soon!
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Past Exams */}
      {pastExams.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Past Exams</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pastExams.map((exam) => (
                <div
                  key={exam.id}
                  className="p-4 rounded-lg bg-gray-50 flex items-center justify-between"
                >
                  <div>
                    <div className="font-medium text-gray-900">{exam.name}</div>
                    <div className="text-sm text-gray-600 mt-1">
                      {format(new Date(exam.date), "MMM dd, yyyy")} at {exam.time}
                    </div>
                    {exam.marks && (
                      <div className="text-sm text-green-600 font-medium mt-1">
                        Results recorded
                      </div>
                    )}
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
