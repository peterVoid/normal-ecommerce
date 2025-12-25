"use client";

import { useState } from "react";
import { deleteUser } from "@/app/(admin)/admin/users/actions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2, ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface DeleteUserDialogProps {
  user: {
    id: string;
    name: string;
    email: string;
    isAdmin: boolean | null;
    _count: {
      orders: number;
    };
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteUserDialog({
  user,
  open,
  onOpenChange,
}: DeleteUserDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsLoading(true);
    const result = await deleteUser(user.id);
    setIsLoading(false);

    if (result.success) {
      toast.success("User deleted successfully");
      onOpenChange(false);
      router.refresh();
    } else {
      toast.error(result.error || "Failed to delete user");
    }
  };

  const isProtected = user.isAdmin || user._count.orders > 0;

  if (isProtected) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md border-2 border-border shadow-shadow rounded-base text-black">
          <DialogHeader>
            <DialogTitle className="font-heading text-2xl flex items-center gap-2 text-red-600">
              <ShieldAlert className="h-6 w-6" />
              Protected Account
            </DialogTitle>
            <DialogDescription className="font-base">
              Deletion is restricted for this account type.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="p-4 rounded-base border-2 border-red-500 bg-red-50">
              <div className="font-base text-sm text-red-800 space-y-2">
                <p className="font-heading underline">
                  Reason for restriction:
                </p>
                <ul className="list-disc pl-4 space-y-1 text-xs">
                  {user.isAdmin && (
                    <li>
                      <strong>Admin Role:</strong> Admins must be demoted to
                      regular users before deletion for safety.
                    </li>
                  )}
                  {user._count.orders > 0 && (
                    <li>
                      <strong>Data Preservation:</strong> This user has{" "}
                      {user._count.orders} transaction record(s). Deletion is
                      blocked to preserve order history.
                    </li>
                  )}
                </ul>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-base border-2 border-border bg-secondary-background">
              <div className="h-12 w-12 rounded-base border-2 border-border bg-main/10 flex items-center justify-center font-heading text-lg">
                {user.name.charAt(0)}
              </div>
              <div>
                <p className="font-heading">{user.name}</p>
                <p className="text-sm text-gray-500 font-base">{user.email}</p>
                <div className="flex gap-2 items-center mt-1">
                  {user.isAdmin && (
                    <Badge className="bg-[#A3E635] text-black text-[10px] border-2 border-black">
                      ADMIN
                    </Badge>
                  )}
                  {user._count.orders > 0 && (
                    <Badge className="bg-blue-400 text-black text-[10px] border-2 border-black">
                      {user._count.orders} ORDERS
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              onClick={() => onOpenChange(false)}
              className="border-2 shadow-shadow w-full font-heading"
            >
              Understand
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-2 border-border shadow-shadow rounded-base">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-red-600" />
            Delete User
          </DialogTitle>
          <DialogDescription className="font-base">
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="p-4 rounded-base border-2 border-red-300 bg-red-50">
            <p className="font-base text-sm text-red-800">
              Are you sure you want to delete{" "}
              <strong className="font-heading">{user.name}</strong>? All of
              their data will be permanently removed from the system.
            </p>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-base border-2 border-border bg-secondary-background">
            <div className="h-12 w-12 rounded-base border-2 border-border bg-main/10 flex items-center justify-center font-heading text-lg">
              {user.name.charAt(0)}
            </div>
            <div>
              <p className="font-heading">{user.name}</p>
              <p className="text-sm text-gray-500 font-base">{user.email}</p>
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
            onClick={handleDelete}
            disabled={isLoading}
            className="border-2 shadow-shadow bg-red-500 hover:bg-red-600 text-white"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete User
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
