"use client";

import { Input } from '@/components/ui/input';
import { ActionResponse } from '@/lib/types';
import { University } from '@prisma/client';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';

const InstitutionsForm = ({
  universities = [],
  state
}: {
  universities?: University[];
  state?: ActionResponse;
}) => {
  return (
    <>
      <input type="hidden" name="id" defaultValue={state?.inputs?.id} />
      <div className="space-y-2">
        <label htmlFor="name">Institute Name</label>
        <Input name="name" placeholder="Enter institute name" defaultValue={state?.inputs?.name} />
        {state?.errors?.name && (
          <p id="name-error" className="text-sm text-red-500">
            {state.errors.name[0]}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <label htmlFor="university_id">University</label>
        <Select name="university_id" defaultValue={state?.inputs?.university_id.toString()}>
          <SelectTrigger>
            <SelectValue placeholder="Select a university" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Universities</SelectLabel>
              {universities.map((university) => (
                <SelectItem key={university.university_id} value={university.university_id.toString()}>{university.name}</SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        {state?.errors?.university_id && (
          <p id="name-error" className="text-sm text-red-500">
            {state.errors.university_id[0]}
          </p>
        )}
      </div>
    </>
  )
}

export default InstitutionsForm;