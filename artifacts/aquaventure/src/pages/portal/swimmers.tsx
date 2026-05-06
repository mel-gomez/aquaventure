import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { useGetMySwimmerProfiles, useGetMyEnrollments, useCreateSwimmerProfile, useUpdateSwimmerProfile } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Camera, Trophy, ClipboardCheck, Star, UserPlus, Pencil, Waves } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

const LEVEL_COLORS: Record<string, string> = {
  beginner: "from-emerald-400 to-teal-500",
  intermediate: "from-blue-400 to-cyan-500",
  advanced: "from-purple-400 to-indigo-500",
  competitive: "from-amber-400 to-orange-500",
};

const AVATAR_GRADIENTS = [
  "from-cyan-400 to-blue-600",
  "from-teal-400 to-emerald-600",
  "from-purple-400 to-pink-600",
  "from-amber-400 to-orange-600",
  "from-rose-400 to-red-600",
];

function avatarGradient(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_GRADIENTS[Math.abs(hash) % AVATAR_GRADIENTS.length];
}

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

async function uploadPhoto(file: File, token: string): Promise<string | null> {
  try {
    const res = await fetch("/api/storage/uploads/request-url", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name: file.name, size: file.size, contentType: file.type }),
    });
    if (!res.ok) return null;
    const { uploadURL, objectPath } = await res.json();
    const put = await fetch(uploadURL, { method: "PUT", body: file, headers: { "Content-Type": file.type } });
    if (!put.ok) return null;
    return `/api/storage${objectPath}`;
  } catch {
    return null;
  }
}

interface EditModalProps {
  open: boolean;
  onClose: () => void;
  profile?: { id: number; swimmerName: string; avatarUrl?: string | null; bio?: string | null; level?: string | null };
  swimmerName?: string;
  token: string;
}

function EditModal({ open, onClose, profile, swimmerName, token }: EditModalProps) {
  const [name, setName] = useState(profile?.swimmerName ?? swimmerName ?? "");
  const [bio, setBio] = useState(profile?.bio ?? "");
  const [level, setLevel] = useState(profile?.level ?? "beginner");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(profile?.avatarUrl ?? null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const createProfile = useCreateSwimmerProfile();
  const updateProfile = useUpdateSwimmerProfile();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPendingFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    setUploading(true);
    let finalAvatarUrl = profile?.avatarUrl ?? null;
    if (pendingFile) {
      const uploaded = await uploadPhoto(pendingFile, token);
      if (uploaded) finalAvatarUrl = uploaded;
      else toast({ title: "Photo upload failed", variant: "destructive" });
    }
    try {
      if (profile) {
        await updateProfile.mutateAsync({ id: profile.id, data: { swimmerName: name, avatarUrl: finalAvatarUrl, bio: bio || null, level: level || null } });
      } else {
        await createProfile.mutateAsync({ data: { swimmerName: name, avatarUrl: finalAvatarUrl, bio: bio || null, level: level || null } });
      }
      toast({ title: profile ? "Profile updated!" : "Swimmer profile created!" });
      queryClient.invalidateQueries({ queryKey: ["/swimmers/my"] });
      onClose();
    } catch {
      toast({ title: "Failed to save profile", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{profile ? "Edit Swimmer Profile" : "Create Swimmer Profile"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-5 py-2">
          {/* Photo */}
          <div className="flex flex-col items-center gap-3">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="relative group"
            >
              <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${avatarGradient(name || "?")} flex items-center justify-center text-white text-2xl font-bold shadow-lg overflow-hidden`}>
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span>{initials(name || "?")}</span>
                )}
              </div>
              <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera className="w-6 h-6 text-white" />
              </div>
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
            <p className="text-xs text-muted-foreground">Click photo to upload</p>
          </div>

          <div className="space-y-3">
            <div>
              <Label>Swimmer Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Maria" className="mt-1" />
            </div>
            <div>
              <Label>Level</Label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="mt-1 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="competitive">Competitive</option>
              </select>
            </div>
            <div>
              <Label>Bio / Notes (optional)</Label>
              <Textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="e.g. Loves butterfly stroke, working on turns…" className="mt-1 resize-none" rows={3} />
            </div>
          </div>
          <div className="flex gap-3 pt-1">
            <Button onClick={handleSave} disabled={uploading || !name.trim()} className="flex-1">
              {uploading ? "Saving..." : "Save Profile"}
            </Button>
            <Button variant="outline" onClick={onClose}>Cancel</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

type EnrichedProfile = {
  id: number;
  swimmerName: string;
  avatarUrl?: string | null;
  bio?: string | null;
  level?: string | null;
  programName?: string | null;
  attendanceRate?: number | null;
  skillCount?: number;
  enrollmentCount?: number;
};

function SwimmerCard({ profile, onEdit }: { profile: EnrichedProfile; onEdit: () => void }) {
  const grad = avatarGradient(profile.swimmerName);
  const levelGrad = LEVEL_COLORS[profile.level ?? "beginner"] ?? "from-cyan-400 to-blue-600";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative overflow-hidden rounded-2xl shadow-2xl"
    >
      {/* Ocean gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a1628] via-[#0d2144] to-[#0a1f3a]" />

      {/* Animated bubbles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-cyan-400/10 border border-cyan-400/20"
          style={{
            width: `${24 + i * 14}px`,
            height: `${24 + i * 14}px`,
            left: `${10 + i * 15}%`,
            bottom: `-${10 + i * 8}px`,
          }}
          animate={{ y: [0, -(80 + i * 30), 0], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 3 + i * 0.8, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
        />
      ))}

      {/* Wave at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-16 opacity-20">
        <svg viewBox="0 0 400 60" preserveAspectRatio="none" className="w-full h-full">
          <motion.path
            d="M0,30 C80,10 160,50 240,30 C320,10 360,40 400,30 L400,60 L0,60 Z"
            fill="#00c4cc"
            animate={{ d: ["M0,30 C80,10 160,50 240,30 C320,10 360,40 400,30 L400,60 L0,60 Z", "M0,40 C100,20 180,60 260,35 C340,15 370,45 400,38 L400,60 L0,60 Z", "M0,30 C80,10 160,50 240,30 C320,10 360,40 400,30 L400,60 L0,60 Z"] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 p-8 flex flex-col items-center text-center">
        {/* Edit button */}
        <button
          onClick={onEdit}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <Pencil className="w-3.5 h-3.5 text-white/70" />
        </button>

        {/* Avatar */}
        <motion.div
          className="relative mb-5"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 blur-md opacity-60 scale-110" />
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-cyan-400/60"
            animate={{ scale: [1, 1.08, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className={`relative w-28 h-28 rounded-full bg-gradient-to-br ${grad} flex items-center justify-center text-white text-3xl font-bold shadow-2xl overflow-hidden border-4 border-white/20`}>
            {profile.avatarUrl ? (
              <img src={profile.avatarUrl} alt={profile.swimmerName} className="w-full h-full object-cover" />
            ) : (
              <span>{initials(profile.swimmerName)}</span>
            )}
          </div>
        </motion.div>

        {/* Name */}
        <motion.h2
          className="text-2xl font-bold text-white mb-1 tracking-wide"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {profile.swimmerName}
        </motion.h2>

        {/* Level badge */}
        <motion.div
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r ${levelGrad} text-white text-xs font-semibold mb-5 shadow-lg`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Waves className="w-3 h-3" />
          {(profile.level ?? "beginner").charAt(0).toUpperCase() + (profile.level ?? "beginner").slice(1)}
        </motion.div>

        {/* Program */}
        {profile.programName && (
          <p className="text-cyan-300/80 text-sm mb-5 font-medium">{profile.programName}</p>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 w-full">
          {[
            { icon: ClipboardCheck, label: "Sessions", value: profile.enrollmentCount ?? 0, color: "text-emerald-400" },
            { icon: Star, label: "Attendance", value: profile.attendanceRate != null ? `${profile.attendanceRate}%` : "—", color: "text-amber-400" },
            { icon: Trophy, label: "Skills", value: profile.skillCount ?? 0, color: "text-purple-400" },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10"
              whileHover={{ backgroundColor: "rgba(255,255,255,0.1)" }}
            >
              <stat.icon className={`w-4 h-4 ${stat.color} mx-auto mb-1`} />
              <div className={`text-lg font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-white/50 text-xs">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Bio */}
        {profile.bio && (
          <p className="mt-4 text-white/60 text-xs italic leading-relaxed px-2">"{profile.bio}"</p>
        )}
      </div>
    </motion.div>
  );
}

export default function PortalSwimmers() {
  const { data: profiles, isLoading } = useGetMySwimmerProfiles();
  const { data: enrollments } = useGetMyEnrollments();
  const { token } = useAuth();
  const [editProfile, setEditProfile] = useState<EnrichedProfile | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [createName, setCreateName] = useState("");

  const enrollmentNames = [...new Set(enrollments?.map((e) => e.swimmerName) ?? [])];
  const profileNames = new Set(profiles?.map((p) => p.swimmerName) ?? []);
  const unprofiledNames = enrollmentNames.filter((n) => !profileNames.has(n));

  return (
    <PortalLayout>
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">My Swimmers</h1>
            <p className="text-muted-foreground">Personalize each swimmer's profile — add a photo, bio, and track their journey.</p>
          </div>
          {unprofiledNames.length > 0 && (
            <Button
              onClick={() => { setCreateName(unprofiledNames[0] ?? ""); setShowCreate(true); }}
              className="flex items-center gap-2 shrink-0"
            >
              <UserPlus className="w-4 h-4" /> Add Profile
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="text-center py-16 text-muted-foreground">Loading swimmers...</div>
        ) : !profiles?.length && enrollmentNames.length === 0 ? (
          <div className="text-center py-20 border border-dashed rounded-2xl">
            <Waves className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
            <p className="text-lg font-semibold mb-2">No Swimmers Yet</p>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              Enroll a swimmer in a class to get started. Swimmer profiles appear here after enrollment.
            </p>
          </div>
        ) : (
          <>
            {/* Unprofiled swimmers prompt */}
            {unprofiledNames.length > 0 && !profiles?.length && (
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-center justify-between gap-4">
                <p className="text-sm text-muted-foreground">
                  You have {unprofiledNames.length} enrolled swimmer{unprofiledNames.length !== 1 ? "s" : ""} without a profile yet.
                </p>
                <Button variant="outline" size="sm" onClick={() => { setCreateName(unprofiledNames[0] ?? ""); setShowCreate(true); }}>
                  Set up now
                </Button>
              </div>
            )}

            <motion.div
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
            >
              {profiles?.map((profile) => (
                <SwimmerCard
                  key={profile.id}
                  profile={profile as EnrichedProfile}
                  onEdit={() => setEditProfile(profile as EnrichedProfile)}
                />
              ))}

              {/* Unregistered swimmer placeholders */}
              {unprofiledNames.map((name) => (
                <motion.button
                  key={name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => { setCreateName(name); setShowCreate(true); }}
                  className="relative overflow-hidden rounded-2xl border-2 border-dashed border-muted-foreground/20 hover:border-primary/40 transition-colors bg-muted/20 hover:bg-muted/40 p-8 flex flex-col items-center gap-3 text-center group"
                >
                  <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center text-2xl font-bold text-muted-foreground group-hover:text-primary transition-colors">
                    {initials(name)}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{name}</p>
                    <p className="text-sm text-muted-foreground mt-1">Click to create profile</p>
                  </div>
                  <UserPlus className="w-5 h-5 text-muted-foreground/50 group-hover:text-primary transition-colors" />
                </motion.button>
              ))}
            </motion.div>
          </>
        )}
      </div>

      {/* Edit modal */}
      <AnimatePresence>
        {editProfile && (
          <EditModal
            open={true}
            onClose={() => setEditProfile(null)}
            profile={editProfile}
            token={token ?? ""}
          />
        )}
        {showCreate && (
          <EditModal
            open={true}
            onClose={() => setShowCreate(false)}
            swimmerName={createName}
            token={token ?? ""}
          />
        )}
      </AnimatePresence>
    </PortalLayout>
  );
}
