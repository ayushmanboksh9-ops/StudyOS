import { useState, useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
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
import { EXAMS, JEE_SUBJECTS, NEET_SUBJECTS } from "@/constants/subjects";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/lib/supabase";
import { Users, Eye, EyeOff } from "lucide-react";

export default function SettingsPage() {
  const { user } = useAuthStore();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    exam: user?.exam || "",
    subjects: user?.subjects || [],
  });
  const [publicProfile, setPublicProfile] = useState(true);
  const [bio, setBio] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadUserProfile();
  }, [user?.id]);

  const loadUserProfile = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("public_profile, bio, exam_target")
        .eq("id", user.id)
        .single();

      if (error) throw error;

      if (data) {
        setPublicProfile(data.public_profile ?? true);
        setBio(data.bio || "");
        setFormData(prev => ({ ...prev, exam: data.exam_target || prev.exam }));
      }
    } catch (error: any) {
      console.error("Error loading profile:", error);
    }
  };

  const availableSubjects = formData.exam?.includes("JEE") ? JEE_SUBJECTS : NEET_SUBJECTS;

  const handleSave = async () => {
    if (!user?.id) return;

    try {
      setSaving(true);

      const { error } = await supabase
        .from("user_profiles")
        .update({
          public_profile: publicProfile,
          bio: bio,
          exam_target: formData.exam,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;

      toast.success("Settings saved successfully!");
    } catch (error: any) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const toggleSubject = (subject: string) => {
    setFormData({
      ...formData,
      subjects: formData.subjects.includes(subject)
        ? formData.subjects.filter((s) => s !== subject)
        : [...formData.subjects, subject],
    });
  };

  return (
    <div className="max-w-3xl space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account and preferences</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Full Name</Label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1"
            />
          </div>

          <div>
            <Label>Email Address</Label>
            <Input
              type="email"
              value={formData.email}
              disabled
              className="mt-1 bg-gray-50"
            />
            <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Academic Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Target Exam</Label>
            <Select value={formData.exam} onValueChange={(v) => setFormData({ ...formData, exam: v, subjects: [] })}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select your exam" />
              </SelectTrigger>
              <SelectContent>
                {EXAMS.map((exam) => (
                  <SelectItem key={exam} value={exam}>
                    {exam}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {formData.exam && (
            <div>
              <Label className="mb-3 block">Select Subjects</Label>
              <div className="space-y-3">
                {availableSubjects.map((subject) => (
                  <div key={subject} className="flex items-center gap-3">
                    <Checkbox
                      id={subject}
                      checked={formData.subjects.includes(subject)}
                      onCheckedChange={() => toggleSubject(subject)}
                    />
                    <Label htmlFor={subject} className="cursor-pointer font-normal">
                      {subject}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-2 border-violet-200 bg-gradient-to-br from-violet-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-violet-600" />
            Community Privacy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-4 p-4 bg-white rounded-xl border border-violet-100">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="public-profile" className="font-semibold text-gray-900">
                  Show my study stats publicly
                </Label>
                <Switch
                  id="public-profile"
                  checked={publicProfile}
                  onCheckedChange={setPublicProfile}
                />
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                When enabled, your study statistics (time, questions solved, accuracy) will be
                visible in the Community Overview. Your personal notes, schedules, and exam
                results remain private.
              </p>
            </div>
            <div className="flex-shrink-0">
              {publicProfile ? (
                <Eye className="w-6 h-6 text-green-600" />
              ) : (
                <EyeOff className="w-6 h-6 text-gray-400" />
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="bio">Profile Bio (Optional)</Label>
            <Input
              id="bio"
              type="text"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="e.g., JEE 2026 Aspirant"
              maxLength={100}
              className="mt-1.5"
            />
            <p className="text-xs text-gray-500 mt-1">
              {bio.length}/100 characters
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>About StudyOS</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-gray-600">
            <p><strong>Version:</strong> 1.0.0</p>
            <p><strong>Built for:</strong> Serious JEE & NEET aspirants</p>
            <p className="pt-4 italic">
              "Success is the sum of small efforts repeated day in and day out."
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button 
          onClick={handleSave} 
          disabled={saving}
          className="gradient-primary text-white"
        >
          {saving ? "Saving..." : "Save Changes"}
        </Button>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
