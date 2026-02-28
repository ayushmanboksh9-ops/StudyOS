import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { SUBJECT_STREAMS, UNIQUE_SUBJECTS } from "@/constants/subjects";
import { Plus, X, BookOpen, Search } from "lucide-react";
import { toast } from "sonner";

interface SubjectSelectorProps {
  value: string;
  onChange: (subject: string) => void;
  customSubjects?: string[];
  onAddCustomSubject?: (subject: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SubjectSelector({
  value,
  onChange,
  customSubjects = [],
  onAddCustomSubject,
  placeholder = "Select subject",
  className,
}: SubjectSelectorProps) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newSubject, setNewSubject] = useState("");
  const [selectedStream, setSelectedStream] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  // Combine predefined and custom subjects
  const allAvailableSubjects = [
    ...UNIQUE_SUBJECTS,
    ...customSubjects.filter((s) => !UNIQUE_SUBJECTS.includes(s)),
  ].sort();

  // Filter subjects based on search
  const filteredSubjects = searchQuery
    ? allAvailableSubjects.filter((s) =>
        s.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : selectedStream && SUBJECT_STREAMS[selectedStream as keyof typeof SUBJECT_STREAMS]
    ? SUBJECT_STREAMS[selectedStream as keyof typeof SUBJECT_STREAMS]
    : allAvailableSubjects;

  const handleAddCustomSubject = () => {
    const trimmed = newSubject.trim();
    if (!trimmed) {
      toast.error("Please enter a subject name");
      return;
    }

    if (allAvailableSubjects.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      toast.error("This subject already exists");
      return;
    }

    if (onAddCustomSubject) {
      onAddCustomSubject(trimmed);
      onChange(trimmed);
      toast.success(`Added "${trimmed}" to your subjects`);
    }

    setNewSubject("");
    setShowAddDialog(false);
  };

  return (
    <>
      <div className={className}>
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger className="h-11">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {/* Quick filter by stream */}
            <div className="p-2 border-b border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="w-4 h-4 text-gray-500" />
                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Filter by Stream
                </span>
              </div>
              <div className="flex flex-wrap gap-1">
                <Badge
                  variant={selectedStream === "" ? "default" : "outline"}
                  className="cursor-pointer text-xs"
                  onClick={() => setSelectedStream("")}
                >
                  All
                </Badge>
                {Object.keys(SUBJECT_STREAMS).map((stream) => (
                  <Badge
                    key={stream}
                    variant={selectedStream === stream ? "default" : "outline"}
                    className="cursor-pointer text-xs"
                    onClick={() => setSelectedStream(stream)}
                  >
                    {stream}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Search */}
            <div className="p-2 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search subjects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9 pl-8 text-sm"
                />
              </div>
            </div>

            {/* Subject list */}
            <div className="max-h-64 overflow-y-auto">
              {filteredSubjects.length > 0 ? (
                filteredSubjects.map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                    {customSubjects.includes(subject) && (
                      <Badge variant="secondary" className="ml-2 text-[10px]">
                        Custom
                      </Badge>
                    )}
                  </SelectItem>
                ))
              ) : (
                <div className="p-4 text-center text-sm text-gray-500">
                  No subjects found
                </div>
              )}
            </div>

            {/* Add custom subject */}
            {onAddCustomSubject && (
              <div className="p-2 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-violet-600 hover:bg-violet-50 border-violet-300"
                  onClick={() => setShowAddDialog(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Custom Subject
                </Button>
              </div>
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Add Custom Subject Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Custom Subject</DialogTitle>
            <DialogDescription>
              Create a custom subject that's not in the predefined list.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="subject-name">Subject Name</Label>
              <Input
                id="subject-name"
                type="text"
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                placeholder="e.g., Vedic Mathematics"
                className="mt-1.5 h-11"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddCustomSubject();
                  }
                }}
                autoFocus
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddDialog(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleAddCustomSubject}
                className="flex-1 gradient-primary text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Subject
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
