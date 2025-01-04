"use client";

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Prisma } from "@prisma/client";
import ThesisDetail from './thesis-detail';

const SearchResultList = ({ theses }: {
  theses: Prisma.ThesisGetPayload<{
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
  }>[]
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Author</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>University</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {theses.map((thesis) => (
          <TableRow key={thesis.thesis_no}>
            <TableCell className="font-medium w-60">{thesis.title}</TableCell>
            <TableCell>{thesis.author.name}</TableCell>
            <TableCell>{thesis.type}</TableCell>
            <TableCell>{thesis.university.name}</TableCell>
            <TableCell className="text-right">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Thesis Details</DialogTitle>
                  </DialogHeader>
                  <ThesisDetail thesis={thesis} />
                </DialogContent>
              </Dialog>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default SearchResultList;