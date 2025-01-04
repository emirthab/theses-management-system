import { Suspense } from "react";
import PeoplePageLoading from "./_views/page-loading";
import PeopleView from "./_views/people-view";
import { getAuthors, getSupervisors } from "./actions";

// For disable cache behavior
export const revalidate = 0

const getData = async () => {
  return {
    authors: await getAuthors(),
    supervisors: await getSupervisors()
  }
}

export default async function PeoplePage() {
  return (
    <Suspense fallback={<PeoplePageLoading />}>
      <PageContent />
    </Suspense>
  )
}

export async function PageContent() {
  const { authors, supervisors } = await getData();

  return (
    <div className="space-y-6">
      <PeopleView authors={authors} supervisors={supervisors} />
    </div>
  );
}