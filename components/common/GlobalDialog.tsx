import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import React from "react";

interface GlobalDialogProps {
  trigger: React.ReactNode;
  title?: React.ReactNode;
  children: React.ReactNode;
  contentClassName?: string;
}

export const GlobalDialog: React.FC<GlobalDialogProps> = ({
  trigger,
  title,
  children,
  contentClassName = "",
}) => (
  <Dialog>
    <DialogTrigger asChild>
      {trigger}
    </DialogTrigger>
    <DialogContent className={contentClassName}>
      {title && (
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
      )}
      {children}
    </DialogContent>
  </Dialog>
); 