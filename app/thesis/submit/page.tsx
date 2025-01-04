import { getAuthors, getSupervisors } from '@/app/people/actions';
import { getUniversities } from '@/app/university/actions';
import SubmitThesisView from '../_views/submit-thesis-view';
import { getKeywords } from '../actions';
import { Suspense } from 'react';
import SubmitThesisPageLoading from '../_views/submit-thesis-page-loading';

// For disable cache behavior
export const revalidate = 0

async function getData() {
  return {
    authors: await getAuthors(),
    supervisors: await getSupervisors(),
    universities: await getUniversities(),
    keywords: await getKeywords(),
  };
}

export default async function ThesisSubmissionPage() {
  return (
    <Suspense fallback={<SubmitThesisPageLoading />}>
      <ThesisSubmissionPageContent />
    </Suspense>
  );
}

async function ThesisSubmissionPageContent() {
  const { authors, supervisors, universities, keywords } = await getData();

  return (
    <div className="space-y-6">
      <SubmitThesisView
        authors={authors}
        supervisors={supervisors}
        universities={universities}
        keywords={keywords}
      />
    </div>
  );
}