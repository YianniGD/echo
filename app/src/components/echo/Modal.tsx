'use client';
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from '@/lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  contentClassName?: string;
  containerClassName?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, contentClassName, containerClassName }) => {

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent 
        className={cn(
          "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-surface-container shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
          containerClassName
        )}
      >
        {/* Render a single, styled title if provided, otherwise a hidden one for accessibility */}
        {title ? (
            <DialogHeader className="px-6 pt-6 text-left -mb-4">
                <DialogTitle className="font-serif text-headline-sm text-surface-on">
                    {title}
                </DialogTitle>
            </DialogHeader>
        ) : (
             <DialogHeader className="sr-only">
                <DialogTitle>Dialog</DialogTitle>
            </DialogHeader>
        )}
        
        {/* Adjust margin to compensate for grid gap when header is hidden */}
        <div className={cn("text-body-md text-surface-on-variant", { "-mt-12": !title }, contentClassName)}>
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
