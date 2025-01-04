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
import AuthorFormDialog from './author-form';
import { addAuthor, deleteAuthor, updateAuthor } from '../actions';
import { Pencil, Trash2 } from 'lucide-react';
import { Prisma } from '@prisma/client';
import DeleteAlert from '@/components/delete-alert';

const AuthorList = ({ authors = [] }: {
  authors?: Prisma.AuthorGetPayload<{
    include: {
      _count: {
        select: { theses: true }
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
          <TableHead>Theses</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {authors.length === 0 ? (
          <TableRow>
            <TableCell colSpan={4} className="text-center">
              No data found
            </TableCell>
          </TableRow>
        ) : (
          authors.map((author) => (
            <TableRow key={author.author_id}>
              <TableCell className="font-medium">{author.name}</TableCell>
              <TableCell>{author.email}</TableCell>
              <TableCell>{author._count.theses}</TableCell>
              <TableCell className="text-right space-x-2">
                <DialogFormWrapper
                  initialState={{
                    success: false,
                    message: '',
                    inputs: {
                      id: author.author_id,
                      name: author.name,
                      email: author.email,
                      other_info: author.other_info,
                    }
                  }}
                  title='Edit Author'
                  description='Enter the details of the author.'
                  buttonText='Save Author'
                  action={updateAuthor}
                  renderTrigger={
                    <Button variant="ghost" size="sm">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  }>
                  <AuthorFormDialog />
                </DialogFormWrapper>
                <DeleteAlert
                  title='Delete Author'
                  itemName={author.name}
                  action={() => deleteAuthor(author.author_id)}>
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

export default AuthorList;