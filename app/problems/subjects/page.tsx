import ManageSubjects from "@/app/_components/problems/ManageSubjects";
import { getCurrentUserSubjects } from "@/app/_lib/data-helpers";

export default async function ManageSubjectsPage() {
  const subjects = await getCurrentUserSubjects();

  return <ManageSubjects subjects={subjects ?? []} />;
}
