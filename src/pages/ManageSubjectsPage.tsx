import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useCustomSubjects } from "@/hooks/useCustomSubjects";
import { SUBJECT_STREAMS, UNIQUE_SUBJECTS } from "@/constants/subjects";
import { BookOpen, Plus, Trash2, Sparkles } from "lucide-react";
import { toast } from "sonner";

export default function ManageSubjectsPage() {
  const { customSubjects, addCustomSubject, removeCustomSubject, loading } = useCustomSubjects();
  const [newSubject, setNewSubject] = useState("");

  const handleAddSubject = () => {
    const trimmed = newSubject.trim();
    if (!trimmed) {
      toast.error("Please enter a subject name");
      return;
    }

    addCustomSubject(trimmed);
    setNewSubject("");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg animate-pulse">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600 font-medium">Loading subjects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-heading-2 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-sm">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          Manage Subjects
        </h1>
        <p className="text-gray-600 mt-2">
          Add custom subjects for your study sessions, practice tracking, and notes
        </p>
      </div>

      {/* Add Custom Subject */}
      <Card className="border-2 border-violet-200 bg-gradient-to-br from-violet-50 to-purple-50 shadow-premium">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-heading-3">
            <Sparkles className="w-6 h-6 text-violet-600" />
            Add Custom Subject
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <div className="flex-1">
              <Label htmlFor="new-subject" className="sr-only">
                Subject Name
              </Label>
              <Input
                id="new-subject"
                type="text"
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                placeholder="e.g., Vedic Mathematics, Sanskrit, Data Science..."
                className="h-11"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddSubject();
                  }
                }}
              />
            </div>
            <Button
              onClick={handleAddSubject}
              className="gradient-primary text-white h-11 px-6 font-semibold"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add
            </Button>
          </div>
          <p className="text-sm text-gray-600 mt-3">
            💡 Tip: Add any subject you're studying that's not in the predefined list
          </p>
        </CardContent>
      </Card>

      {/* Your Custom Subjects */}
      {customSubjects.length > 0 && (
        <Card className="border-2 border-gray-100 shadow-premium">
          <CardHeader>
            <CardTitle className="text-heading-3">Your Custom Subjects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {customSubjects.map((subject) => (
                <Badge
                  key={subject}
                  variant="secondary"
                  className="px-4 py-2 text-sm font-medium flex items-center gap-2 bg-violet-100 text-violet-700 hover:bg-violet-200 transition-colors"
                >
                  {subject}
                  <button
                    onClick={() => removeCustomSubject(subject)}
                    className="ml-1 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Predefined Subject Catalog */}
      <Card className="border-2 border-gray-100 shadow-premium">
        <CardHeader>
          <CardTitle className="text-heading-3">Predefined Subject Catalog</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Object.entries(SUBJECT_STREAMS).map(([stream, subjects]) => (
              <div key={stream}>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-violet-500" />
                  {stream}
                  <span className="text-sm text-gray-500 font-normal">
                    ({subjects.length} subjects)
                  </span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {subjects.map((subject) => (
                    <Badge
                      key={subject}
                      variant="outline"
                      className="px-3 py-1.5 text-sm border-gray-300 text-gray-700"
                    >
                      {subject}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="border-2 border-blue-200 bg-blue-50 shadow-premium">
        <CardContent className="flex items-start gap-3 p-4">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="font-semibold text-blue-900 mb-1">How it works</p>
            <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
              <li>All predefined subjects are available across the platform automatically</li>
              <li>Add custom subjects for specialized topics or unique courses</li>
              <li>Your custom subjects sync across all features (Planner, Tracker, Notes, etc.)</li>
              <li>Delete custom subjects you no longer need at any time</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
