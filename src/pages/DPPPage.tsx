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
import { Plus, FileText } from "lucide-react";
import { format } from "date-fns";
import { useCustomSubjects } from "@/hooks/useCustomSubjects";
import SubjectSelector from "@/components/features/SubjectSelector";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function DPPPage() {
  const { user } = useAuthStore();
  const { dpps, addDPP } = useDataStore();
  const { customSubjects, addCustomSubject } = useCustomSubjects();

  const [formData, setFormData] = useState({
    subject: "",
    date: format(new Date(), "yyyy-MM-dd"),
    marks: "",
    totalMarks: "",
  });

  const handleAddDPP = () => {
    if (!formData.subject || !formData.marks || !formData.totalMarks) {
      return;
    }

    addDPP({
      subject: formData.subject,
      date: formData.date,
      marks: parseInt(formData.marks),
      totalMarks: parseInt(formData.totalMarks),
      userId: user!.id,
    });

    setFormData({
      subject: "",
      date: format(new Date(), "yyyy-MM-dd"),
      marks: "",
      totalMarks: "",
    });
  };

  // Prepare chart data
  const chartData = dpps
    .slice(-10)
    .map((dpp) => ({
      date: format(new Date(dpp.date), "MMM dd"),
      percentage: (dpp.marks / dpp.totalMarks * 100).toFixed(1),
      subject: dpp.subject,
    }));

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">DPP Tracker</h1>
        <p className="text-gray-600 mt-1">Track Daily Practice Problems performance</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add DPP Result</CardTitle>
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
              <Label>Marks Obtained</Label>
              <Input
                type="number"
                min="0"
                placeholder="e.g., 85"
                value={formData.marks}
                onChange={(e) => setFormData({ ...formData, marks: e.target.value })}
                className="mt-1"
              />
            </div>

            <div>
              <Label>Total Marks</Label>
              <Input
                type="number"
                min="0"
                placeholder="e.g., 100"
                value={formData.totalMarks}
                onChange={(e) => setFormData({ ...formData, totalMarks: e.target.value })}
                className="mt-1"
              />
            </div>
          </div>

          <Button onClick={handleAddDPP} className="gradient-primary text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add DPP Result
          </Button>
        </CardContent>
      </Card>

      {/* Performance Chart */}
      {dpps.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Performance Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="percentage" stroke="#8b5cf6" strokeWidth={2} name="Score %" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Results */}
      <Card>
        <CardHeader>
          <CardTitle>Recent DPP Results</CardTitle>
        </CardHeader>
        <CardContent>
          {dpps.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>No DPP results logged yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {dpps.slice(-10).reverse().map((dpp) => {
                const percentage = (dpp.marks / dpp.totalMarks * 100).toFixed(1);
                return (
                  <div key={dpp.id} className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                    <div>
                      <div className="font-medium text-gray-900">{dpp.subject}</div>
                      <div className="text-sm text-gray-600">
                        {format(new Date(dpp.date), "MMM dd, yyyy")}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">
                        {dpp.marks}/{dpp.totalMarks}
                      </div>
                      <div className={`text-sm ${parseFloat(percentage) >= 80 ? "text-green-600" : parseFloat(percentage) >= 60 ? "text-orange-600" : "text-red-600"}`}>
                        {percentage}%
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
