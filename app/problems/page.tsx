import Card from "../_components/Card";
import { getSubjects, getProblemCount } from "../_lib/data-service";

export default async function Problems() {
  const subjects = await getSubjects();

  return (
    <div className="flex flex-wrap gap-6">
      {subjects?.map((subject) => {
        return (
          <Card key={subject.id} hasRoute href={`/problems/${subject.id}`}>
            <div className="relative w-full h-full bg-gray-800 p-6 text-white border-gray-200 rounded-lg">
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {subject.subject}
              </h5>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
