import Link from "next/link";

export default async function ProblemNav() {
  return (
    <nav className="font-medium text-lg flex flex-col p-4 md:p-0 mt-4 rounded-lg md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 active">
      <ul className="flex gap-16 items-center">
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
