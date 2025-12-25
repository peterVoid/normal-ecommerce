"use client";

import React, { JSX, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";

interface AlertDialogActionButtonProps {
  action: () => void;
  buttonContent: React.ReactNode;
  dialogTitle: string;
  dialogDescription?: string;
  triggerButtonSize?: "default" | "sm" | "lg" | "icon";
  disabled?: boolean;
  isPending?: boolean;
  className?: string;
}

export function AlertDialogActionButton({
  action,
  buttonContent,
  dialogTitle,
  dialogDescription,
  triggerButtonSize = "default",
  disabled = false,
  isPending = false,
  className,
}: AlertDialogActionButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          size={triggerButtonSize}
          className={className}
          disabled={disabled}
        >
          {buttonContent}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{dialogTitle}</AlertDialogTitle>
          {dialogDescription && (
            <AlertDialogDescription>{dialogDescription}</AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={disabled}
            className="bg-white font-semibold border-2 border-border"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              action();
            }}
            disabled={disabled || isPending}
            className="bg-red-500 font-semibold border-2 border-border"
          >
            {isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
