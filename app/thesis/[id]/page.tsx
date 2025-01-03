'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Pencil, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

// Mock thesis data for demonstration
const mockThesis = {
  id: '1',
  thesisNumber: '1234567',
  title: 'Advanced Machine Learning Techniques for Natural Language Processing',
  abstract: 'This thesis explores cutting-edge machine learning techniques applied to natural language processing...',
  author: 'John Doe',
  year: 2023,
  type: 'Doctorate',
  university: 'Example University',
  institute: 'Institute of Science',
  pages: 245,
  language: 'English',
  submissionDate: '2023-05-15',
  topics: ['Machine Learning', 'Natural Language Processing', 'Artificial Intelligence'],
  keywords: ['ML', 'NLP', 'AI', 'Deep Learning'],
  supervisor: 'Dr. Robert Johnson',
  coSupervisor: 'Dr. Sarah Williams',
};

export default function ThesisDetailsPage({ params }: { params: { id: string } }) {
  const thesis = mockThesis; // In a real app, fetch thesis by params.id

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Thesis Details</h1>
        <div className="space-x-2">
          <Button variant="outline">
            <Pencil className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the thesis
                  and remove all associated data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction className="bg-destructive text-destructive-foreground">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{thesis.title}</CardTitle>
            <CardDescription>Thesis #{thesis.thesisNumber}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold">Author</h3>
                  <p className="text-muted-foreground">{thesis.author}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Year</h3>
                  <p className="text-muted-foreground">{thesis.year}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Type</h3>
                  <p className="text-muted-foreground">{thesis.type}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Language</h3>
                  <p className="text-muted-foreground">{thesis.language}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold">Abstract</h3>
                <p className="text-muted-foreground">{thesis.abstract}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold">University</h3>
                  <p className="text-muted-foreground">{thesis.university}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Institute</h3>
                  <p className="text-muted-foreground">{thesis.institute}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold">Supervisor</h3>
                  <p className="text-muted-foreground">{thesis.supervisor}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Co-Supervisor</h3>
                  <p className="text-muted-foreground">{thesis.coSupervisor || 'N/A'}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold">Topics</h3>
                <div className="flex gap-2 flex-wrap">
                  {thesis.topics.map((topic) => (
                    <span
                      key={topic}
                      className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold">Keywords</h3>
                <div className="flex gap-2 flex-wrap">
                  {thesis.keywords.map((keyword) => (
                    <span
                      key={keyword}
                      className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}