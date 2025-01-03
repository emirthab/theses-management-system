"use client";

import { Input } from '@/components/ui/input';
import { ActionResponse } from '@/lib/types';

const UniversityForm = ({ state }: { state?: ActionResponse }) => {
  return (
    <>
      <input type="hidden" name="id" defaultValue={state?.inputs?.id} />
      <div className="space-y-2">
        <label htmlFor="name">University Name</label>
        <Input name="name" placeholder="Enter university name" defaultValue={state?.inputs?.name} />
        {state?.errors?.name && (
          <p id="name-error" className="text-sm text-red-500">
            {state.errors.name[0]}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <label htmlFor="name">Location</label>
        <Input name="location" placeholder="Enter location" defaultValue={state?.inputs?.location} />
        {state?.errors?.location && (
          <p id="name-error" className="text-sm text-red-500">
            {state.errors?.location[0]}
          </p>
        )}
      </div>
    </>
  )
}

export default UniversityForm;