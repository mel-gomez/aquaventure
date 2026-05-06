import { useEffect } from "react";
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
import { UserCircle2, Save } from "lucide-react";

const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().optional(),
});

export default function PortalProfile() {
  const { data: profile, isLoading } = useGetProfile();
  const updateProfile = useUpdateProfile();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: { firstName: "", lastName: "", phone: "" },
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        firstName: profile.firstName,
        lastName: profile.lastName,
        phone: profile.phone ?? "",
      });
    }
  }, [profile, form]);

  const onSubmit = async (values: z.infer<typeof profileSchema>) => {
    try {
      await updateProfile.mutateAsync({
        data: {
          firstName: values.firstName,
          lastName: values.lastName,
          phone: values.phone || null,
        },
      });
      toast({ title: "Profile updated successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
    } catch {
      toast({ title: "Failed to update profile", variant: "destructive" });
    }
  };

  return (
    <PortalLayout>
      <div className="max-w-xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">My Profile</h1>
          <p className="text-muted-foreground">Update your account information.</p>
        </div>

        {/* Account Info (read-only) */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <UserCircle2 className="w-5 h-5 text-primary" /> Account Details
            </CardTitle>
            <CardDescription>Your login email cannot be changed.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 p-4 bg-muted/40 rounded-lg border">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-bold shrink-0">
                {profile?.firstName?.charAt(0).toUpperCase() ?? "?"}
              </div>
              <div>
                <div className="font-semibold text-lg">
                  {isLoading ? "Loading..." : `${profile?.firstName} ${profile?.lastName}`}
                </div>
                <div className="text-sm text-muted-foreground">{profile?.email}</div>
                <div className="text-xs mt-1 inline-flex px-2 py-0.5 rounded-full bg-primary/10 text-primary capitalize font-medium">
                  {profile?.role}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Edit Information</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="py-8 text-center text-muted-foreground">Loading profile...</div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl><Input placeholder="+63 9XX XXX XXXX" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="flex items-center gap-2" disabled={updateProfile.isPending}>
                    <Save className="w-4 h-4" />
                    {updateProfile.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>
      </div>
    </PortalLayout>
  );
}
