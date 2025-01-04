'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { Plus, Pencil, Trash2 } from 'lucide-react';

import { Prisma, University } from '@prisma/client';
import { addInstute, deleteInstute, updateInstute } from '../actions';
import DeleteAlert from '@/components/delete-alert';
import InstitutionsForm from './institutions-form';
import DialogFormWrapper from '@/components/dialog-form-wrapper';

const InstitutionsView = ({ universities, institutes }: {
  universities: University[];
  institutes: Prisma.InstituteGetPayload<{
    include: {
      university: true;
    };
  }>[];
}) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Institutes</CardTitle>
            <CardDescription>Manage Institute records</CardDescription>
          </div>
          <DialogFormWrapper
            title='Add Institute'
            description='Enter the details of the new institute.'
            buttonText='Save Institute'
            action={addInstute}
            renderTrigger={
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Institute
              </Button>
            }>
            <InstitutionsForm universities={universities} />
          </DialogFormWrapper>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>University</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {institutes.length > 0 ? (
              institutes.map((institute) => (
                <TableRow key={institute.institute_id}>
                  <TableCell>{institute.name}</TableCell>
                  <TableCell>{institute.university.name}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <DialogFormWrapper
                      initialState={{
                        success: false,
                        message: '',
                        inputs: {
                          id: institute.institute_id,
                          name: institute.name,
                          university_id: institute.university_id,
                        }
                      }}
                      title='Edit Institute'
                      description='Enter the details of the institute.'
                      buttonText='Save Institute'
                      action={updateInstute}
                      renderTrigger={
                        <Button variant="ghost" size="sm">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      }>
                      <InstitutionsForm universities={universities} />
                    </DialogFormWrapper>
                    <DeleteAlert
                      title='Delete Instutute'
                      itemName={institute.name}
                      action={() => deleteInstute(institute.institute_id)}>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </DeleteAlert>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  No data found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card >
  )
}

export default InstitutionsView;