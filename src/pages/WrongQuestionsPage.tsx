import { useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useDataStore } from "@/stores/dataStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Upload, X, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCustomSubjects } from "@/hooks/useCustomSubjects";
import SubjectSelector from "@/components/features/SubjectSelector";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";

export default function WrongQuestionsPage() {
  const { user } = useAuthStore();
  const { wrongQuestions, addWrongQuestion, markAsRepeated } = useDataStore();
  const { customSubjects, addCustomSubject } = useCustomSubjects();

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    subject: "",
    chapter: "",
    date: format(new Date(), "yyyy-MM-dd"),
    files: [] as File[],
  });

  const [filter, setFilter] = useState<"all" | "repeated">("all");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (formData.files.length + files.length > 10) {
      toast.error("Maximum 10 files allowed");
      return;
    }
    setFormData({ ...formData, files: [...formData.files, ...files] });
  };

  const removeFile = (index: number) => {
    setFormData({
      ...formData,
      files: formData.files.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = () => {
    if (!formData.subject || formData.files.length === 0) {
      toast.error("Please select subject and upload at least one file");
      return;
    }

    // Convert files to base64 (mock storage)
    const filePromises = formData.files.map((file) => {
      return new Promise<{ name: string; type: string; size: number; data: string }>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve({
            name: file.name,
            type: file.type,
            size: file.size,
            data: reader.result as string,
          });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(filePromises).then((filesData) => {
      addWrongQuestion({
        subject: formData.subject,
        chapter: formData.chapter,
        date: formData.date,
        files: filesData,
        repeated: false,
        userId: user!.id,
      });

      setFormData({
        subject: "",
        chapter: "",
        date: format(new Date(), "yyyy-MM-dd"),
        files: [],
      });
      setShowForm(false);
    });
  };

  const filteredQuestions = wrongQuestions.filter((q) =>
    filter === "all" ? true : q.repeated
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Wrong Questions Library</h1>
          <p className="text-gray-600 mt-1">Upload and organize your wrong questions</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="gradient-primary text-white">
          <Plus className="w-4 h-4 mr-2" />
          Upload Wrong Questions
        </Button>
      </div>

      {showForm && (
        <Card className="border-2 border-violet-200 animate-fade-in">
          <CardHeader>
            <CardTitle>Upload Wrong Questions</CardTitle>
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
                <Label>Chapter (Optional)</Label>
                <Input
                  type="text"
                  placeholder="e.g., 5"
                  value={formData.chapter}
                  onChange={(e) => setFormData({ ...formData, chapter: e.target.value })}
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
            </div>

            <div>
              <Label>Upload Files (Max 10)</Label>
              <div className="mt-2">
                <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-violet-400 transition-colors">
                  <div className="text-center">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600">Click to upload images or PDFs</p>
                    <p className="text-xs text-gray-500 mt-1">{formData.files.length}/10 files selected</p>
                  </div>
                  <input
                    type="file"
                    multiple
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>

              {formData.files.length > 0 && (
                <div className="mt-4 space-y-2">
                  {formData.files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">{file.name}</span>
                      <Button size="sm" variant="ghost" onClick={() => removeFile(index)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Button onClick={handleSubmit} className="gradient-primary text-white">
                Upload Questions
              </Button>
              <Button onClick={() => setShowForm(false)} variant="outline">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              onClick={() => setFilter("all")}
              className={filter === "all" ? "gradient-primary text-white" : ""}
            >
              All Questions ({wrongQuestions.length})
            </Button>
            <Button
              variant={filter === "repeated" ? "default" : "outline"}
              onClick={() => setFilter("repeated")}
              className={filter === "repeated" ? "bg-red-600 hover:bg-red-700 text-white" : ""}
            >
              <AlertCircle className="w-4 h-4 mr-2" />
              Repeated Mistakes ({wrongQuestions.filter((q) => q.repeated).length})
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Questions List */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredQuestions.length === 0 ? (
          <Card className="col-span-2">
            <CardContent className="text-center py-12 text-gray-500">
              <Upload className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>No wrong questions uploaded yet</p>
            </CardContent>
          </Card>
        ) : (
          filteredQuestions.map((question) => (
            <Card key={question.id} className={question.repeated ? "border-2 border-red-200" : ""}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="text-lg">{question.subject}</span>
                  {question.repeated && (
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                      Repeated
                    </span>
                  )}
                </CardTitle>
                {question.chapter && (
                  <p className="text-sm text-gray-600">Chapter {question.chapter}</p>
                )}
                <p className="text-xs text-gray-500">{format(new Date(question.date), "MMM dd, yyyy")}</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    {question.files.length} file(s) uploaded
                  </p>
                  <div className="space-y-2">
                    {question.files.map((file, index) => (
                      <div key={index} className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                        📎 {file.name}
                      </div>
                    ))}
                  </div>
                </div>

                {!question.repeated && (
                  <div className="flex items-center gap-2 pt-2">
                    <Checkbox
                      id={`repeated-${question.id}`}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          markAsRepeated(question.id);
                        }
                      }}
                    />
                    <Label htmlFor={`repeated-${question.id}`} className="text-sm cursor-pointer">
                      Mark as repeated mistake
                    </Label>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
