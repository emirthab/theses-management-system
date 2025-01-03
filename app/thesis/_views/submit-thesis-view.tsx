"use client";

import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import MultipleSelector from '@/components/ui/multiple-selector';
import { useEffect, useState } from 'react';
import { getInstitutesFromUniversity } from '@/app/university/actions';
import { useResetableActionState } from '@/hooks/use-resetable-action-state';
import { ActionResponse } from '@/lib/types';
import { Prisma, SubjectTopic, ThesisType, University } from '@prisma/client';
import { addThesis } from '../actions';

const SubmitThesisView = ({
  authors,
  supervisors,
  universities,
  topics,
}: {
  authors: Prisma.AuthorGetPayload<{
    include: {
      _count: {
        select: { theses: true }
      }
    }
  }>[],
  supervisors: Prisma.SupervisorGetPayload<{
    include: {
      _count: {
        select: { thesisSupervisors: true, thesisCoSupervisors: true }
      }
    }
  }>[],
  universities: University[],
  topics: string[],

}) => {
  const initialState = {
    success: false,
    message: '',
  } as ActionResponse;

  const [universityId, setUniversityId] = useState<number | null>(null);

  const [institutes, setInstitutes] = useState<Prisma.InstituteGetPayload<{
    include: {
      university: true;
    };
  }>[]>([]);

  const [state, formAction, isPending, reset] = useResetableActionState(addThesis, initialState);

  useEffect(() => {
    if (state.success) {
      reset()
    }
  }, [state.success])

  useEffect(() => {
    if (universityId) {
      getInstitutesFromUniversity(universityId).then((data: any) => {
        setInstitutes(data);
      });
    }
  }, [universityId]);

  const handleSubmit = async (formData: FormData) => {
    formAction(formData);
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Submit Thesis</CardTitle>
          <CardDescription>
            Enter the details of the thesis to be submitted to the system.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 text-sm">
                <label htmlFor="thesis_no">Thesis Number (7 digits)</label>
                <Input name="thesis_no" placeholder="Enter thesis number" defaultValue={state?.inputs?.thesis_no} />
                {state?.errors?.thesis_no && (
                  <p id="thesis_no-error" className="text-sm text-red-500">
                    {state.errors.thesis_no[0]}
                  </p>
                )}
              </div>
              <div className="space-y-2 text-sm">
                <label htmlFor="type">Thesis Type</label>
                <Select key={state?.success.toString()} name="type" defaultValue={state?.inputs?.type?.toString()}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select thesis type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {Object.values(ThesisType).map((type) => (
                        <SelectItem key={type} value={type}>{type.replace(/([a-z])([A-Z])/g, '$1 $2')}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {state?.errors?.type && (
                  <p id="type-error" className="text-sm text-red-500">
                    {state.errors.type[0]}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className='space-y-2 text-sm'>
                <label htmlFor="title">Title</label>
                <Input name="title" placeholder="Enter title" defaultValue={state?.inputs?.title} />
                {state?.errors?.title && (
                  <p id="title-error" className="text-sm text-red-500">
                    {state.errors.title[0]}
                  </p>
                )}
              </div>
              <div className="space-y-2 text-sm">
                <label htmlFor="title">Author</label>
                <Select key={state?.success.toString()} name="author_id" defaultValue={state?.inputs?.author_id?.toString()}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a author" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {authors.map((author) => (
                        <SelectItem key={author.author_id} value={author.author_id.toString()}>{author.name}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {state?.errors?.author_id && (
                  <p id="author_id-error" className="text-sm text-red-500">
                    {state.errors.author_id[0]}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <label htmlFor="topics">Topics</label>
              <MultipleSelector
                key={state?.success.toString()}
                name='topics'
                defaultOptions={topics.map(topic => ({ value: topic, label: topic }))}
                onChange={(options) => console.log(options)}
                creatable
                hidePlaceholderWhenSelected
                placeholder="Select topic(s)"
                emptyIndicator={
                  <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                    No topics found. You can write topic name and add.
                  </p>
                }
              />
              {state?.errors?.topics && (
                <p id="topics-error" className="text-sm text-red-500">
                  {state.errors.topics[0]}
                </p>
              )}
            </div>

            <div className="space-y-2 text-sm">
              <label htmlFor="title">Abstract</label>
              <Textarea name="abstract" placeholder="Enter abstract" defaultValue={state?.inputs?.abstract} />
              {state?.errors?.abstract && (
                <p id="abstract-error" className="text-sm text-red-500">
                  {state.errors.abstract[0]}
                </p>
              )}
            </div>


            <div className="space-y-2 text-sm">
              <label htmlFor="supervisors">Supervisors</label>
              <MultipleSelector
                key={state?.success.toString()}
                name='supervisors'
                defaultOptions={supervisors.map((supervisor) => {
                  return {
                    value: supervisor.supervisor_id.toString(),
                    label: supervisor.name,
                  };
                })}
                hidePlaceholderWhenSelected
                placeholder="Select supervisor(s)"
                emptyIndicator={
                  <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                    No supervisors found.
                  </p>
                }
              />
              {state?.errors?.supervisors && (
                <p id="abstract-error" className="text-sm text-red-500">
                  {state.errors.supervisors[0]}
                </p>
              )}
            </div>

            <div className="space-y-2 text-sm">
              <label htmlFor="title">CO-Supervisors</label>
              <MultipleSelector
                key={state?.success.toString()}
                name='co_supervisors'
                defaultOptions={supervisors.map((supervisor) => {
                  return {
                    value: supervisor.supervisor_id.toString(),
                    label: supervisor.name,
                  };
                })}
                hidePlaceholderWhenSelected
                placeholder="Select co-supervisor(s)"
                emptyIndicator={
                  <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                    No supervisors found.
                  </p>
                }
              />
              {state?.errors?.co_supervisors && (
                <p id="abstract-error" className="text-sm text-red-500">
                  {state.errors.co_supervisors[0]}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 text-sm">
                <label htmlFor="university_id">University</label>
                <Select key={state?.success.toString()} onValueChange={value => setUniversityId(parseInt(value))} name="university_id" defaultValue={state?.inputs?.university_id?.toString()}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a university" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {universities.map((university) => (
                        <SelectItem key={university.university_id} value={university.university_id.toString()}>{university.name}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {state?.errors?.university_id && (
                  <p id="university_id-error" className="text-sm text-red-500">
                    {state.errors.university_id[0]}
                  </p>
                )}
              </div>

              <div className="space-y-2 text-sm">
                <label htmlFor="institute_id">Institute</label>
                <Select key={state?.success.toString() + universityId} name="institute_id" defaultValue={state?.inputs?.institute_id?.toString()}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a institute" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {institutes.map((institute) => (
                        <SelectItem key={institute.institute_id} value={institute.institute_id.toString()}>{institute.name}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {state?.errors?.institute_id && (
                  <p id="university_id-error" className="text-sm text-red-500">
                    {state.errors.institute_id[0]}
                  </p>
                )}
              </div>
            </div>

            <Button type="submit" className="w-full">Submit Thesis</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
export default SubmitThesisView;