"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useResetableActionState } from "@/hooks/use-resetable-action-state";
import { useToast } from "@/hooks/use-toast";
import { DialogFormWrapperProps } from "@/lib/types";
import { cloneElement, isValidElement, useEffect, useState } from "react";
import { Button } from './ui/button';
import { LoadingSpinner } from './ui/loading-spinner';

const DialogFormWrapper = ({
  title = "",
  description = "",
  onChangeState,
  initialState = {
    success: false,
    message: '',
  },
  action,
  renderTrigger,
  children,
  open,
  setOpen,
  buttonText = "Save",
  ...props }: DialogFormWrapperProps) => {
  const [_open, _setOpen] = useState<boolean>(open ?? false);
  const [state, formAction, isPending, reset] = useResetableActionState(action, initialState)
  const onOpenChange = (open: boolean) => setOpen ? setOpen(_open) : _setOpen(open);
  const { toast } = useToast();

  useEffect(() => {
    onChangeState?.(state);
    if (state?.message && !state?.errors) {
      onOpenChange(false);
      toast({
        variant: state.success ? "default" : "destructive",
        description: state.message
      })
    }
  }, [state])

  useEffect(() => { if (!open && !_open) reset() }, [open, _open])

  return (
    <Dialog open={open ?? _open} onOpenChange={onOpenChange} {...props}>
      <DialogTrigger asChild>
        {renderTrigger}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <form action={formAction}>
          <div className="space-y-4 py-4">
            {isValidElement(children) ? cloneElement(children as React.ReactElement<any>, { state }) : children}
            <Button type='submit' className="w-full">
              {isPending ? <LoadingSpinner /> : buttonText}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default DialogFormWrapper;