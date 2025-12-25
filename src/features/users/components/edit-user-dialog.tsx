"use client";

import { useState } from "react";
import { toggleAdminRole } from "@/app/(admin)/admin/users/actions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, User, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface EditUserDialogProps {
  user: {
    id: string;
    name: string;
    email: string;
    isAdmin: boolean | null;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditUserDialog({
  user,
  open,
  onOpenChange,
}: EditUserDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const newRole = !user.isAdmin;

  const handleToggleRole = async () => {
    setIsLoading(true);
    const result = await toggleAdminRole(user.id, newRole);
    setIsLoading(false);

    if (result.success) {
      toast.success(`User role updated to ${newRole ? "Admin" : "User"}`);
      onOpenChange(false);
      router.refresh();
    } else {
      toast.error(result.error || "Failed to update role");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-2 border-border shadow-shadow rounded-base">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl">
            Edit User Role
          </DialogTitle>
          <DialogDescription className="font-base">
            Change the role for {user.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center justify-between p-4 rounded-base border-2 border-border bg-secondary-background">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-base border-2 border-border bg-main/10 flex items-center justify-center font-heading text-lg">
                {user.name.charAt(0)}
              </div>
              <div>
                <p className="font-heading">{user.name}</p>
                <p className="text-sm text-gray-500 font-base">{user.email}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-base border-2 border-border">
            <div className="flex items-center gap-2">
              <span className="font-base text-sm">Current Role:</span>
              <Badge
                variant={user.isAdmin ? "default" : "neutral"}
                className={`rounded-base border-2 border-border px-3 py-1 font-heading shadow-shadow ${
                  user.isAdmin
                    ? "bg-[#A3E635] text-black"
                    : "bg-white text-black"
                }`}
              >
                {user.isAdmin ? (
                  <>
                    <ShieldCheck className="h-4 w-4 mr-1" />
                    ADMIN
                  </>
                ) : (
                  <>
                    <User className="h-4 w-4 mr-1" />
                    USER
                  </>
                )}
              </Badge>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-base border-2 border-dashed border-border bg-main/5">
            <div className="flex items-center gap-2">
              <span className="font-base text-sm">New Role:</span>
              <Badge
                variant={newRole ? "default" : "neutral"}
                className={`rounded-base border-2 border-border px-3 py-1 font-heading shadow-shadow ${
                  newRole ? "bg-[#A3E635] text-black" : "bg-white text-black"
                }`}
              >
                {newRole ? (
                  <>
                    <ShieldCheck className="h-4 w-4 mr-1" />
                    ADMIN
                  </>
                ) : (
                  <>
                    <User className="h-4 w-4 mr-1" />
                    USER
                  </>
                )}
              </Badge>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="border-2 shadow-shadow"
          >
            Cancel
          </Button>
          <Button
            onClick={handleToggleRole}
            disabled={isLoading}
            className="border-2 shadow-shadow"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Update Role
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
