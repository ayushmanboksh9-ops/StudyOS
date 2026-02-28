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
import { Plus, Upload, BookOpen, Trash2 } from "lucide-react";
import { JEE_SUBJECTS, NEET_SUBJECTS } from "@/constants/subjects";
import { toast } from "sonner";

export default function NotesPage() {
  const { user } = useAuthStore();
  const { notes, addNote, deleteNote } = useDataStore();

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    subject: "",
    chapter: "",
    files: [] as File[],
  });

  const subjects = user?.exam?.includes("JEE") ? JEE_SUBJECTS : NEET_SUBJECTS;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData({ ...formData, files: [...formData.files, ...files] });
  };

  const removeFile = (index: number) => {
    setFormData({
      ...formData,
      files: formData.files.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = () => {
    if (!formData.subject || !formData.chapter || formData.files.length === 0) {
      toast.error("Please fill all fields and upload at least one file");
      return;
    }

    // Convert files to base64
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
      addNote({
        subject: formData.subject,
        chapter: formData.chapter,
        files: filesData,
        createdAt: new Date().toISOString(),
        userId: user!.id,
      });

      setFormData({ subject: "", chapter: "", files: [] });
      setShowForm(false);
    });
  };

  // Group notes by subject and chapter
  const groupedNotes = notes.reduce((acc, note) => {
    const key = `${note.subject} - Chapter ${note.chapter}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(note);
    return acc;
  }, {} as Record<string, typeof notes>);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notes Library</h1>
          <p className="text-gray-600 mt-1">Organize your notes by subject and chapter</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="gradient-primary text-white">
          <Plus className="w-4 h-4 mr-2" />
          Upload Notes
        </Button>
      </div>

      {showForm && (
        <Card className="border-2 border-violet-200 animate-fade-in">
          <CardHeader>
            <CardTitle>Upload Notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Subject</Label>
                <Select value={formData.subject} onValueChange={(v) => setFormData({ ...formData, subject: v })}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Chapter</Label>
                <Input
                  type="text"
                  placeholder="e.g., 5"
                  value={formData.chapter}
                  onChange={(e) => setFormData({ ...formData, chapter: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label>Upload Files</Label>
              <div className="mt-2">
                <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-violet-400 transition-colors">
                  <div className="text-center">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600">Click to upload PDFs or images</p>
                    <p className="text-xs text-gray-500 mt-1">{formData.files.length} file(s) selected</p>
                  </div>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,image/*"
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
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Button onClick={handleSubmit} className="gradient-primary text-white">
                Upload Notes
              </Button>
              <Button onClick={() => setShowForm(false)} variant="outline">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notes List */}
      {Object.keys(groupedNotes).length === 0 ? (
        <Card>
          <CardContent className="text-center py-12 text-gray-500">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>No notes uploaded yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {Object.entries(groupedNotes).map(([key, notesList]) => (
            <Card key={key}>
              <CardHeader>
                <CardTitle className="text-lg">{key}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {notesList.map((note) => (
                  <div key={note.id} className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">
                        {note.files.length} file(s) • Uploaded {new Date(note.createdAt).toLocaleDateString()}
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteNote(note.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="space-y-1">
                      {note.files.map((file, index) => (
                        <div key={index} className="text-xs text-gray-600">
                          📄 {file.name}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
