'use client';

import { useState } from 'react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DialogFormWrapper from '@/components/dialog-form-wrapper';
import AuthorForm from './author-form';
import { addAuthor, addSuperVisor } from '../actions';
import { Prisma } from '@prisma/client';
import AuthorList from './author-list';
import SupervisorForm from './supervisor-form';
import SupervisorList from './supervisor-list';

const PeopleView = ({ authors, supervisors }: {
  authors: Prisma.AuthorGetPayload<{
    include: {
      _count: {
        select: { theses: true }
      }
    }
  }>[];
  supervisors: any[];
}) => {
  const [activeTab, setActiveTab] = useState('authors');

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className='space-y-2'>
            <CardTitle>People Management</CardTitle>
            <CardDescription>
              Manage authors and supervisors
            </CardDescription>
          </div>
          {activeTab === 'authors' ?
            <DialogFormWrapper
              title='Add Author'
              description='Enter the details of the new author.'
              buttonText='Save Author'
              action={addAuthor}
              renderTrigger={
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Author
                </Button>
              }>
              <AuthorForm />
            </DialogFormWrapper>
            :
            <DialogFormWrapper
              title='Add Supervisor'
              description='Enter the details of the new supervisor.'
              buttonText='Save Supervisor'
              action={addSuperVisor}
              renderTrigger={
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Supervisor
                </Button>
              }>
              <SupervisorForm />
            </DialogFormWrapper>
          }
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="authors">Authors</TabsTrigger>
            <TabsTrigger value="supervisors">Supervisors</TabsTrigger>
          </TabsList>
          <TabsContent value="authors">
            <AuthorList authors={authors} />
          </TabsContent>
          <TabsContent value="supervisors">
            <SupervisorList supervisors={supervisors} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

export default PeopleView;