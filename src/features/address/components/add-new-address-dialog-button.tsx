"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusIcon } from "lucide-react";

export function AddNewAddressDialogButton() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" className="bg-cyan-500">
          <PlusIcon />
          Add New Address
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Address</DialogTitle>
          <DialogDescription className="text-sm">
            Add your new address to make it easier for you to order.
          </DialogDescription>
        </DialogHeader>
        <div></div>
      </DialogContent>
    </Dialog>
  );
}
