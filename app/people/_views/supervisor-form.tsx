"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ActionResponse } from "@/lib/types";

const SupervisorForm = ({ state }: { state?: ActionResponse }) => {
  return (
    <>
      <input type="hidden" name="id" defaultValue={state?.inputs?.id} />
      <div className="space-y-2">
        <label htmlFor="name">Supervisor Name</label>
        <Input name="name" placeholder="Enter supervisor name" defaultValue={state?.inputs?.name} />
        {state?.errors?.name && (
          <p id="name-error" className="text-sm text-red-500">
            {state.errors.name[0]}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <label htmlFor="name">Email</label>
        <Input name="email" type="email" placeholder="Enter supervisor email" defaultValue={state?.inputs?.email} />
        {state?.errors?.email && (
          <p id="email-error" className="text-sm text-red-500">
            {state.errors.email[0]}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <label htmlFor="name">Other Informations (optional)</label>
        <Textarea name="other_info" placeholder="Enter other informations" defaultValue={state?.inputs?.other_info} />
        {state?.errors?.other_info && (
          <p id="email-error" className="text-sm text-red-500">
            {state.errors.other_info[0]}
          </p>
        )}
      </div>
    </>
  )
}
export default SupervisorForm;