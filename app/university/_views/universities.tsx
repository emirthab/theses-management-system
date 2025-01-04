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

import { University } from '@prisma/client';
import { addUniversity, deleteUniversity, updateUniversity } from '../actions';
import DeleteAlert from '@/components/delete-alert';
import UniversityForm from './university-form';
import DialogFormWrapper from '@/components/dialog-form-wrapper';

const UniversitiesView = ({ universities }: { universities: University[] }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Universities</CardTitle>
            <CardDescription>Manage university records</CardDescription>
          </div>
          <DialogFormWrapper
            title='Add University'
            description='Enter the details of the new university.'
            buttonText='Save University'
            action={addUniversity}
            renderTrigger={
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add University
              </Button>
            }>
            <UniversityForm />
          </DialogFormWrapper>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {universities.length > 0 ? (
              universities.map((university) => (
                <TableRow key={university.university_id}>
                  <TableCell>{university.name}</TableCell>
                  <TableCell>{university.location}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <DialogFormWrapper
                      initialState={{
                        success: false,
                        message: '',
                        inputs: {
                          id: university.university_id,
                          name: university.name,
                          location: university.location,
                        }
                      }}
                      title='Edit University'
                      description='Enter the details of the new university.'
                      buttonText='Save University'
                      action={updateUniversity}
                      renderTrigger={
                        <Button variant="ghost" size="sm">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      }>
                      <UniversityForm />
                    </DialogFormWrapper>
                    <DeleteAlert
                      title='Delete University'
                      itemName={university.name}
                      action={() => deleteUniversity(university.university_id)}>
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

export default UniversitiesView;