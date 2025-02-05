"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPrimitive.Portal>
    {/* Fondo del overlay */}
    <DialogPrimitive.Overlay className='fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-200' />
    {/* Contenido del modal */}
    <DialogPrimitive.Content
      ref={ref}
      className={`fixed left-[50%] top-[50%] w-full max-w-4xl transform -translate-x-1/2 -translate-y-1/2 rounded-xl bg-spotify-black text-spotify-gray-100 p-6 shadow-lg border border-spotify-gray-200 ${className}`}
      {...props}
    >
      {children}
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

export const DialogHeader = ({ children }: { children: React.ReactNode }) => (
  <div className='mb-4 text-center'>{children}</div>
);

export const DialogTitle = DialogPrimitive.Title;
