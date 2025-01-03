import InstitutionsView from "./_views/institutions";
import UniversitiesView from "./_views/universities";
import { getInstitutes, getUniversities } from "./actions";

// For disable cache behavior
export const revalidate = 0

export const getData = async () => {
  return {
    universities: await getUniversities(),
    institutes: await getInstitutes(),
  }
}

export default async function UniversityPage() {
  const { universities, institutes } = await getData();

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <UniversitiesView universities={universities} />
        <InstitutionsView universities={universities} institutes={institutes} />
      </div>
    </div>
  );
}