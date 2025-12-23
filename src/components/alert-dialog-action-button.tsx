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
import { Button, ButtonProps } from "./ui/button";

interface AlertDialogActionButtonProps {
  action: () => void;
  buttonContent: React.ReactNode;
  dialogTitle: string;
  dialogDescription?: string;
  triggerButtonSize?: ButtonProps["size"];
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
          <AlertDialogCancel disabled={disabled}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              action();
            }}
            disabled={disabled || isPending}
          >
            {isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
