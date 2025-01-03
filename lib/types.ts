import { University } from "@prisma/client";
import { DialogProps } from "@radix-ui/react-dialog";

export interface ActionResponse {
  success: boolean;
  message: string;
  errors?: {
    [key: string]: string[];
  };
  inputs?: {
    [key: string]: any;
  };
}

export interface DialogFormWrapperProps extends DialogProps {
  title?: string;
  description?: string;
  onChangeState?: (state: ActionResponse) => void;
  initialState?: ActionResponse;
  universities?: University[],
  action: (prevState: ActionResponse | null, formData: FormData) => Promise<ActionResponse>;
  renderTrigger: React.ReactNode;
  children?: React.ReactNode;
  open?: boolean;
  setOpen?: (open: boolean) => void;
  buttonText?: string;
}