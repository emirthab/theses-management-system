"use client";

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import MultipleSelector from '@/components/ui/multiple-selector';
import { Prisma } from '@prisma/client';


const ThesisDetail = ({ thesis }: {
  thesis: Prisma.ThesisGetPayload<{
    include: {
      author: true,
      university: true,
      institute: true,
      supervisors: {
        include: {
          supervisor: true
        }
      },
      coSupervisors: {
        include: {
          supervisor: true
        }
      },
      keywords: {
        include: {
          keyword: true
        }
      },
    }
  }>
}) => {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2 text-sm">
          <label>Thesis Number (7 digits)</label>
          <Input defaultValue={thesis.thesis_no} disabled />
        </div>

        <div className="space-y-2 text-sm">
          <label>Thesis Type</label>
          <Input defaultValue={thesis.type.replace(/([a-z])([A-Z])/g, '$1 $2')} disabled />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className='space-y-2 text-sm'>
          <label>Title</label>
          <Input defaultValue={thesis.title} disabled />
        </div>

        <div className="space-y-2 text-sm">
          <label>Author</label>
          <Input defaultValue={thesis.author.name} disabled />
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <label>Keywords</label>
        <MultipleSelector
          disabled
          value={thesis.keywords.map(keyword => ({
            value: keyword.keyword_name,
            label: keyword.keyword_name,
          }))}
        />
      </div>

      <div className="space-y-2 text-sm">
        <label>Abstract</label>
        <Textarea defaultValue={thesis.abstract} disabled />
      </div>

      <div className="space-y-2 text-sm">
        <label >Supervisors</label>
        <MultipleSelector
          disabled
          value={thesis.supervisors.map(supervisor => ({
            value: supervisor.supervisor.name,
            label: supervisor.supervisor.name,
          }))}
        />
      </div>

      <div className="space-y-2 text-sm">
        <label >CO-Supervisors</label>
        <MultipleSelector
          disabled
          value={thesis.coSupervisors.map(supervisor => ({
            value: supervisor.supervisor.name,
            label: supervisor.supervisor.name,
          }))}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2 text-sm">
          <label>University</label>
          <Input defaultValue={thesis.university.name} disabled />
        </div>

        <div className="space-y-2 text-sm">
          <label>Institute</label>
          <Input defaultValue={thesis.institute.name} disabled />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2 text-sm">
          <label>Language</label>
          <Input defaultValue={thesis.language} disabled />
        </div>

        <div className="space-y-2 text-sm">
          <label>Submission Date</label>
          <Input type='date' disabled value={new Date(thesis.submission_date).toISOString().split('T')[0]} />
        </div>
      </div>
    </>
  )
}

export default ThesisDetail;