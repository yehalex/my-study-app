import Card from "../_components/Card";
import { getCurrentUserSubjects } from "../_lib/data-helpers";

export default async function Problems() {
  const subjects = await getCurrentUserSubjects();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
      {subjects?.map((subject) => {
        return (
          <Card key={subject.id} hasRoute href={`/problems/${subject.id}`}>
            <div className="w-full h-full bg-gray-800 p-4 sm:p-6 text-white border-gray-200 rounded-lg">
              <h5 className="mb-2 text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {subject.subject}
              </h5>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
