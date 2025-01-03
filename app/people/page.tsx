import PeopleView from "./_views/people-view";
import { getAuthors, getSupervisors } from "./actions";

// For disable cache behavior
export const revalidate = 0

export const getData = async () => {
  return {
    authors: await getAuthors(),
    supervisors: await getSupervisors()
  }
}

export default async function InstitutionsPage() {
  const { authors, supervisors } = await getData();

  return (
    <div className="space-y-6">
      <PeopleView authors={authors} supervisors={supervisors} />
    </div>
  );
}