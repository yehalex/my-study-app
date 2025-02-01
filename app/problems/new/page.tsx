import Form from "../../_components/problems/new/form";
import { getCurrentUserSubjects } from "@/app/_lib/data-helpers";

export default async function New() {
  const subjects = await getCurrentUserSubjects();
  return <Form subjects={subjects} />;
}
