import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { useGetProfile, useUpdateProfile } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Save, Camera, Shield, User2, Phone, Mail, BadgeCheck } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().optional(),
});

function initials(first?: string, last?: string) {
  return `${first?.charAt(0) ?? ""}${last?.charAt(0) ?? ""}`.toUpperCase() || "?";
}

async function uploadAvatar(file: File, token: string): Promise<string | null> {
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

export default function PortalProfile() {
  const { data: profile, isLoading } = useGetProfile();
  const updateProfile = useUpdateProfile();
  const { toast } = useToast();
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: { firstName: "", lastName: "", phone: "" },
  });

  useEffect(() => {
    if (profile) {
      form.reset({ firstName: profile.firstName, lastName: profile.lastName, phone: profile.phone ?? "" });
      if (profile.avatarUrl) setAvatarPreview(profile.avatarUrl);
    }
  }, [profile, form]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPendingFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const onSubmit = async (values: z.infer<typeof profileSchema>) => {
    let avatarUrl: string | null | undefined = profile?.avatarUrl;
    if (pendingFile) {
      setUploadingPhoto(true);
      const uploaded = await uploadAvatar(pendingFile, token ?? "");
      setUploadingPhoto(false);
      if (uploaded) {
        avatarUrl = uploaded;
        setPendingFile(null);
      } else {
        toast({ title: "Photo upload failed — saving other changes", variant: "destructive" });
      }
    }
    try {
      await updateProfile.mutateAsync({
        data: { firstName: values.firstName, lastName: values.lastName, phone: values.phone || null, avatarUrl: avatarUrl ?? null },
      });
      toast({ title: "Profile updated successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
    } catch {
      toast({ title: "Failed to update profile", variant: "destructive" });
    }
  };

  const displayAvatar = avatarPreview ?? null;

  return (
    <PortalLayout>
      <div className="max-w-xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">My Profile</h1>
          <p className="text-muted-foreground">Update your account photo and contact information.</p>
        </div>

        {/* Hero account card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0a1628] via-[#0d2144] to-[#0a1f3a] p-6 text-white shadow-xl"
        >
          {/* Background bubbles */}
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-cyan-400/10 border border-cyan-400/15"
              style={{ width: `${32 + i * 20}px`, height: `${32 + i * 20}px`, right: `${8 + i * 12}%`, top: `${10 + i * 15}%` }}
              animate={{ y: [0, -12, 0], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2.5 + i * 0.6, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
            />
          ))}

          <div className="relative flex items-center gap-5">
            {/* Avatar */}
            <div className="relative shrink-0">
              <motion.div className="absolute inset-0 rounded-full bg-cyan-400/40 blur-md scale-110" />
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-cyan-400/50"
                animate={{ scale: [1, 1.08, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              />
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white text-2xl font-bold shadow-2xl overflow-hidden border-3 border-white/20">
                {displayAvatar ? (
                  <img src={displayAvatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span>{initials(profile?.firstName, profile?.lastName)}</span>
                )}
              </div>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-cyan-500 hover:bg-cyan-400 flex items-center justify-center shadow-lg transition-colors"
              >
                <Camera className="w-3.5 h-3.5 text-white" />
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              {isLoading ? (
                <div className="h-6 w-40 bg-white/10 rounded animate-pulse mb-2" />
              ) : (
                <h2 className="text-xl font-bold truncate">{profile?.firstName} {profile?.lastName}</h2>
              )}
              <div className="flex items-center gap-1.5 mt-1 text-cyan-300/80 text-sm">
                <Mail className="w-3.5 h-3.5" />
                <span className="truncate">{profile?.email}</span>
              </div>
              <div className="flex items-center gap-1.5 mt-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-semibold capitalize">
                  <BadgeCheck className="w-3 h-3" />
                  {profile?.role}
                </span>
                {pendingFile && (
                  <span className="text-xs text-amber-300">Photo ready to save</span>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Edit form */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <User2 className="w-5 h-5 text-primary" /> Edit Information
              </CardTitle>
              <CardDescription>Update your name and contact details.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="py-8 text-center text-muted-foreground">Loading profile...</div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField control={form.control} name="firstName" render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl><Input autoComplete="given-name" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="lastName" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl><Input autoComplete="family-name" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                    <FormField control={form.control} name="phone" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> Phone Number</FormLabel>
                        <FormControl><Input placeholder="+63 9XX XXX XXXX" autoComplete="tel" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <Button type="submit" className="flex items-center gap-2" disabled={updateProfile.isPending || uploadingPhoto}>
                      <Save className="w-4 h-4" />
                      {uploadingPhoto ? "Uploading photo..." : updateProfile.isPending ? "Saving..." : "Save Changes"}
                    </Button>
                  </form>
                </Form>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Security info */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
          <Card className="border-muted">
            <CardContent className="pt-5 pb-4 flex items-center gap-3 text-muted-foreground text-sm">
              <Shield className="w-4 h-4 shrink-0" />
              Your email address and password can only be changed by contacting Aquaventure staff.
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </PortalLayout>
  );
}
