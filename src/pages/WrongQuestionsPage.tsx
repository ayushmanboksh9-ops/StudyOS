import { useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useDataStore } from "@/stores/dataStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Upload, X, AlertCircle, FileText, Image as ImageIcon, ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";
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
  const [previewImage, setPreviewImage] = useState<{ url: string; name: string; questionId: string; fileIndex: number } | null>(null);
  const [previewFiles, setPreviewFiles] = useState<{ name: string; type: string; data: string }[]>([]);

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

  const openImagePreview = (file: { name: string; type: string; data: string }, questionId: string, fileIndex: number, allFiles: { name: string; type: string; data: string }[]) => {
    if (file.type.startsWith('image/')) {
      setPreviewImage({ url: file.data, name: file.name, questionId, fileIndex });
      setPreviewFiles(allFiles.filter(f => f.type.startsWith('image/')));
    } else {
      // For PDFs, open in new tab
      const blob = dataURLtoBlob(file.data);
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    }
  };

  const dataURLtoBlob = (dataURL: string) => {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  const closePreview = () => {
    setPreviewImage(null);
    setPreviewFiles([]);
  };

  const navigatePreview = (direction: 'prev' | 'next') => {
    if (!previewImage) return;
    const currentIndex = previewFiles.findIndex(f => f.data === previewImage.url);
    let newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    if (newIndex < 0) newIndex = previewFiles.length - 1;
    if (newIndex >= previewFiles.length) newIndex = 0;
    const newFile = previewFiles[newIndex];
    setPreviewImage({ ...previewImage, url: newFile.data, name: newFile.name });
  };

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
                  <div className="grid grid-cols-2 gap-2">
                    {question.files.map((file, index) => (
                      <div
                        key={index}
                        onClick={() => openImagePreview(file, question.id, index, question.files)}
                        className="group relative cursor-pointer rounded-lg overflow-hidden border-2 border-gray-200 hover:border-violet-400 transition-all bg-gray-50 hover:shadow-lg"
                      >
                        {file.type.startsWith('image/') ? (
                          <>
                            <img
                              src={file.data}
                              alt={file.name}
                              className="w-full h-32 object-cover group-hover:scale-105 transition-transform"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                              <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                              <p className="text-xs text-white truncate">{file.name}</p>
                            </div>
                          </>
                        ) : (
                          <div className="h-32 flex flex-col items-center justify-center p-3 hover:bg-gray-100 transition-colors">
                            <FileText className="w-8 h-8 text-red-500 mb-2" />
                            <p className="text-xs text-gray-700 text-center truncate w-full">{file.name}</p>
                            <p className="text-xs text-gray-500 mt-1">Click to open</p>
                          </div>
                        )}
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

      {/* Image Preview Modal - Full Screen with Proper Display */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black/95 z-[100] animate-fade-in"
          onClick={closePreview}
        >
          {/* Modal Container */}
          <div className="relative w-full h-full flex flex-col" onClick={(e) => e.stopPropagation()}>
            {/* Top Controls Bar */}
            <div className="absolute top-0 left-0 right-0 z-20 p-4 md:p-6 bg-gradient-to-b from-black/80 to-transparent">
              <div className="flex items-center justify-between">
                <div className="flex-1 pr-4">
                  <p className="text-white font-semibold text-base md:text-lg drop-shadow-lg truncate">
                    {previewImage.name}
                  </p>
                  {previewFiles.length > 1 && (
                    <p className="text-white/80 text-sm mt-1">
                      Image {previewFiles.findIndex(f => f.data === previewImage.url) + 1} of {previewFiles.length}
                    </p>
                  )}
                </div>
                <Button
                  onClick={closePreview}
                  className="bg-white/20 hover:bg-white/30 text-white border-2 border-white/40 backdrop-blur-md shadow-lg h-12 w-12 flex-shrink-0"
                  size="icon"
                >
                  <X className="w-6 h-6" />
                </Button>
              </div>
            </div>

            {/* Navigation Buttons - Only if multiple images */}
            {previewFiles.length > 1 && (
              <>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigatePreview('prev');
                  }}
                  className="fixed left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 text-white border-2 border-white/40 backdrop-blur-md shadow-xl h-12 w-12 md:h-14 md:w-14 rounded-full"
                  size="icon"
                >
                  <ChevronLeft className="w-6 h-6 md:w-7 md:h-7" />
                </Button>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigatePreview('next');
                  }}
                  className="fixed right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 text-white border-2 border-white/40 backdrop-blur-md shadow-xl h-12 w-12 md:h-14 md:w-14 rounded-full"
                  size="icon"
                >
                  <ChevronRight className="w-6 h-6 md:w-7 md:h-7" />
                </Button>
              </>
            )}

            {/* Image Container - Centered and Properly Sized */}
            <div className="flex-1 flex items-center justify-center p-4 md:p-20 pt-24 pb-20">
              <img
                src={previewImage.url}
                alt={previewImage.name}
                className="max-w-full max-h-full w-auto h-auto object-contain rounded-lg shadow-2xl border-4 border-white/10"
                style={{ 
                  maxHeight: 'calc(100vh - 160px)',
                  maxWidth: 'calc(100vw - 32px)'
                }}
              />
            </div>

            {/* Bottom Hint */}
            <div className="absolute bottom-0 left-0 right-0 z-20 p-4 bg-gradient-to-t from-black/80 to-transparent">
              <p className="text-white/70 text-sm text-center">
                Click anywhere outside the image to close • Use arrow buttons to navigate
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
