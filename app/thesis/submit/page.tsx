import { getAuthors, getSupervisors } from '@/app/people/actions';
import { getUniversities } from '@/app/university/actions';
import SubmitThesisView from '../_views/submit-thesis-view';
import { getTopics } from '../actions';

export async function getData() {
  return {
    authors: await getAuthors(),
    supervisors: await getSupervisors(),
    universities: await getUniversities(),
    topics: await getTopics(),
  };
}

// For disable cache behavior
export const revalidate = 0

export default async function ThesisSubmissionPage() {
  const { authors, supervisors, universities, topics } = await getData();

  return (
    <SubmitThesisView
      authors={authors}
      supervisors={supervisors}
      universities={universities}
      topics={topics}
    />
  );
}