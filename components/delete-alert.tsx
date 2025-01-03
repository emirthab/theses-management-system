"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { AlertDialogProps } from '@radix-ui/react-alert-dialog';
import { ActionResponse } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { LoadingSpinner } from './ui/loading-spinner';
import { Button } from './ui/button';

const DeleteAlert = ({ title, itemName, action, children, open, setOpen, ...props }:
  AlertDialogProps & {
    title?: string,
    itemName?: string,
    action?: () => Promise<ActionResponse>,
    children?: React.ReactNode,
    open?: boolean,
    setOpen?: (open: boolean) => void,
  }) => {

  const { toast } = useToast();

  const [actionLoading, setActionLoading] = useState(false);
  const [_open, _setOpen] = useState<boolean>(open ?? false);

  const onOpenChange = (open: boolean) => setOpen ? setOpen(_open) : _setOpen(open);

  const handleAction = async () => {
    setActionLoading(true);
    if (!action) {
      setActionLoading(false);
      return;
    }
    const response = await action();
    if (response.success) {
      toast({
        description: response.message
      })
    }
    else {
      toast({
        variant: "destructive",
        description: response.message,
      })
    }
    setActionLoading(false);
    onOpenChange(false);
  }

  return (
    <AlertDialog open={open ?? _open} onOpenChange={onOpenChange} {...props}>
      <AlertDialogTrigger asChild>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete <b>"{itemName}"</b> ?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex justify-end space-x-2">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button onClick={handleAction}>
            {actionLoading ? <LoadingSpinner /> : "Delete"}
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteAlert;