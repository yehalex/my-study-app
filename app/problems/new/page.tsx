import Form from "../../_components/problems/new/form";
import { getSubjects } from "../../_lib/data-service";

export default async function New() {
  const subjects = await getSubjects();
  return <Form subjects={subjects} />;
}
