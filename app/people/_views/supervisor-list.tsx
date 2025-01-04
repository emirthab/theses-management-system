"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import DialogFormWrapper from '@/components/dialog-form-wrapper';
import { addAuthor, deleteSupervisor, updateSupervisor } from '../actions';
import { Pencil, Trash2 } from 'lucide-react';
import { Prisma } from '@prisma/client';
import DeleteAlert from '@/components/delete-alert';
import SupervisorForm from './supervisor-form';

const SupervisorList = ({ supervisors = [] }: {
  supervisors?: Prisma.SupervisorGetPayload<{
    include: {
      _count: {
        select: { thesisSupervisors: true, thesisCoSupervisors: true }
      }
    }
  }>[];
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Supervised</TableHead>
          <TableHead>Co Supervised</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {supervisors.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center">
              No data found
            </TableCell>
          </TableRow>
        ) : (
          supervisors.map((supervisor) => (
            <TableRow key={supervisor.supervisor_id}>
              <TableCell className="font-medium">{supervisor.name}</TableCell>
              <TableCell>{supervisor.email}</TableCell>
              <TableCell>{supervisor._count.thesisSupervisors}</TableCell>
              <TableCell>{supervisor._count.thesisCoSupervisors}</TableCell>
              <TableCell className="text-right space-x-2">
                <DialogFormWrapper
                  initialState={{
                    success: false,
                    message: '',
                    inputs: {
                      id: supervisor.supervisor_id,
                      name: supervisor.name,
                      email: supervisor.email,
                      other_info: supervisor.other_info,
                    }
                  }}
                  title='Edit Supervisor'
                  description='Enter the details of the supervisor.'
                  buttonText='Save Author'
                  action={updateSupervisor}
                  renderTrigger={
                    <Button variant="ghost" size="sm">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  }>
                  <SupervisorForm />
                </DialogFormWrapper>
                <DeleteAlert
                  title='Delete Supervisor'
                  itemName={supervisor.name}
                  action={() => deleteSupervisor(supervisor.supervisor_id)}>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </DeleteAlert>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}

export default SupervisorList;