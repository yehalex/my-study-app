import Link from "next/link";

export default async function ProblemNav() {
  return (
    <nav className="font-medium text-lg p-4 md:p-6">
      <ul className="flex flex-col sm:flex-row gap-4 sm:gap-8 items-start sm:items-center">
        <li>
          <Link
            href="/problems"
            className="hover:text-gray-400 transition-colors"
          >
            Problem Sets
          </Link>
        </li>
        <li>
          <Link
            href="/problems/new"
            className="hover:text-gray-400 transition-colors"
          >
            Create New
          </Link>
        </li>
        <li>
          <Link
            href="/problems/manage"
            className="hover:text-gray-400 transition-colors"
          >
            Manage
          </Link>
        </li>
      </ul>
    </nav>
  );
}
